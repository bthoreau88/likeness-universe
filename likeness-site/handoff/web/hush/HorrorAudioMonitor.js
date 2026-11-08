/**
 * HorrorAudioMonitor.js
 * MECH_HIDE_001 noise layer — microphone tuning rig (PROPOSED; mic is OFF in the slice)
 * Spec: handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md · vanilla ES module, no build step.
 *
 * Pipeline:
 *   mic (getUserMedia) → MediaStreamSource → BiquadFilter (high-pass) → AnalyserNode
 *                                                                          │
 *                         fixed 60 Hz tick ◄── requestAnimationFrame ◄─────┘
 *                                │
 *              RMS → dBFS → margin above calibrated floor → tier → callback
 *
 * Why dB margin instead of "volume minus floor":
 *   Linear subtraction (the dossier's method) makes the same threshold far too
 *   sensitive in a silent room and too deaf next to a fan. A margin in dB above
 *   the floor is a ratio, so "8 dB above your room" means the same thing
 *   everywhere.
 *
 * Usage (must be started from a user gesture — browsers block AudioContext otherwise):
 *   const mon = new HorrorAudioMonitor({
 *     onThresholdBreached: (e) => console.log(e.tier, e.marginDb),
 *   });
 *   button.onclick = async () => { await mon.start(); await mon.calibrate(); mon.arm(); };
 */

export class HorrorAudioMonitor {
  /**
   * @param {Object}   [opts]
   * @param {Function} [opts.onThresholdBreached]  (event) => void — REQUIRED by spec; fires on minor + major.
   * @param {Function} [opts.onSustainedVoice]      (event) => void — fires once per sustained-voice window (N5 inversion).
   * @param {Function} [opts.onCalibrated]          ({ floorDb, samples }) => void
   * @param {Function} [opts.onTick]                ({ rmsDb, marginDb, playerNoise }) => void — for meters / NOISE.
   * @param {number}   [opts.calibrationMs=3000]    Ambient averaging window.
   * @param {number}   [opts.minorDb=8]             Margin above floor that counts as a slip.
   * @param {number}   [opts.majorDb=20]            Margin above floor that is an instant fail.
   * @param {number}   [opts.attackTicks=2]         Consecutive ticks over threshold before firing (~33 ms). Rejects single-frame clicks.
   * @param {number}   [opts.refractoryMs=1200]     Dead time after an event so one gasp registers once.
   * @param {number}   [opts.sustainMs=600]         Continuous time over minorDb that counts as "speaking".
   * @param {number}   [opts.highPassHz=120]        Removes HVAC hum, desk thumps, handling rumble. 0 = off.
   * @param {number}   [opts.fftSize=1024]          ~21 ms window at 48 kHz, close to one 60 Hz tick.
   * @param {number}   [opts.tickHz=60]             Fixed processing rate, independent of display refresh.
   * @param {boolean}  [opts.echoCancellation=true] Leave on; helps with call-style bleed. Does NOT reliably cancel <video> playback.
   * @param {string}   [opts.deviceId]              Specific input device.
   */
  constructor(opts = {}) {
    this.opts = {
      onThresholdBreached: () => {},
      onSustainedVoice: null,
      onCalibrated: null,
      onTick: null,
      calibrationMs: 3000,
      minorDb: 8,
      majorDb: 20,
      attackTicks: 2,
      refractoryMs: 1200,
      sustainMs: 600,
      highPassHz: 120,
      fftSize: 1024,
      tickHz: 60,
      echoCancellation: true,
      deviceId: undefined,
      ...opts,
    };

    // ── audio graph ──────────────────────────────────────────────
    this.ctx = null;
    this.stream = null;
    this.source = null;
    this.filter = null;
    this.analyser = null;
    this.buffer = null; // Float32Array reused every tick — no per-frame allocation

    // ── state ────────────────────────────────────────────────────
    this.floorDb = null;          // calibrated ambient floor (dBFS)
    this.armed = false;           // only armed monitors fire callbacks
    this.mode = 'spike';          // 'spike' (N2) | 'sustain' (N5 inversion)
    this.running = false;
    this._calibrating = null;     // { samples: number[], resolve, until }
    this._overCount = 0;          // consecutive ticks over current threshold
    this._refractoryUntil = 0;
    this._deafUntil = 0;
    this._sustainStart = 0;
    this._sustainFired = false;

    // ── fixed-step loop bookkeeping ──────────────────────────────
    this._raf = 0;
    this._last = 0;
    this._acc = 0;
    this._step = 1000 / this.opts.tickHz;
    this._loop = this._loop.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
  }

