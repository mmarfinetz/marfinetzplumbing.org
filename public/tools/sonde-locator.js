/* Sonde Locator DSP core (browser + node). */
(function (root) {
  // Common push-camera / pipe-sonde transmit frequencies (Hz).
  const SONDES = [
    { name: 'Sonde 512 Hz (standard)', hz: 512 },
    { name: 'Sonde 640 Hz', hz: 640 },
    { name: 'Sonde 850 Hz', hz: 850 },
    { name: 'Sonde 16 kHz', hz: 16000 },
    { name: 'Sonde 33 kHz', hz: 33000 },
  ];

  // Convert dB spectrum (analyser format) to linear power.
  function dbToPower(db) { return Math.pow(10, db / 10); }

  // Linear amplitude + SNR (dB) for a target frequency in a dB spectrum.
  // Signal: power in +/-halfW bins. Noise: median per-bin power in flanking windows.
  function measureBand(spectrumDb, sampleRate, fftSize, hz, halfW = 2) {
    const binHz = sampleRate / fftSize;
    const c = Math.round(hz / binHz);
    const n = spectrumDb.length;
    if (c - halfW - 12 < 1 || c + halfW + 12 >= n) return null;
    let sig = 0;
    for (let i = c - halfW; i <= c + halfW; i++) sig += dbToPower(spectrumDb[i]);
    const flank = [];
    for (let i = c - halfW - 12; i < c - halfW - 2; i++) flank.push(dbToPower(spectrumDb[i]));
    for (let i = c + halfW + 3; i <= c + halfW + 12; i++) flank.push(dbToPower(spectrumDb[i]));
    flank.sort((a, b) => a - b);
    const noisePerBin = flank[flank.length >> 1] || 1e-20;
    const noise = noisePerBin * (2 * halfW + 1);
    const net = Math.max(sig - noise, 0);
    return {
      hz, amplitude: Math.sqrt(net), snrDb: 10 * Math.log10(sig / noise),
    };
  }

  // Dipole near-field: B ~ 1/d^3. With reading A1 at ground and A2 raised by h:
  // A1/A2 = ((d+h)/d)^3  =>  d = h / ((A1/A2)^(1/3) - 1)
  function depthFromRatio(a1, a2, h) {
    if (!(a1 > 0) || !(a2 > 0) || !(h > 0) || a1 <= a2) return null;
    return h / (Math.cbrt(a1 / a2) - 1);
  }

  // Alternative: calibrated constant k = A * d^3 measured at a known depth.
  function depthFromCal(a, k) { return a > 0 && k > 0 ? Math.cbrt(k / a) : null; }

  const api = { SONDES, measureBand, depthFromRatio, depthFromCal, dbToPower };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SondeDSP = api;
})(typeof self !== 'undefined' ? self : this);
