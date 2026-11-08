/**
 * HideNoiseDirector.js — MECH_HIDE_001 noise layer (PROPOSED, not canon)
 * Spec: handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md · decision pending GL-19.
 *
 * Pure state machine for the 5-node HUSH matrix. No DOM, no audio — so it can be
 * unit-tested in Node and reused as the spec for the Unreal hide-beat director.
 *
 * State names are deliberately LOCAL to one hide session (EXPOSURE, STRAIN, NOISE, HISS).
 * They are not ROOM_ATTENTION / ROOM_TRUST / ROOM_MEMORY: per AUDIT_AND_INTAKE those stay
 * unaliased until a reviewed state-contract decision.
 * The video layer listens to `onNode` and `onVariant`; the audio layer feeds
 * `handleBreach`, `handleSustain` and `tick`.
 */

export const NODES = Object.freeze({
  INTRO: 'N1_INTRO',
  HIDE: 'N2_HIDE',
  FAIL: 'N3_FAIL',
  SURVIVE: 'N4_SURVIVE',
  RESOLVE: 'N5_RESOLVE',
});

export const DEFAULTS = Object.freeze({
  survivalMs: 90_000,        // time in N2 to reach N4
  quietDecayMs: 12_000,      // silence needed to drop EXPOSURE by 1
  minorGrief: 3,             // STRAIN per minor slip
  failGrief: 15,             // STRAIN per fail
  maxFails: 3,               // fails before forced convergence into N5
  rewindAttention: 2,        // EXPOSURE after a rewind — "the room remembers"
  griefTightenAt: 60,        // STRAIN threshold where the room hears better
  minorDbBase: 8,
  minorDbTight: 5,
  inversionWindowMs: 8_000,  // N5: how long DRYA waits for an answer
});

export class HideNoiseDirector {
  constructor({ onNode, onVariant, onThresholds, onState, config } = {}) {
    this.cfg = { ...DEFAULTS, ...config };
    this.onNode = onNode ?? (() => {});
    this.onVariant = onVariant ?? (() => {});           // (variantIndex 0–4) at loop seam
    this.onThresholds = onThresholds ?? (() => {});     // ({ minorDb }) → monitor.setThresholds
    this.onState = onState ?? (() => {});               // snapshot for HUD-less debug / Public Cut
    this.reset();
  }

  reset() {
    this.node = NODES.INTRO;
    this.EXPOSURE = 0;
    this.STRAIN = 0;
    this.NOISE = 0;
    this.HISS = 0;
    this.failCount = 0;
    this.minorSlips = 0;
    this.answered = null;           // N5 inversion result
    this._hideElapsed = 0;          // survival time accumulates across rewinds? No — per attempt.
    this._quietElapsed = 0;
    this._pendingVariant = null;
    this._currentVariant = 0;
    this._resolveElapsed = 0;
    this._tight = false;
  }

  /* ── node transitions ─────────────────────────────────────── */

  _go(node, meta = {}) {
    this.node = node;
    this.onNode(node, { ...meta, state: this.snapshot() });
  }

  /** N1 finished + calibration done. */
  beginHide() {
    this._hideElapsed = 0;
    this._quietElapsed = 0;
    this._currentVariant = this.EXPOSURE;
    this._pendingVariant = null;
    this._go(NODES.HIDE, { variant: this._currentVariant });
  }

  /** Called by the video layer when the fail clip ends. */
  failClipEnded() {
    if (this.node !== NODES.FAIL) return;
    if (this.failCount >= this.cfg.maxFails) {
      this._enterResolve('forced');
    } else {
      this.EXPOSURE = this.cfg.rewindAttention;
      this._syncDerived();
      this.beginHide(); // rewind
    }
  }

  /** Called by the video layer when the survival clip ends. */
  surviveClipEnded() {
    if (this.node === NODES.SURVIVE) this._enterResolve('survived');
  }

  _enterResolve(via) {
    this._resolveElapsed = 0;
    this._go(NODES.RESOLVE, { via, variant: this.resolveVariant() });
  }

  /** LOW / MID / HIGH performance variant for N5. */
  resolveVariant() {
    const g = this.STRAIN;
    return g < 35 ? 'LOW' : g < 70 ? 'MID' : 'HIGH';
  }