  /* ════════════════════════════════════════════════════════════════
   *  LIFECYCLE
   * ════════════════════════════════════════════════════════════════ */

  /** Opens the mic and builds the graph. Call from a click/tap handler. */
  async start() {
    if (this.running) return;

    // Disable the browser's "helpful" processing:
    //  - autoGainControl boosts a quiet room until its floor drifts upward,
    //    which silently invalidates calibration mid-scene.
    //  - noiseSuppression is tuned to delete exactly the breaths and gasps we
    //    are trying to hear.
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: this.opts.deviceId ? { exact: this.opts.deviceId } : undefined,
        echoCancellation: this.opts.echoCancellation,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
      video: false,
    });

    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC({ latencyHint: 'interactive' });
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    this.source = this.ctx.createMediaStreamSource(this.stream);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = this.opts.fftSize;
    this.analyser.smoothingTimeConstant = 0; // irrelevant for time-domain, explicit anyway
    this.buffer = new Float32Array(this.analyser.fftSize);

    if (this.opts.highPassHz > 0) {
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'highpass';
      this.filter.frequency.value = this.opts.highPassHz;
      this.filter.Q.value = 0.707; // Butterworth — flat passband
      this.source.connect(this.filter).connect(this.analyser);
    } else {
      this.source.connect(this.analyser);
    }
    // NOTE: analyser is NOT connected to ctx.destination → the player never
    // hears their own mic, and the monitor creates no feedback loop.

    this.running = true;
    this._last = performance.now();
    this._acc = 0;
    this._raf = requestAnimationFrame(this._loop);
    document.addEventListener('visibilitychange', this._onVisibility);
  }

  /** Tears everything down and releases the mic indicator. */
  async stop() {
    this.running = false;
    this.armed = false;
    cancelAnimationFrame(this._raf);
    document.removeEventListener('visibilitychange', this._onVisibility);
    if (this._calibrating) {
      this._calibrating.reject(new Error('Monitor stopped during calibration'));
      this._calibrating = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    try { this.source?.disconnect(); } catch {}
    try { this.filter?.disconnect(); } catch {}
    if (this.ctx && this.ctx.state !== 'closed') await this.ctx.close();
    this.ctx = this.stream = this.source = this.filter = this.analyser = null;
  }

  /* ════════════════════════════════════════════════════════════════
   *  CALIBRATION
   * ════════════════════════════════════════════════════════════════ */

  /**
   * Averages ambient level for `calibrationMs` (default 3 s).
   * Disarms during the window. Resolves with the floor in dBFS.
   *
   * Robustness: uses a 20% trimmed mean of per-tick power. If the player
   * coughs during calibration, the loudest ticks are discarded instead of
   * poisoning the floor (which would make the game deaf for the whole run).
   */
  calibrate(ms = this.opts.calibrationMs) {
    if (!this.running) return Promise.reject(new Error('Call start() first'));
    this.armed = false;
    return new Promise((resolve, reject) => {
      this._calibrating = {
        samples: [],
        until: performance.now() + ms,
        resolve,
        reject,
      };
    });
  }

  _finishCalibration() {
    const { samples, resolve } = this._calibrating;
    this._calibrating = null;

    // samples hold mean-square power (linear). Average power, not dB —
    // averaging logarithms underweights peaks and biases the floor low.
    const sorted = samples.slice().sort((a, b) => a - b);
    const keep = Math.max(1, Math.floor(sorted.length * 0.8)); // drop top 20%
    let sum = 0;
    for (let i = 0; i < keep; i++) sum += sorted[i];
    const meanPower = sum / keep;

    // Clamp: a hardware-muted mic reads ~-inf and would make every
    // whisper a "major" event. -90 dBFS is a sane digital floor.
    this.floorDb = Math.max(HorrorAudioMonitor.powerToDb(meanPower), -90);
    this.opts.onCalibrated?.({ floorDb: this.floorDb, samples: samples.length });
    resolve(this.floorDb);
  }

  /* ════════════════════════════════════════════════════════════════
   *  GAME-FACING CONTROLS
   * ════════════════════════════════════════════════════════════════ */

  /** Start firing callbacks (N2 / N5). Requires a calibrated floor. */
  arm(mode = 'spike') {
    if (this.floorDb === null) throw new Error('Calibrate before arming');
    this.mode = mode;
    this.armed = true;
    this._overCount = 0;
    this._sustainStart = 0;
    this._sustainFired = false;
  }

  /** Stop firing callbacks (N1, N3, N4). Measurement continues for meters. */
  disarm() {
    this.armed = false;
    this._overCount = 0;
  }

  /**
   * Ignore input for `ms`. Call on every node transition / stinger so the
   * game's own audio tail can't trip the mic (speaker-bleed rule).
   */
  deafen(ms) {
    this._deafUntil = Math.max(this._deafUntil, performance.now() + ms);
    this._overCount = 0;
  }

  /** Runtime threshold changes, e.g. STRAIN ≥ 60 → setThresholds({ minorDb: 5 }). */
  setThresholds({ minorDb, majorDb } = {}) {
    if (typeof minorDb === 'number') this.opts.minorDb = minorDb;
    if (typeof majorDb === 'number') this.opts.majorDb = majorDb;
  }

  /* ════════════════════════════════════════════════════════════════
   *  60 Hz FIXED-STEP LOOP
   *  rAF runs at the display rate (60/120/144 Hz). The accumulator turns that
   *  into a steady 60 Hz so attack/sustain timing is identical on every screen.
   * ════════════════════════════════════════════════════════════════ */

  _loop(now) {
    if (!this.running) return;
    this._acc += now - this._last;
    this._last = now;

    // Cap catch-up so a stalled tab doesn't fire a burst of 100 ticks at once.
    if (this._acc > this._step * 5) this._acc = this._step;

    while (this._acc >= this._step) {
      this._tick(performance.now());
      this._acc -= this._step;
    }
    this._raf = requestAnimationFrame(this._loop);
  }

  _tick(now) {
    // ── 1. measure ───────────────────────────────────────────────
    this.analyser.getFloatTimeDomainData(this.buffer);
    let sumSq = 0;
    const b = this.buffer;
    for (let i = 0; i < b.length; i++) sumSq += b[i] * b[i];
    const power = sumSq / b.length;                 // mean square
    const rmsDb = HorrorAudioMonitor.powerToDb(power); // 10·log10(power) == 20·log10(rms)

    // ── 2. calibration path ──────────────────────────────────────
    if (this._calibrating) {
      this._calibrating.samples.push(power);
      if (now >= this._calibrating.until) this._finishCalibration();
      return;
    }
    if (this.floorDb === null) return;

    // ── 3. normalize ─────────────────────────────────────────────
    const marginDb = rmsDb - this.floorDb;
    // NOISE: 0 at floor, 1 at the major threshold.
    const playerNoise = Math.min(Math.max(marginDb / this.opts.majorDb, 0), 1);
    this.opts.onTick?.({ rmsDb, marginDb, playerNoise });

    // ── 4. gates ─────────────────────────────────────────────────
    if (!this.armed) return;
    if (now < this._deafUntil) return;

    if (this.mode === 'sustain') {
      this._processSustain(now, marginDb, rmsDb);
      return;
    }
    if (now < this._refractoryUntil) return;

    // ── 5. spike detection with attack requirement ───────────────
    if (marginDb >= this.opts.minorDb) {
      this._overCount++;
    } else {
      this._overCount = 0;
      return;
    }
    if (this._overCount < this.opts.attackTicks) return;

    const tier = marginDb >= this.opts.majorDb ? 'major' : 'minor';
    this._overCount = 0;
    this._refractoryUntil = now + this.opts.refractoryMs;

    this.opts.onThresholdBreached({
      tier,                 // 'minor' → EXPOSURE +1 · 'major' → N3
      marginDb,
      rmsDb,
      floorDb: this.floorDb,
      playerNoise,
      time: now,
    });
  }

  /** N5 inversion: fires once when the player speaks continuously for sustainMs. */
  _processSustain(now, marginDb, rmsDb) {
    if (this._sustainFired) return;
    if (marginDb >= this.opts.minorDb) {
      if (!this._sustainStart) this._sustainStart = now;
      if (now - this._sustainStart >= this.opts.sustainMs) {
        this._sustainFired = true;
        this.opts.onSustainedVoice?.({ marginDb, rmsDb, durationMs: now - this._sustainStart, time: now });
      }
    } else {
      this._sustainStart = 0; // any gap resets — a cough is not an answer
    }
  }

  /** Pause cleanly when the tab hides — rAF stops anyway; don't punish on return. */
  _onVisibility() {
    if (document.hidden) return;
    this._last = performance.now();
    this._acc = 0;
    this.deafen(500); // tab-switch click / notification sound
  }

  /* ════════════════════════════════════════════════════════════════
   *  UTIL
   * ════════════════════════════════════════════════════════════════ */

  /** Mean-square power → dBFS, floored at -120 to avoid -Infinity. */
  static powerToDb(power) {
    return power > 1e-12 ? 10 * Math.log10(power) : -120;
  }

  /** Enumerate inputs for a mic picker (labels require permission first). */
  static async listInputs() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === 'audioinput');
  }
}

export default HorrorAudioMonitor;
