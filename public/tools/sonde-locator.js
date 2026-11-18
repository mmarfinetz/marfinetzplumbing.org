/* Sonde Locator: spectrum scanning and depth math. Runs in the browser and in Node (for tests). */
(function (root) {
  'use strict';

  // Common push-camera / pipe sonde frequencies. lo/hi is the search window (Hz):
  // "8 kHz", "16 kHz" and "33 kHz" sondes are often 8192 / 16384 / 32768 Hz, so the windows cover both.
  const BANDS = [
    { id: '512', label: '512 Hz', nominal: 512, lo: 505, hi: 519 },
    { id: '640', label: '640 Hz', nominal: 640, lo: 632, hi: 648 },
    { id: '850', label: '850 Hz', nominal: 850, lo: 843, hi: 857 },
    { id: '8k', label: '8 kHz', nominal: 8192, lo: 7900, hi: 8300 },
    { id: '16k', label: '16 kHz', nominal: 16384, lo: 15800, hi: 16600 },
    { id: '33k', label: '33 kHz', nominal: 32768, lo: 32500, hi: 33200 },
  ];
  const FT = 0.3048;

  // Replace -Infinity / NaN (silent input) so the maths below stays finite.
  function sanitize(specDb) {
    for (let i = 0; i < specDb.length; i++) if (!(specDb[i] > -200)) specDb[i] = -200;
    return specDb;
  }

  // Noise floor in dB for every bin: median of fixed-size blocks, interpolated between block centres.
  // A median ignores the few bins a tone or hum harmonic occupies.
  function noiseFloor(specDb, block = 64) {
    const n = specDb.length, nb = Math.ceil(n / block);
    const med = new Float32Array(nb), tmp = new Float32Array(block);
    for (let b = 0; b < nb; b++) {
      const s = b * block, m = Math.min(n, s + block) - s;
      for (let i = 0; i < m; i++) tmp[i] = specDb[s + i];
      const sorted = tmp.subarray(0, m).sort();
      med[b] = sorted[m >> 1];
    }
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const p = (i - (block - 1) / 2) / block;
      const b0 = Math.max(0, Math.min(nb - 1, Math.floor(p))), b1 = Math.min(nb - 1, b0 + 1);
      const t = Math.max(0, Math.min(1, p - b0));
      out[i] = med[b0] + (med[b1] - med[b0]) * t;
    }
    return out;
  }

  function isMains(hz, mains, tol = 2) {
    if (!mains) return false;
    const k = Math.round(hz / mains);
    return k >= 1 && Math.abs(hz - k * mains) <= tol;
  }

  // Strongest peak between lo and hi Hz, with its frequency refined by parabolic interpolation.
  // A peak must be the highest bin within ±4 bins, so side-lobes of a strong neighbour (e.g. hum) don't count.
  // opts.mains skips power-line harmonics; opts.exclude(hz) skips anything else.
  function findPeak(specDb, floorDb, binHz, lo, hi, opts = {}) {
    const n = specDb.length, PROM = 4;
    const k0 = Math.max(PROM, Math.ceil(lo / binHz)), k1 = Math.min(n - 1 - PROM, Math.floor(hi / binHz));
    let best = null;
    for (let k = k0; k <= k1; k++) {
      const v = specDb[k];
      if (!(v > specDb[k - 1] && v >= specDb[k + 1])) continue;
      let prominent = true;
      for (let j = 2; j <= PROM && prominent; j++) prominent = v >= specDb[k - j] && v >= specDb[k + j];
      if (!prominent) continue;
      const hz = k * binHz;
      if (opts.mains && isMains(hz, opts.mains)) continue;
      if (opts.exclude && opts.exclude(hz)) continue;
      const snr = v - floorDb[k];
      if (!best || snr > best.snr) best = { bin: k, snr, db: v };
    }
    if (!best) return null;
    const a = specDb[best.bin - 1], b = specDb[best.bin], c = specDb[best.bin + 1];
    const den = a - 2 * b + c;
    const d = den < 0 ? Math.max(-0.5, Math.min(0.5, (0.5 * (a - c)) / den)) : 0;
    best.hz = (best.bin + d) * binHz;
    return best;
  }

  // How far power-line hum (fundamental and 3rd harmonic) stands above the floor, in dB.
  // Strong 60 Hz is a good sign a magnetic pickup coil is connected rather than a microphone.
  function humSnr(specDb, floorDb, binHz, mains) {
    let best = -Infinity;
    for (const h of [1, 3]) {
      const p = findPeak(specDb, floorDb, binHz, mains * h - 2, mains * h + 2);
      if (p && p.snr > best) best = p.snr;
    }
    return best;
  }

  // Horizontal field component (along the sonde axis) of a unit horizontal dipole, at horizontal
  // offset x along the axis and vertical distance z. Signed: zero at the poles (x = ±z/√2).
  function dipoleBx(x, z) {
    const r2 = x * x + z * z, r = Math.sqrt(r2);
    return (3 * x * x / r2 - 1) / (r2 * r);
  }

  // Directly above the sonde the field falls as 1/d³. Reading a1 at the surface, a2 after lifting
  // the coil by h:  a1/a2 = ((d+h)/d)³  ⇒  d = h / ((a1/a2)^(1/3) − 1).
  function depthFromRatio(a1, a2, h) {
    if (!(a1 > 0) || !(a2 > 0) || !(h > 0) || a1 <= a2) return null;
    return h / (Math.cbrt(a1 / a2) - 1);
  }

  // One-sigma depth uncertainty for depthFromRatio, from the standard errors of the two readings.
  function depthRatioSigma(a1, s1, a2, s2, h) {
    if (!(a1 > a2) || !(a2 > 0) || !(h > 0)) return null;
    const R = Math.cbrt(a1 / a2);
    const sR = (R / 3) * Math.hypot(s1 / a1, s2 / a2);
    return (h * sR) / ((R - 1) * (R - 1));
  }

  // The two poles (nulls with the coil pointed along the pipe) sit at ±d/√2, so d = spacing / √2.
  function depthFromPoles(spacing) { return spacing > 0 ? spacing / Math.SQRT2 : null; }

  // Calibrated: amplitude aCal measured at distance dCal ⇒ d = dCal · (aCal / a)^(1/3).
  function depthFromCal(a, aCal, dCal) {
    return a > 0 && aCal > 0 && dCal > 0 ? dCal * Math.cbrt(aCal / a) : null;
  }

  // Mean and standard error. nEff caps the sample count when readings are correlated.
  function meanSe(xs, nEff) {
    const n = xs.length;
    if (!n) return null;
    const mean = xs.reduce((s, v) => s + v, 0) / n;
    const sd = n > 1 ? Math.sqrt(xs.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (n - 1)) : 0;
    return { mean, sd, se: sd / Math.sqrt(Math.max(1, Math.min(n, nEff || n))), n };
  }

  // Length (metres in) as feet-and-inches or metres.
  function formatLen(m, units) {
    if (!(m >= 0) || !isFinite(m)) return '—';
    if (units === 'm') return m.toFixed(m < 10 ? 2 : 1) + ' m';
    const inches = Math.round((m / FT) * 12), ft = Math.floor(inches / 12);
    return ft ? `${ft}′ ${inches - ft * 12}″` : `${inches}″`;
  }

  const api = {
    BANDS, FT, sanitize, noiseFloor, isMains, findPeak, humSnr, dipoleBx,
    depthFromRatio, depthRatioSigma, depthFromPoles, depthFromCal, meanSe, formatLen,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SondeDSP = api;
})(typeof self !== 'undefined' ? self : this);