  /* ── audio input ──────────────────────────────────────────── */

  /** Wire to HorrorAudioMonitor.onThresholdBreached. */
  handleBreach(evt) {
    if (this.node !== NODES.HIDE) return;
    this._quietElapsed = 0;

    if (evt.tier === 'major') return this._fail('major');

    this.minorSlips++;
    this.EXPOSURE = Math.min(this.EXPOSURE + 1, 5);
    this.STRAIN = Math.min(this.STRAIN + this.cfg.minorGrief, 100);
    this._syncDerived();

    if (this.EXPOSURE >= 5) return this._fail('attention');
    this._pendingVariant = this.EXPOSURE; // applied at next loop seam
  }

  /** Wire to HorrorAudioMonitor.onSustainedVoice (N5 inversion only). */
  handleSustain() {
    if (this.node !== NODES.RESOLVE || this.answered !== null) return;
    this.answered = true;
    this.onState(this.snapshot());
  }

  _fail(reason) {
    this.failCount++;
    this.STRAIN = Math.min(this.STRAIN + this.cfg.failGrief, 100);
    this._syncDerived();
    this._go(NODES.FAIL, { reason, failCount: this.failCount });
  }

  /* ── time ─────────────────────────────────────────────────── */

  /** Call every frame with dt in ms and the monitor's playerNoise (0–1). */
  tick(dtMs, playerNoise = 0) {
    this.NOISE = playerNoise;

    if (this.node === NODES.HIDE) {
      this._hideElapsed += dtMs;
      this._quietElapsed += dtMs;

      if (this._quietElapsed >= this.cfg.quietDecayMs) {
        this._quietElapsed = 0;
        if (this.EXPOSURE > 0) {
          this.EXPOSURE--;
          this._pendingVariant = this.EXPOSURE;
          this._syncDerived();
        }
      }
      if (this._hideElapsed >= this.cfg.survivalMs) {
        this.EXPOSURE = 0;
        this._syncDerived();
        this._go(NODES.SURVIVE);
      }
    } else if (this.node === NODES.RESOLVE && this.answered === null) {
      this._resolveElapsed += dtMs;
      if (this._resolveElapsed >= this.cfg.inversionWindowMs) {
        this.answered = false; // DRYA leaves
        this.onState(this.snapshot());
      }
    }
  }

  /** Video layer calls this on every loop seam (frame 0 of the N2 loop). */
  loopSeam() {
    if (this.node !== NODES.HIDE || this._pendingVariant === null) return;
    if (this._pendingVariant !== this._currentVariant) {
      this._currentVariant = this._pendingVariant;
      this.onVariant(this._currentVariant);
    }
    this._pendingVariant = null;
  }

  /* ── derived values ───────────────────────────────────────── */

  _syncDerived() {
    this.HISS = this.EXPOSURE / 5;
    const tight = this.STRAIN >= this.cfg.griefTightenAt;
    if (tight !== this._tight) {
      this._tight = tight;
      this.onThresholds({ minorDb: tight ? this.cfg.minorDbTight : this.cfg.minorDbBase });
    }
    this.onState(this.snapshot());
  }

  snapshot() {
    return {
      node: this.node,
      EXPOSURE: this.EXPOSURE,
      STRAIN: this.STRAIN,
      SANITY: 100 - this.STRAIN,
      NOISE: this.NOISE,
      HISS: this.HISS,
      failCount: this.failCount,
      minorSlips: this.minorSlips,
      answered: this.answered,
    };
  }

  /** One-line witness-recap line (GL-11 recap step). */
  publicCutLine() {
    const held = Math.round(Math.min(this._hideElapsed, this.cfg.survivalMs) / 1000);
    const fails = ['NEVER HEARD', 'HEARD ONCE', 'HEARD TWICE', 'HEARD THREE TIMES'][Math.min(this.failCount, 3)];
    const ans = this.answered === true ? 'ANSWERED' : this.answered === false ? 'SAID NOTHING' : 'NO ANSWER YET';
    return `ROOM 14 // HELD BREATH ${held}s // ${fails} // ${ans}`;
  }
}

export default HideNoiseDirector;
