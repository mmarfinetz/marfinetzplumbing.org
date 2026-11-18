/* Sonde Locator: page logic (iPhone Safari first; works in any modern browser). */
(function () {
  'use strict';
  const D = window.SondeDSP;
  const $ = (id) => document.getElementById(id);
  const FFT = 32768;
  const TAU = { fast: 0.1, normal: 0.3, deep: 0.8 }; // lock-in time constants (s)
  const LOCK_SNR = 15, SHOW_SNR = 12, LIVE_SNR = 10, CAPTURE_SNR = 6;
  const PEAK_DECAY = Math.exp(-0.05 / 30); // peak marker fades over ~30 s so a stale peak clears itself
  const SIM_K = 1e-3 * 216; // practice mode: 0.001 full-scale with the sonde 6 units below the coil
  const now = () => performance.now();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('sondeLocator.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sondeLocator.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  const S = {
    set: Object.assign({ units: 'ft', resp: 'normal', mains: 60, tone: false }, store.get('settings', {})),
    cal: store.get('cal', {}),
    marks: store.get('marks', []),
    bands: D.BANDS.map((b) => Object.assign({}, b)),
    ctx: null, mode: null, stream: null, an: null, lockNode: null, simNode: null, toneOsc: null, toneGain: null,
    spec: null, floor: null, other: null, hum: null, timer: 0, wl: null,
    lock: null, cand: null, candN: 0, li: null, live: null, peakHold: 0, capture: null, last: null, ratio: {},
    rmsDb: -Infinity, clipAt: -1e9, toneHz: 0, warnings: {}, gen: 0, busy: false, recent: [], steady: false,
  };
  const tau = () => TAU[S.set.resp] || 0.3;
  const U = () => S.set.units;
  const uName = () => (U() === 'ft' ? 'ft' : 'm');
  const toM = (v) => (U() === 'ft' ? v * D.FT : v);
  const fromM = (m) => (U() === 'ft' ? m / D.FT : m);
  const fmtLen = (m) => D.formatLen(m, U());
  const fmtPm = (m) => (U() === 'ft' ? (m < 0.0254 ? '± <1″' : '± ' + fmtLen(m)) : (m < 0.01 ? '± <1 cm' : '± ' + fmtLen(m)));
  // Length inputs keep their exact metres value across unit switches (so 3 ft → m → ft stays 3).
  const LEN_FIELDS = ['calDist', 'liftH', 'poleL'];
  const lenM = (id) => { const el = $(id); return el.dataset.m != null ? +el.dataset.m : toM(parseFloat(el.value)); };
  LEN_FIELDS.forEach((id) => $(id).addEventListener('input', () => { delete $(id).dataset.m; }));
  const methodName = (k) => ({ live: 'live', lift: 'lift test', poles: 'pole to pole' }[k] || k || '');
  const fmtSig = (a) => {
    const v = a * 1e6;
    return v >= 100 ? Math.round(v).toLocaleString() : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  };
  const saveSettings = () => store.set('settings', S.set);

  /* ---------- warnings ---------- */
  function setWarn(key, html) {
    if (html) S.warnings[key] = html; else delete S.warnings[key];
    const keys = Object.keys(S.warnings);
    $('warn').innerHTML = keys.map((k) => `<li>${S.warnings[k]}</li>`).join('');
    $('warn').hidden = !keys.length;
  }

  /* ---------- start / stop ---------- */
  async function startMic() {
    if (S.busy) return;
    S.busy = true;
    try { await startMicInner(); } finally { S.busy = false; }
  }

  async function startMicInner() {
    ['gum', 'graph', 'ended', 'mic', 'https'].forEach((k) => setWarn(k, null));
    if (!window.isSecureContext) return setWarn('https', 'Open this page over <b>https</b>. iPhone only allows the audio input on secure pages.');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return setWarn('gum', 'This browser can’t open an audio input. On iPhone, use Safari.');
    stopAll();
    const id = $('dev').value;
    let stream;
    try {
      // Turn off voice processing: echo cancellation / noise suppression would treat a steady sonde tone as noise.
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: id ? { exact: id } : undefined, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e) {
      return setWarn('gum', 'Couldn’t open the audio input (' + esc(e.message || e.name) + '). Allow microphone access for this site in Settings → Safari.');
    }
    try { await openGraph('mic', stream); } catch (e) {
      stream.getTracks().forEach((t) => t.stop());
      stopAll();
      return setWarn('graph', 'The audio engine didn’t start: ' + esc(e.message) + '. Needs iOS 14.5+ over https.');
    }
    const track = stream.getAudioTracks()[0];
    if (track) {
      track.addEventListener('ended', () => setWarn('ended', 'Audio input disconnected. Reconnect the coil adapter and tap Start.'));
      checkLabel(track.label || '');
    }
    listDevices();
  }

  async function startSim() {
    if (S.busy) return;
    S.busy = true;
    ['gum', 'graph', 'ended', 'mic'].forEach((k) => setWarn(k, null));
    stopAll();
    try { await openGraph('sim'); } catch (e) {
      stopAll();
      setWarn('graph', 'Practice mode didn’t start: ' + esc(e.message));
    } finally { S.busy = false; }
  }

  async function openGraph(mode, stream) {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    S.ctx = ctx; S.mode = mode; S.stream = stream || null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'play-and-record'; } catch (e) { /* older Safari */ }
    if (ctx.resume) ctx.resume().catch(() => {});
    if (!ctx.audioWorklet) throw new Error('this browser has no AudioWorklet');
    await ctx.audioWorklet.addModule('sonde-worklet.js');
    if (S.ctx !== ctx) return; // stopped while loading

    const split = ctx.createChannelSplitter(2);
    const an = ctx.createAnalyser();
    an.fftSize = FFT; an.smoothingTimeConstant = 0.5;
    const lockNode = new AudioWorkletNode(ctx, 'sonde-lockin', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] });
    const mute = ctx.createGain();
    mute.gain.value = 0;
    let src;
    if (mode === 'sim') {
      src = new AudioWorkletNode(ctx, 'sonde-sim', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1] });
      S.simNode = src;
    } else {
      src = ctx.createMediaStreamSource(stream);
    }
    // input (channel 1) → analyser (scan) → lock-in (measure) → silent output (keeps the graph running)
    src.connect(split);
    split.connect(an, 0);
    an.connect(lockNode);
    lockNode.connect(mute);
    mute.connect(ctx.destination);

    const osc = ctx.createOscillator(), tg = ctx.createGain();
    tg.gain.value = 0; osc.frequency.value = 1000;
    osc.connect(tg); tg.connect(ctx.destination); osc.start();

    Object.assign(S, { an, lockNode, toneOsc: osc, toneGain: tg, spec: new Float32Array(an.frequencyBinCount) });
    lockNode.port.onmessage = onLockMsg;
    lockNode.port.postMessage({ tau: tau(), gen: S.gen });
    ctx.onstatechange = onCtxState;
    S.timer = setInterval(analyze, 100);
    buildBandRows();
    if (mode === 'sim') { $('simBox').hidden = false; updSim(); }
    if (ctx.sampleRate < 70000) {
      const b = S.bands.find((x) => x.id === '33k');
      if (b) b.note = 'needs 96 kHz';
    }
    setRunning(true);
    wake();
    onCtxState();
  }

  function stopAll() {
    clearInterval(S.timer); S.timer = 0;
    if (S.stream) S.stream.getTracks().forEach((t) => t.stop());
    if (S.ctx) S.ctx.close().catch(() => {});
    if (S.wl) { S.wl.release().catch(() => {}); S.wl = null; }
    Object.assign(S, {
      ctx: null, stream: null, an: null, lockNode: null, simNode: null, toneOsc: null, toneGain: null, mode: null,
      lock: null, li: null, live: null, cand: null, candN: 0, capture: null, other: null, hum: null, spec: null,
    });
    $('simBox').hidden = true;
    $('resume').hidden = true;
    setRunning(false);
  }

  function setRunning(on) {
    $('stopBtn').disabled = !on;
    $('startBtn').textContent = on && S.mode === 'mic' ? 'Restart' : 'Start with coil';
  }

  function onCtxState() {
    const st = S.ctx && S.ctx.state;
    $('resume').hidden = !S.ctx || st === 'running' || st === 'closed';
  }

  async function wake() {
    try {
      if ('wakeLock' in navigator && document.visibilityState === 'visible' && S.ctx && !S.wl) {
        S.wl = await navigator.wakeLock.request('screen');
        S.wl.addEventListener('release', () => { S.wl = null; });
      }
    } catch (e) { /* not supported or refused */ }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && S.ctx) {
      if (S.ctx.resume) S.ctx.resume().then(onCtxState).catch(onCtxState);
      wake();
    }
  });

  function checkLabel(label) {
    const builtIn = /iphone|built-?in|internal/i.test(label) && !/usb|headset|external|line|interface|guitar/i.test(label);
    setWarn('mic', builtIn
      ? `Input is “${esc(label)}”, the phone’s own microphone, which can’t sense a sonde. Plug in a pickup coil (see <a href="#hw">What to plug in</a>) and tap Start again.`
      : null);
    $('devLbl').textContent = label ? 'Using: ' + label : '';
  }

  async function listDevices() {
    try {
      const ds = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'audioinput' && d.deviceId);
      const cur = $('dev').value;
      $('dev').innerHTML = '<option value="">Default input</option>'
        + ds.map((d) => `<option value="${esc(d.deviceId)}">${esc(d.label || 'Audio input')}</option>`).join('');
      if (ds.some((d) => d.deviceId === cur)) $('dev').value = cur;
    } catch (e) { /* not available before permission */ }
  }
  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) navigator.mediaDevices.addEventListener('devicechange', listDevices);

  /* ---------- scanning ---------- */
  function analyze() {
    if (!S.an || !S.ctx) return;
    S.an.getFloatFrequencyData(S.spec);
    D.sanitize(S.spec);
    const floor = D.noiseFloor(S.spec);
    S.floor = floor;
    const sr = S.ctx.sampleRate, binHz = sr / FFT, nyq = sr / 2, mains = +S.set.mains;
    S.bands.forEach((b) => {
      b.ok = b.hi < nyq - 200;
      b.det = b.ok ? D.findPeak(S.spec, floor, binHz, b.lo, b.hi, { mains }) : null;
    });
    const tf = S.toneHz;
    const excluded = (hz) => S.bands.some((b) => hz >= b.lo - 3 && hz <= b.hi + 3)
      || (tf > 0 && [1, 2, 3].some((m) => Math.abs(hz - m * tf) < 30));
    const o = D.findPeak(S.spec, floor, binHz, 150, Math.min(nyq - 200, 24000), { mains, exclude: excluded });
    S.other = o && o.snr >= LOCK_SNR ? o : null;
    S.hum = D.humSnr(S.spec, floor, binHz, mains);
    autoLock();
    updBandRows();
    updOther();
    drawSpec();
  }

  function autoLock() {
    if (S.lock) return;
    const best = S.bands.filter((b) => b.det && b.det.snr >= LOCK_SNR).sort((a, b) => b.det.snr - a.det.snr)[0];
    if (best && S.cand === best.id) S.candN++;
    else { S.cand = best ? best.id : null; S.candN = best ? 1 : 0; }
    if (best && S.candN >= 8) lockTo(best, best.det.hz, false);
  }

  function lockTo(band, hz, manual) {
    if (!S.lockNode) return;
    S.lock = { id: band.id, label: band.label, f: hz, manual };
    Object.assign(S, { li: null, live: null, peakHold: 0, cand: null, candN: 0, ratio: {}, recent: [] });
    S.gen++;
    S.lockNode.port.postMessage({ tau: tau(), f: hz, gen: S.gen });
    renderCal(); renderLift();
  }

  function unlock() {
    S.lock = null; S.cand = null; S.candN = 0; S.li = null; S.live = null;
    S.gen++;
    if (S.lockNode) S.lockNode.port.postMessage({ f: 0, gen: S.gen });
    renderCal();
  }

  function buildBandRows() {
    $('bands').innerHTML = S.bands.map((b, i) =>
      `<tr data-i="${i}"><td>${esc(b.label)}</td><td class="num">—</td><td class="num">—</td><td>—</td></tr>`).join('');
    updBandRows();
  }

  function updBandRows() {
    const rows = $('bands').rows;
    S.bands.forEach((b, i) => {
      const r = rows[i];
      if (!r) return;
      const c = r.cells, d = b.det, locked = !!(S.lock && S.lock.id === b.id), hit = !!(d && d.snr >= SHOW_SNR);
      c[1].textContent = !S.ctx ? '—' : b.ok === false ? 'n/a' : hit ? (locked ? S.lock.f.toFixed(2) : d.hz.toFixed(1)) + ' Hz' : '—';
      c[2].textContent = hit ? Math.round(d.snr) + ' dB' : '—';
      c[3].textContent = locked ? 'Locked' : b.ok === false ? (b.note || 'n/a') : hit ? 'Signal' : '—';
      r.className = locked ? 'lock' : hit ? 'hit' : '';
    });
  }

  function updOther() {
    const o = S.other;
    $('otherBox').hidden = !o;
    if (o) { $('otherHz').textContent = o.hz.toFixed(1) + ' Hz'; $('otherSnr').textContent = '(' + Math.round(o.snr) + ' dB)'; }
  }

  function addBand(hz) {
    const id = 'c' + hz.toFixed(1);
    let b = S.bands.find((x) => x.id === id);
    if (!b) {
      b = { id, label: hz.toFixed(hz % 1 ? 1 : 0) + ' Hz', nominal: hz, lo: hz * 0.995, hi: hz * 1.005, custom: true };
      S.bands.push(b);
      buildBandRows();
    }
    return b;
  }

  $('bands').addEventListener('click', (e) => {
    const r = e.target.closest('tr');
    if (!r || !S.lockNode) return;
    const b = S.bands[+r.dataset.i];
    if (!b || b.ok === false) return;
    lockTo(b, b.det && b.det.snr >= CAPTURE_SNR ? b.det.hz : b.nominal, true);
  });
  $('otherLock').onclick = () => { if (S.other) { const hz = S.other.hz; lockTo(addBand(hz), hz, true); } };
  $('addBtn').onclick = () => {
    const hz = parseFloat($('cust').value);
    if (!(hz >= 100 && hz <= 40000)) { $('cust').focus(); return; }
    const b = addBand(hz);
    $('cust').value = '';
    if (S.lockNode) lockTo(b, hz, true);
  };
  $('rescanBtn').onclick = unlock;

  /* ---------- lock-in readings ---------- */
  function onLockMsg(e) {
    const m = e.data;
    S.rmsDb = 20 * Math.log10(m.rms || 1e-12);
    if (m.peak >= 0.98) S.clipAt = now();
    if (!S.lock || m.gen !== S.gen || typeof m.amp !== 'number') { S.li = null; return; }
    const n2 = m.noise * m.noise || 1e-30;
    const ampC = Math.sqrt(Math.max(m.amp * m.amp - n2, 0));
    const snr = 10 * Math.log10((m.amp * m.amp) / n2);
    S.li = { amp: m.amp, ampC, noise: m.noise, snr, f: m.f, settled: m.settled, t: now() };
    S.lock.f = m.f;
    if (m.settled) S.peakHold = Math.max(ampC, S.peakHold * PEAK_DECAY);
    if (S.capture && now() >= S.capture.from && m.settled) S.capture.xs.push({ a: ampC, snr });
    S.recent.push(ampC);
    if (S.recent.length > 10) S.recent.shift(); // last 0.5 s
    const lo = Math.min(...S.recent), hi = Math.max(...S.recent);
    S.steady = S.recent.length === 10 && hi > 0 && (hi - lo) / hi < 0.06;
    const cal = S.cal[S.lock.id];
    S.live = cal && m.settled && S.steady && snr >= LIVE_SNR ? D.depthFromCal(ampC, cal.a, cal.d) : null;
    if (S.live != null) S.last = { m: S.live, method: 'live', at: Date.now() };
    updTone();
  }

  function updTone() {
    if (!S.toneGain || !S.ctx) return;
    const t = S.ctx.currentTime, li = S.li;
    const on = S.set.tone && li && li.settled && li.snr > 3;
    if (on) {
      // Pitch rises with signal strength. 1–2.6 kHz stays clear of the sonde bands.
      const hz = 1000 + 1600 * Math.min(1, Math.max(0, (li.snr - 3) / 40));
      S.toneHz = hz;
      S.toneOsc.frequency.setTargetAtTime(hz, t, 0.05);
    }
    if (!on) S.toneHz = 0;
    S.toneGain.gain.setTargetAtTime(on ? 0.12 : 0, t, 0.03);
  }

  function capture(btn) {
    return new Promise((resolve, reject) => {
      if (!S.lock || !S.li) return reject(new Error('Lock onto the sonde first (step 2).'));
      if (S.capture) return reject(new Error('Already measuring.'));
      const band = S.lock.id, gen = S.gen;
      const T = tau(), settle = 3 * T * 1000, dur = Math.max(2000, 6 * T * 1000), t0 = now(), label = btn.textContent;
      S.capture = { from: t0 + settle, xs: [] };
      btn.disabled = true;
      const iv = setInterval(() => {
        const el = now() - t0;
        btn.textContent = el < settle ? 'Hold still…' : `Measuring ${Math.min(99, Math.round((100 * (el - settle)) / dur))}%`;
        if (el < settle + dur && S.capture) return;
        clearInterval(iv);
        btn.disabled = false; btn.textContent = label;
        const xs = S.capture ? S.capture.xs : [];
        S.capture = null;
        if (!S.lock || S.gen !== gen) return reject(new Error('The lock changed during the measurement. Try again.'));
        if (xs.length < 5) return reject(new Error('Measurement interrupted. Try again.'));
        const snr = xs.reduce((s, x) => s + x.snr, 0) / xs.length;
        if (snr < CAPTURE_SNR) return reject(new Error(`Signal too weak (SNR ${snr.toFixed(0)} dB). Move closer or switch Response to Deep.`));
        const st = D.meanSe(xs.map((x) => x.a), dur / 1000 / (4 * T)); // samples ~2τ correlated
        st.snr = snr; st.band = band;
        resolve(st);
      }, 100);
    });
  }

  /* ---------- depth methods ---------- */
  function renderCal() {
    const el = $('calInfo');
    const id = S.lock ? S.lock.id : null;
    const items = Object.keys(S.cal).map((k) => {
      const c = S.cal[k], band = S.bands.find((b) => b.id === k);
      const name = band ? band.label : (c.f ? c.f.toFixed(1) + ' Hz' : k);
      const when = new Date(c.at).toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `<div>${k === id ? '<b>' : ''}${esc(name)}: calibrated at ${esc(fmtLen(c.d))} on ${esc(when)}${k === id ? '</b>' : ''} <button class="small" data-forget="${esc(k)}">Forget</button></div>`;
    });
    el.innerHTML = items.length ? items.join('') : 'Not calibrated yet.';
  }
  $('calInfo').addEventListener('click', (e) => {
    const k = e.target.getAttribute && e.target.getAttribute('data-forget');
    if (k && confirm('Forget this calibration?')) { delete S.cal[k]; store.set('cal', S.cal); renderCal(); }
  });

  $('calBtn').onclick = async () => {
    $('calMsg').textContent = '';
    const d = lenM('calDist');
    if (!(d > 0)) { $('calMsg').textContent = 'Enter the coil height above the sonde.'; return; }
    try {
      const st = await capture($('calBtn'));
      S.cal[st.band] = { a: st.mean, d, f: S.lock ? S.lock.f : null, at: Date.now() };
      store.set('cal', S.cal);
      S.peakHold = 0;
      renderCal();
    } catch (e) { $('calMsg').textContent = e.message; }
  };

  function renderLift() {
    const r = S.ratio;
    $('liftA1').textContent = r.a1 ? fmtSig(r.a1.mean) : '—';
    $('liftA2').textContent = r.a2 ? fmtSig(r.a2.mean) : '—';
    $('liftRes').textContent = '—';
    if (!(r.a1 && r.a2)) return;
    const h = lenM('liftH');
    const d = D.depthFromRatio(r.a1.mean, r.a2.mean, h);
    if (!d) {
      $('liftMsg').textContent = 'The lifted reading must be weaker. Stand exactly on the peak, keep the coil pointed the same way, and retake both readings.';
      return;
    }
    const sd = D.depthRatioSigma(r.a1.mean, r.a1.se, r.a2.mean, r.a2.se, h);
    $('liftRes').textContent = fmtLen(d) + (sd != null ? '  ' + fmtPm(sd) : '');
    $('liftMsg').textContent = sd != null && sd > 0.25 * d ? 'Uncertain. Lift the coil higher, or switch Response to Deep and retake.' : '';
    S.last = { m: d, sd, method: 'lift', at: Date.now() };
  }
  async function liftCapture(key, btn) {
    $('liftMsg').textContent = '';
    if (key === 'a2' && (!S.ratio.a1 || !S.lock || S.ratio.band !== S.lock.id)) { $('liftMsg').textContent = 'Take reading 1 first.'; return; }
    try {
      const st = await capture(btn);
      if (key === 'a1') S.ratio = { a1: st, band: st.band };
      else if (S.ratio.band !== st.band) throw new Error('The lock changed. Retake reading 1.');
      else S.ratio.a2 = st;
      renderLift();
    } catch (e) { $('liftMsg').textContent = e.message; }
  }
  $('cap1').onclick = () => liftCapture('a1', $('cap1'));
  $('cap2').onclick = () => liftCapture('a2', $('cap2'));
  $('liftH').oninput = renderLift;

  function renderPoles() {
    const L = lenM('poleL');
    const d = L > 0 ? D.depthFromPoles(L) : null;
    $('poleRes').textContent = d ? fmtLen(d) : '—';
    if (d) S.last = { m: d, method: 'poles', at: Date.now() };
  }
  $('poleL').oninput = renderPoles;

  document.querySelectorAll('.tab').forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll('.tab').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      ['live', 'lift', 'poles'].forEach((t) => { $('tab-' + t).hidden = t !== b.dataset.tab; });
    };
  });

  /* ---------- marks ---------- */
  function renderMarks() {
    const el = $('marks');
    if (!S.marks.length) { el.innerHTML = '<li class="muted">No marks yet.</li>'; return; }
    el.innerHTML = S.marks.map((k, i) => {
      const when = new Date(k.t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      const dep = k.depth != null ? `${fmtLen(k.depth)} deep (${methodName(k.method)})` : 'No depth';
      const acc = k.acc != null ? (U() === 'ft' ? Math.round(k.acc / D.FT) + ' ft' : Math.round(k.acc) + ' m') : '';
      const gps = k.lat != null
        ? `<a href="https://maps.apple.com/?ll=${k.lat.toFixed(6)},${k.lon.toFixed(6)}&q=${encodeURIComponent('Sonde' + (k.depth != null ? ' ' + fmtLen(k.depth) : ''))}" target="_blank" rel="noopener">Map</a> ±${acc}`
        : 'no GPS';
      return `<li><div><b>${esc(dep)}</b>${k.f ? ' · ' + k.f.toFixed(1) + ' Hz' : ''}</div>`
        + `<div class="tiny">${esc(when)} · ${gps}${k.note ? ' · ' + esc(k.note) : ''}</div>`
        + `<button class="x" data-i="${i}" aria-label="Delete mark">×</button></li>`;
    }).join('');
  }
  $('marks').addEventListener('click', (e) => {
    const i = e.target.getAttribute && e.target.getAttribute('data-i');
    if (i != null && e.target.classList.contains('x')) { S.marks.splice(+i, 1); store.set('marks', S.marks); renderMarks(); }
  });

  $('markBtn').onclick = () => {
    const btn = $('markBtn');
    const fresh = S.last && Date.now() - S.last.at < (S.last.method === 'live' ? 3000 : 120000);
    const mark = {
      t: Date.now(), f: S.lock ? S.lock.f : null,
      depth: fresh ? S.last.m : null, method: fresh ? S.last.method : null,
      signal: S.li ? S.li.ampC : null, note: $('markNote').value.trim(),
    };
    const save = (c, msg) => {
      if (c) Object.assign(mark, { lat: c.latitude, lon: c.longitude, acc: c.accuracy });
      S.marks.unshift(mark);
      store.set('marks', S.marks);
      renderMarks();
      $('markNote').value = '';
      btn.disabled = false; btn.textContent = 'Mark spot';
      $('markMsg').textContent = msg || '';
    };
    if (!navigator.geolocation) return save(null, 'Saved without GPS (location not available).');
    btn.disabled = true; btn.textContent = 'Getting GPS…';
    navigator.geolocation.getCurrentPosition(
      (p) => save(p.coords),
      (err) => save(null, 'Saved without GPS: ' + err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  function csv() {
    const head = ['time', 'latitude', 'longitude', 'gps_accuracy_m', 'frequency_hz', 'depth_' + uName(), 'depth_method', 'note'];
    const rows = S.marks.slice().reverse().map((k) => [
      new Date(k.t).toISOString(), k.lat != null ? k.lat.toFixed(6) : '', k.lon != null ? k.lon.toFixed(6) : '',
      k.acc != null ? k.acc.toFixed(1) : '', k.f ? k.f.toFixed(2) : '', k.depth != null ? fromM(k.depth).toFixed(2) : '',
      k.method || '', k.note || '',
    ]);
    return [head, ...rows].map((r) => r.map((v) => (/[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v)).join(',')).join('\n');
  }

  $('shareBtn').onclick = async () => {
    if (!S.marks.length) { $('markMsg').textContent = 'Nothing to share yet.'; return; }
    const text = csv(), name = 'sonde-marks-' + new Date().toISOString().slice(0, 10) + '.csv';
    try {
      const file = new File([text], name, { type: 'text/csv' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Sonde marks' }); return; }
      if (navigator.share) { await navigator.share({ title: 'Sonde marks', text }); return; }
    } catch (e) { if (e.name === 'AbortError') return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };
  $('clearBtn').onclick = () => {
    if (S.marks.length && confirm('Delete all saved marks?')) { S.marks = []; store.set('marks', S.marks); renderMarks(); }
  };

  /* ---------- practice mode ---------- */
  function buildSimBands() {
    $('simF').innerHTML = S.bands.filter((b) => !b.custom && b.nominal < 20000)
      .map((b) => `<option value="${b.id}">${esc(b.label)}</option>`).join('');
  }
  function updSim() {
    const d = +$('simD').value, x = +$('simX').value, h = +$('simH').value;
    $('simDv').textContent = d.toFixed(1); $('simXv').textContent = x.toFixed(1); $('simHv').textContent = h.toFixed(1);
    const band = S.bands.find((b) => b.id === $('simF').value) || S.bands[0];
    const amp = SIM_K * Math.abs(D.dipoleBx(x, d + h));
    // A real sonde's crystal is a few tens of ppm off nominal; the lock-in has to find it.
    if (S.simNode) S.simNode.port.postMessage({ amp, f: band.nominal * (1 + 40e-6), mains: +S.set.mains });
  }
  ['simD', 'simX', 'simH'].forEach((id) => { $(id).oninput = updSim; });
  $('simF').onchange = () => { updSim(); if (S.lock && !S.lock.manual) unlock(); };

  /* ---------- settings ---------- */
  function applyUnits() {
    document.querySelectorAll('.u').forEach((el) => { el.textContent = uName(); });
    $('units').value = U();
  }
  $('units').onchange = () => {
    const old = U(), nu = $('units').value;
    if (old === nu) return;
    LEN_FIELDS.forEach((id) => {
      const el = $(id), v = parseFloat(el.value);
      if (isNaN(v)) return;
      const m = el.dataset.m != null ? +el.dataset.m : (old === 'ft' ? v * D.FT : v);
      el.dataset.m = String(m);
      el.value = +(nu === 'ft' ? m / D.FT : m).toFixed(2);
    });
    S.set.units = nu; saveSettings();
    applyUnits(); renderCal(); renderMarks(); renderLift(); renderPoles(); updSim();
  };
  $('resp').value = S.set.resp;
  $('resp').onchange = () => {
    S.set.resp = $('resp').value; saveSettings();
    if (S.lockNode) S.lockNode.port.postMessage({ tau: tau() });
  };
  $('mains').value = String(S.set.mains);
  $('mains').onchange = () => { S.set.mains = +$('mains').value; saveSettings(); updSim(); };

  function renderToneBtn() {
    $('toneBtn').textContent = S.set.tone ? 'Tone on' : 'Tone off';
    $('toneBtn').setAttribute('aria-pressed', String(!!S.set.tone));
  }
  $('toneBtn').onclick = () => { S.set.tone = !S.set.tone; saveSettings(); renderToneBtn(); updTone(); };
  $('meter').onclick = () => { S.peakHold = 0; };
  $('resume').onclick = () => { if (S.ctx) S.ctx.resume().then(onCtxState).catch(onCtxState); };
  $('startBtn').onclick = startMic;
  $('dev').onchange = () => { if (S.mode === 'mic') startMic(); };
  $('simBtn').onclick = startSim;
  $('stopBtn').onclick = stopAll;

  /* ---------- drawing ---------- */
  function drawSpec() {
    const c = $('spec');
    if (!S.spec || !S.ctx || !S.floor) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(c.clientWidth * dpr)), H = Math.max(1, Math.round(c.clientHeight * dpr));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const g = c.getContext('2d'), cs = getComputedStyle(document.documentElement), col = (v) => cs.getPropertyValue(v).trim();
    const sr = S.ctx.sampleRate, binHz = sr / FFT, fMin = 100, fMax = Math.min(sr / 2 - binHz, 20000), L = Math.log(fMax / fMin);
    const xOf = (f) => (Math.log(f / fMin) / L) * W;
    const ys = new Float32Array(W);
    let hi = -Infinity, lo = Infinity;
    for (let x = 0; x < W; x++) {
      const k0 = Math.max(1, Math.floor((fMin * Math.exp((L * x) / W)) / binHz));
      const k1 = Math.max(k0, Math.floor((fMin * Math.exp((L * (x + 1)) / W)) / binHz));
      let m = -Infinity;
      for (let k = k0; k <= k1 && k < S.spec.length; k++) if (S.spec[k] > m) m = S.spec[k];
      ys[x] = m;
      if (m > hi) hi = m;
      if (S.floor[k0] < lo) lo = S.floor[k0];
    }
    const top = hi + 6, bot = Math.min(lo - 6, top - 40), y = (db) => H - ((db - bot) / (top - bot)) * H;
    g.clearRect(0, 0, W, H);
    g.font = `${11 * dpr}px -apple-system, system-ui, sans-serif`;
    g.textBaseline = 'top';
    S.bands.forEach((b, i) => {
      const f = b.det && b.det.snr >= SHOW_SNR ? b.det.hz : b.nominal;
      if (f < fMin || f > fMax) return;
      const isL = S.lock && S.lock.id === b.id, x = xOf(f);
      g.fillStyle = isL ? col('--accent') : col('--line');
      g.fillRect(Math.round(x), 0, Math.max(1, dpr), H);
      g.fillStyle = isL ? col('--accent') : col('--muted');
      const t = b.label.replace(' Hz', '').replace(' kHz', 'k'), tw = g.measureText(t).width;
      g.fillText(t, x + 3 * dpr + tw > W ? x - 3 * dpr - tw : x + 3 * dpr, (3 + (i % 2) * 13) * dpr);
    });
    g.strokeStyle = col('--ink'); g.lineWidth = dpr; g.globalAlpha = 0.85;
    g.beginPath();
    for (let x = 0; x < W; x++) { const yy = y(ys[x]); if (x) g.lineTo(x, yy); else g.moveTo(x, yy); }
    g.stroke();
    g.globalAlpha = 1;
  }

  function renderHud() {
    const chip = $('chip');
    if (!S.ctx) { chip.textContent = 'Stopped'; chip.className = 'chip'; }
    else if (S.lock) { chip.textContent = `Locked ${S.lock.f.toFixed(2)} Hz${S.mode === 'sim' ? ' · practice' : ''}`; chip.className = 'chip on'; }
    else { chip.textContent = S.mode === 'sim' ? 'Scanning · practice' : 'Scanning…'; chip.className = 'chip scan'; }

    const li = S.li && now() - S.li.t < 1000 ? S.li : null;
    $('sig').textContent = li ? fmtSig(li.ampC) : '—';
    $('bar').style.width = li && S.peakHold > 0 ? Math.min(100, (100 * li.ampC) / S.peakHold).toFixed(1) + '%' : '0%';
    $('pkv').textContent = S.peakHold > 0 ? 'peak ' + fmtSig(S.peakHold) + ' · tap to reset' : '';

    let dTxt = '—', dSrc = '';
    if (S.live != null && li) { dTxt = fmtLen(S.live); dSrc = 'live, valid at the peak'; }
    else if (S.last && S.last.method !== 'live' && Date.now() - S.last.at < 600000) {
      dTxt = fmtLen(S.last.m);
      dSrc = methodName(S.last.method) + (S.last.sd != null ? ' ' + fmtPm(S.last.sd) : '');
    } else if (S.lock && S.cal[S.lock.id]) dSrc = li && li.snr >= LIVE_SNR ? 'hold steady over the peak' : 'calibrated, needs a stronger signal';
    else if (S.lock) dSrc = 'calibrate or run a lift test';
    $('dep').textContent = dTxt;
    $('depSrc').textContent = dSrc;

    const parts = [];
    if (!S.ctx) parts.push('Tap Start below.');
    else {
      if (li) parts.push('SNR ' + Math.round(li.snr) + ' dB');
      parts.push(S.rmsDb > -150 ? 'input ' + Math.round(S.rmsDb) + ' dBFS' : 'input silent');
      if (S.hum != null && isFinite(S.hum)) parts.push(S.hum >= 20 ? S.set.mains + ' Hz hum ✓' : 'no ' + S.set.mains + ' Hz hum');
    }
    $('diag').textContent = parts.join(' · ');
    $('clip').hidden = now() - S.clipAt > 1500;
    requestAnimationFrame(renderHud);
  }

  /* ---------- init ---------- */
  if (!window.isSecureContext) setWarn('https', 'Open this page over <b>https</b>. iPhone only allows the audio input on secure pages. Practice mode works anyway.');
  applyUnits(); renderToneBtn(); buildSimBands(); buildBandRows(); renderCal(); renderMarks(); updSim();
  requestAnimationFrame(renderHud);
})();
