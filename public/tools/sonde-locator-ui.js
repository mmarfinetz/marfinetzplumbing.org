(function () {
  const D = window.SondeDSP, $ = (id) => document.getElementById(id);
  const FFT = 32768, LOCK_SNR = 10;
  let ctx, an, src, stream, osc, simGain, raf, spec, bands = D.SONDES.map(s => ({ ...s })), lockHz = null, manual = false;
  let amp = 0, peak = 0, a1 = null, a2 = null, smooth = 0, hist = [];

  async function listDevices() {
    try {
      const ds = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput');
      $('dev').innerHTML = '<option value="">Default input</option>' + ds.map(d => `<option value="${d.deviceId}">${d.label || 'Input'}</option>`).join('');
    } catch (e) {}
  }

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 96000 });
    an = ctx.createAnalyser(); an.fftSize = FFT; an.smoothingTimeConstant = 0.7; an.minDecibels = -140;
    spec = new Float32Array(an.frequencyBinCount);
  }

  async function start(sim) {
    stop();
    setup();
    if (sim) {
      osc = ctx.createOscillator(); osc.frequency.value = +$('simf').value;
      simGain = ctx.createGain(); updSim();
      const noise = ctx.createBufferSource(), buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 1e-4;
      noise.buffer = buf; noise.loop = true;
      osc.connect(simGain); simGain.connect(an); noise.connect(an); osc.start(); noise.start();
      $('status').textContent = 'Simulating sonde';
    } else {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: $('dev').value || undefined, echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      } catch (e) { $('status').innerHTML = '<span class="err">Mic access failed: ' + e.message + '</span>'; return; }
      src = ctx.createMediaStreamSource(stream); src.connect(an);
      listDevices();
      $('status').textContent = `Listening @ ${ctx.sampleRate / 1000} kHz` + (ctx.sampleRate < 70000 ? ' (33 kHz band unavailable)' : '');
    }
    $('start').disabled = $('sim').disabled = true; $('stop').disabled = false;
    $('simbox').style.display = sim ? 'flex' : 'none';
    lockHz = null; manual = false; peak = 0; loop();
  }

  function stop() {
    cancelAnimationFrame(raf);
    try { osc && osc.stop(); } catch (e) {}
    stream && stream.getTracks().forEach(t => t.stop());
    ctx && ctx.close(); ctx = osc = stream = null;
    $('start').disabled = $('sim').disabled = false; $('stop').disabled = true;
  }

  function updSim() {
    // Dipole falloff: amplitude ~ k/d^3, with 6 ft -> 0.05 full-scale.
    const d = +$('simd').value; $('simdv').textContent = d.toFixed(1);
    if (simGain) simGain.gain.value = 0.05 * Math.pow(6 / d, 3);
  }

  function loop() {
    an.getFloatFrequencyData(spec);
    const sr = ctx.sampleRate;
    bands.forEach(b => { b.m = (b.hz < sr / 2 - 1000) ? D.measureBand(spec, sr, FFT, b.hz) : null; });
    if (!manual) {
      const best = bands.filter(b => b.m && b.m.snrDb >= LOCK_SNR).sort((x, y) => y.m.snrDb - x.m.snrDb)[0];
      lockHz = best ? best.hz : null;
    }
    const lb = bands.find(b => b.hz === lockHz);
    amp = lb && lb.m ? lb.m.amplitude : 0;
    smooth = smooth * 0.7 + amp * 0.3;
    hist.push(smooth); if (hist.length > 30) hist.shift();
    peak = Math.max(peak, smooth);
    render(sr);
    raf = requestAnimationFrame(loop);
  }

  const fmt = v => v >= 1 ? v.toFixed(2) : v.toExponential(2);
  function render(sr) {
    $('tb').innerHTML = bands.map(b => {
      const m = b.m, ok = m && m.snrDb >= LOCK_SNR;
      return `<tr class="sel ${b.hz === lockHz ? 'lock' : ''}" data-hz="${b.hz}"><td>${b.name}</td><td>${b.hz} Hz</td><td>${m ? m.snrDb.toFixed(1) + ' dB' : 'n/a'}</td><td>${b.hz === lockHz ? '● LOCKED' : ok ? 'signal' : '—'}</td></tr>`;
    }).join('');
    $('lockf').textContent = lockHz ? lockHz + ' Hz' + (manual ? ' (manual)' : '') : 'none — no sonde detected';
    $('amp').textContent = lockHz ? fmt(smooth) : '—';
    $('peak').textContent = peak ? fmt(peak) : '—';
    $('mbar').style.width = (peak ? Math.min(100, smooth / peak * 100) : 0) + '%';
    drawSpec(sr);
  }

  function drawSpec(sr) {
    const c = $('spec'), g = c.getContext('2d'), W = c.width, H = c.height;
    const css = getComputedStyle(document.body);
    g.clearRect(0, 0, W, H);
    const maxHz = Math.min(sr / 2, 20000), n = Math.floor(maxHz / (sr / FFT));
    g.strokeStyle = css.getPropertyValue('--acc'); g.beginPath();
    for (let x = 0; x < W; x++) {
      const i = Math.floor(Math.pow(x / W, 2) * n) + 1;           // quadratic axis: emphasises low (512-850 Hz) range
      const y = H - Math.max(0, Math.min(1, (spec[i] + 130) / 100)) * H;
      x ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
    g.fillStyle = css.getPropertyValue('--warn'); g.font = '11px sans-serif';
    bands.forEach(b => {
      if (b.hz > maxHz) return;
      const x = Math.sqrt(b.hz / maxHz) * W;
      g.fillRect(x, 0, 1, H); g.fillText(b.hz, x + 3, 12);
    });
  }

  function avgNow() { return hist.length ? hist.reduce((a, b) => a + b, 0) / hist.length : 0; }
  function calc() {
    const u = $('units').value, h = +$('h').value;
    $('a1').textContent = a1 ? fmt(a1) : '—'; $('a2').textContent = a2 ? fmt(a2) : '—';
    const d = D.depthFromRatio(a1, a2, h);
    $('depth').textContent = d ? d.toFixed(1) + ' ' + u : '—';
    $('depthn').textContent = a1 && a2 && !d ? 'Raised reading must be weaker than ground reading — re-capture directly over the peak.' : '';
  }

  $('start').onclick = () => start(false);
  $('sim').onclick = () => start(true);
  $('stop').onclick = stop;
  $('simd').oninput = updSim;
  $('simf').onchange = () => { if (osc) osc.frequency.value = +$('simf').value; peak = 0; };
  $('peakreset').onclick = () => { peak = 0; };
  $('cap1').onclick = () => { a1 = avgNow(); calc(); };
  $('cap2').onclick = () => { a2 = avgNow(); calc(); };
  $('clr').onclick = () => { a1 = a2 = null; calc(); };
  $('h').oninput = $('units').onchange = calc;
  $('tb').onclick = e => { const r = e.target.closest('tr'); if (r) { lockHz = +r.dataset.hz; manual = true; peak = 0; } };
  $('addc').onclick = () => { const v = +$('cust').value; if (v > 20 && !bands.some(b => b.hz === v)) bands.push({ name: 'Custom', hz: v }); };
  listDevices();
})();
