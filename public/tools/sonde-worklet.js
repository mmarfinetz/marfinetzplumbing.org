/* AudioWorklet processors for the Sonde Locator.
 *
 * sonde-lockin: quadrature lock-in amplifier at the sonde frequency. It mixes the input with
 *   cos/sin at f0 and low-pass filters the products (two cascaded one-pole stages, time constant tau),
 *   which gives a measurement bandwidth of a fraction of a hertz, far narrower than an FFT bin. A
 *   frequency-locked loop nudges f0 onto the sonde's true frequency using the rotation of the I/Q
 *   phase. Two identical channels 17 Hz either side measure the noise in the same bandwidth.
 *
 * sonde-sim: practice-mode generator (sonde tone + power-line hum + white noise). */

const TWO_PI = 2 * Math.PI;
const REF_OFFSET_HZ = 17;
const REPORT_S = 0.05;
const FLL_RANGE_HZ = 2;

function chan(f) { return { f, ph: 0, i1: 0, q1: 0, i2: 0, q2: 0 }; }

function runChan(c, x, a) {
  const w = (TWO_PI * c.f) / sampleRate;
  let ph = c.ph, i1 = c.i1, q1 = c.q1, i2 = c.i2, q2 = c.q2;
  for (let n = 0; n < x.length; n++) {
    const v = x[n];
    i1 += a * (v * Math.cos(ph) - i1);
    q1 += a * (v * Math.sin(ph) - q1);
    i2 += a * (i1 - i2);
    q2 += a * (q1 - q2);
    ph += w;
    if (ph >= TWO_PI) ph -= TWO_PI;
  }
  c.ph = ph; c.i1 = i1; c.q1 = q1; c.i2 = i2; c.q2 = q2;
}

class SondeLockIn extends AudioWorkletProcessor {
  constructor() {
    super();
    this.tau = 0.3;
    this.f0 = 0; this.anchor = 0; this.main = null; this.refs = [];
    this.noiseP = 0; this.prevTh = null; this.warm = 0;
    this.ss = 0; this.cnt = 0; this.peak = 0; this.since = 0; this.gen = 0;
    this.port.onmessage = (e) => {
      const d = e.data || {};
      if (typeof d.gen === 'number') this.gen = d.gen;
      if (d.tau > 0) { this.tau = d.tau; this.warm = 0; this.prevTh = null; }
      if (typeof d.f === 'number') this.tune(d.f);
    };
  }

  tune(f) {
    this.f0 = f; this.anchor = f;
    this.main = f > 0 ? chan(f) : null;
    this.refs = f > 0 ? [chan(f - REF_OFFSET_HZ), chan(f + REF_OFFSET_HZ)] : [];
    this.noiseP = 0; this.prevTh = null; this.warm = 0;
  }

  process(inputs) {
    const x = inputs[0] && inputs[0][0];
    const len = x ? x.length : 128;
    if (x) {
      let ss = 0, pk = this.peak;
      for (let n = 0; n < x.length; n++) {
        const v = x[n], av = v < 0 ? -v : v;
        ss += v * v;
        if (av > pk) pk = av;
      }
      this.ss += ss; this.cnt += x.length; this.peak = pk;
      if (this.main) {
        const a = 1 - Math.exp(-1 / (this.tau * sampleRate));
        runChan(this.main, x, a);
        for (const r of this.refs) runChan(r, x, a);
      }
    }
    this.since += len;
    if (this.since >= REPORT_S * sampleRate) this.report();
    return true;
  }

  report() {
    const dt = this.since / sampleRate;
    this.since = 0;
    const msg = { rms: this.cnt ? Math.sqrt(this.ss / this.cnt) : 0, peak: this.peak, gen: this.gen };
    this.ss = 0; this.cnt = 0; this.peak = 0;
    if (this.main) {
      const m = this.main;
      const amp = 2 * Math.hypot(m.i2, m.q2);
      let nP = Infinity;
      for (const r of this.refs) nP = Math.min(nP, 4 * (r.i2 * r.i2 + r.q2 * r.q2));
      this.warm += dt;
      const b = 1 - Math.exp(-dt / (4 * this.tau));
      this.noiseP = this.warm < 3 * this.tau || !(this.noiseP > 0) ? nP : this.noiseP + b * (nP - this.noiseP);
      const settled = this.warm > 4 * this.tau;

      // Frequency-locked loop: the I/Q vector rotates at (f_sonde − f0); steer f0 to stop it.
      const th = Math.atan2(m.q2, m.i2);
      if (this.prevTh !== null && settled && amp * amp > 10 * this.noiseP) {
        let d = th - this.prevTh;
        if (d > Math.PI) d -= TWO_PI; else if (d < -Math.PI) d += TWO_PI;
        const df = -d / (TWO_PI * dt);
        const g = Math.min(0.5, dt / (3 * this.tau));
        const f = Math.max(this.anchor - FLL_RANGE_HZ, Math.min(this.anchor + FLL_RANGE_HZ, this.f0 + g * df));
        this.f0 = f; m.f = f;
        this.refs[0].f = f - REF_OFFSET_HZ; this.refs[1].f = f + REF_OFFSET_HZ;
      }
      this.prevTh = th;
      msg.amp = amp; msg.noise = Math.sqrt(this.noiseP); msg.f = this.f0; msg.settled = settled;
    }
    this.port.postMessage(msg);
  }
}
registerProcessor('sonde-lockin', SondeLockIn);

class SondeSim extends AudioWorkletProcessor {
  constructor() {
    super();
    this.f = 512; this.amp = 0; this.cur = 0; this.ph = 0; this.hph = 0;
    this.mains = 60; this.hum = 0.02; this.noise = 3e-4; this.spare = null;
    this.port.onmessage = (e) => {
      const d = e.data || {};
      for (const k of ['f', 'amp', 'mains', 'hum', 'noise']) if (typeof d[k] === 'number') this[k] = d[k];
    };
  }

  gauss() {
    if (this.spare !== null) { const s = this.spare; this.spare = null; return s; }
    let u = 0;
    while (u === 0) u = Math.random();
    const v = Math.random(), r = Math.sqrt(-2 * Math.log(u));
    this.spare = r * Math.sin(TWO_PI * v);
    return r * Math.cos(TWO_PI * v);
  }

  process(inputs, outputs) {
    const out = outputs[0] && outputs[0][0];
    if (!out) return true;
    const w = (TWO_PI * this.f) / sampleRate, wh = (TWO_PI * this.mains) / sampleRate;
    const k = 1 - Math.exp(-1 / (0.03 * sampleRate));
    for (let n = 0; n < out.length; n++) {
      this.cur += k * (this.amp - this.cur);
      out[n] = this.cur * Math.cos(this.ph)
        + this.hum * (Math.sin(this.hph) + 0.3 * Math.sin(3 * this.hph))
        + this.noise * this.gauss();
      this.ph += w; if (this.ph >= TWO_PI) this.ph -= TWO_PI;
      this.hph += wh; if (this.hph >= TWO_PI) this.hph -= TWO_PI;
    }
    return true;
  }
}
registerProcessor('sonde-sim', SondeSim);
