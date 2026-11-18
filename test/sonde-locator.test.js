// Run with: node --test test/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const D = require('../public/tools/sonde-locator.js');

const SR = 48000, N = 32768, BIN = SR / N;

function rng(seed) { // mulberry32
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gaussian(r) { return Math.sqrt(-2 * Math.log(r() || 1e-12)) * Math.cos(2 * Math.PI * r()); }

// Spectrum in dB of Blackman-windowed tones over a random noise floor (bins near each tone by direct DFT).
function syntheticSpectrum(tones, r) {
  const spec = new Float32Array(N / 2);
  for (let k = 0; k < spec.length; k++) spec[k] = -120 + 4 * (r() - 0.5);
  const w = new Float64Array(N);
  let wsum = 0;
  for (let n = 0; n < N; n++) {
    w[n] = 0.42 - 0.5 * Math.cos((2 * Math.PI * n) / N) + 0.08 * Math.cos((4 * Math.PI * n) / N);
    wsum += w[n];
  }
  for (const { hz, db } of tones) {
    const amp = Math.pow(10, db / 20), c = Math.round(hz / BIN);
    for (let k = c - 6; k <= c + 6; k++) {
      let re = 0, im = 0;
      for (let n = 0; n < N; n++) {
        const x = w[n] * amp * Math.cos((2 * Math.PI * hz * n) / SR);
        re += x * Math.cos((2 * Math.PI * k * n) / N);
        im -= x * Math.sin((2 * Math.PI * k * n) / N);
      }
      const mag = (2 * Math.hypot(re, im)) / wsum;
      spec[k] = Math.max(spec[k], 20 * Math.log10(mag + 1e-30));
    }
  }
  return spec;
}

test('finds a 512 Hz sonde, refines its frequency and ignores 60 Hz harmonics', () => {
  const spec = syntheticSpectrum([{ hz: 512.03, db: -70 }, { hz: 540, db: -40 }, { hz: 8000.4, db: -85 }], rng(1));
  const floor = D.noiseFloor(D.sanitize(spec));
  const p512 = D.findPeak(spec, floor, BIN, 505, 519, { mains: 60 });
  assert.ok(Math.abs(p512.hz - 512.03) < 0.1, `512 band at ${p512.hz}`);
  assert.ok(p512.snr > 40, `SNR ${p512.snr}`);
  const p8k = D.findPeak(spec, floor, BIN, 7900, 8300, { mains: 60 });
  assert.ok(Math.abs(p8k.hz - 8000.4) < 0.15, `8k band at ${p8k.hz}`);
  // The 540 Hz hum line (9 × 60) is excluded, so the strongest "other" tone is not mains.
  const other = D.findPeak(spec, floor, BIN, 520, 600, { mains: 60 });
  assert.ok(!other || other.snr < 10, 'mains harmonic must be skipped');
  assert.ok(D.findPeak(spec, floor, BIN, 520, 600).hz > 539, 'without the mains filter it is found');
});

test('noise floor sits at the noise, not at the tones', () => {
  const spec = syntheticSpectrum([{ hz: 512, db: -50 }], rng(2));
  const floor = D.noiseFloor(D.sanitize(spec));
  const k = Math.round(512 / BIN);
  assert.ok(Math.abs(floor[k] + 120) < 3, `floor ${floor[k]}`);
});

test('depth formulas invert the dipole field', () => {
  for (const d of [0.5, 1.2, 2.5]) {
    const a = (z) => Math.abs(D.dipoleBx(0, z));
    assert.ok(Math.abs(D.depthFromRatio(a(d), a(d + 0.3), 0.3) - d) < 1e-9);
    assert.ok(Math.abs(D.depthFromCal(a(d), a(0.9), 0.9) - d) < 1e-9);
    assert.ok(Math.abs(D.dipoleBx(d / Math.SQRT2, d)) < 1e-9, 'poles at ±d/√2');
    assert.ok(Math.abs(D.depthFromPoles(Math.SQRT2 * d) - d) < 1e-12);
  }
  assert.equal(D.depthFromRatio(1, 1.2, 0.3), null, 'raised reading stronger → no answer');
  const s = D.depthRatioSigma(1, 0.01, 0.5, 0.01, 0.3);
  assert.ok(s > 0 && s < D.depthFromRatio(1, 0.5, 0.3));
});

test('formats lengths', () => {
  assert.equal(D.formatLen(1.778, 'ft'), '5′ 10″');
  assert.equal(D.formatLen(0.1016, 'ft'), '4″');
  assert.equal(D.formatLen(1.778, 'm'), '1.78 m');
});

function loadWorklet() {
  const procs = {};
  class AudioWorkletProcessor {
    constructor() { this.port = { onmessage: null, msgs: [], postMessage(m) { this.msgs.push(m); } }; }
  }
  const ctx = { AudioWorkletProcessor, registerProcessor: (n, c) => { procs[n] = c; }, sampleRate: SR, Math };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/tools/sonde-worklet.js'), 'utf8'), ctx);
  return procs;
}

function runLockIn({ trueHz, startHz, amp, noise, tau, seconds }) {
  const P = loadWorklet()['sonde-lockin'];
  const li = new P();
  li.port.onmessage({ data: { tau, f: startHz } });
  const r = rng(7), block = new Float32Array(128);
  let t = 0;
  for (let b = 0; b < (seconds * SR) / 128; b++) {
    for (let n = 0; n < 128; n++, t++) {
      const s = t / SR;
      block[n] = amp * Math.cos(2 * Math.PI * trueHz * s + 0.7)
        + 0.02 * Math.sin(2 * Math.PI * 60 * s) + 0.006 * Math.sin(2 * Math.PI * 540 * s)
        + noise * gaussian(r);
    }
    li.process([[block]]);
  }
  return li.port.msgs;
}

test('lock-in measures amplitude and pulls onto the true sonde frequency', () => {
  for (const tau of [0.1, 0.3, 0.8]) {
    const msgs = runLockIn({ trueHz: 512.03, startHz: 511.85, amp: 1e-3, noise: 3e-4, tau, seconds: 20 });
    const tail = msgs.slice(-40);
    const a = tail.reduce((s, m) => s + m.amp, 0) / tail.length;
    const f = tail[tail.length - 1].f;
    assert.ok(Math.abs(a / 1e-3 - 1) < 0.03, `tau ${tau}: amplitude ${a}`);
    assert.ok(Math.abs(f - 512.03) < 0.01, `tau ${tau}: frequency ${f}`);
    assert.ok(tail[tail.length - 1].noise < 1e-4, 'noise estimate well below signal');
  }
});

test('lock-in noise reference tracks the floor when there is no sonde', () => {
  const msgs = runLockIn({ trueHz: 512, startHz: 512, amp: 0, noise: 3e-4, tau: 0.3, seconds: 10 });
  const tail = msgs.slice(-60);
  const a2 = tail.reduce((s, m) => s + m.amp * m.amp, 0) / tail.length;
  const n2 = tail.reduce((s, m) => s + m.noise * m.noise, 0) / tail.length;
  const snrDb = 10 * Math.log10(a2 / n2);
  assert.ok(Math.abs(snrDb) < 4, `no-signal SNR should be ≈0 dB, got ${snrDb.toFixed(1)}`);
});
