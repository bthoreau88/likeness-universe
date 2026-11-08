// GL-19R.2 REVIEW ORACLE. NOT GAME CODE; NOT FOR NEXT.JS; NO MIC OR UNREAL.
// Consumes only already-classified listener events. Timing and outcome stay director-local.
export const PHASE = Object.freeze({ IDLE: 'IDLE', HIDDEN: 'HIDDEN', REWIND: 'REWIND_PENDING' });
const PRESENTATION = Object.freeze({
  1: ['PAUSE', 'start'],
  2: ['PAUSE', 'extend'],
  3: ['CAMCORDER', 'turn'],
  4: ['APPROACH', 'stand'],
});

export class HideDirectorContractOracle {
  constructor({ onDirective = () => {} } = {}) {
    this.onDirective = onDirective;
    this.reset();
  }
  reset() {
    this.phase = PHASE.IDLE;
    this.exposure = 0;
    this.quietMs = 0;
    this.highestPresented = 0;
    this.nextEntryExposure = 0;
    this.rewindIssued = false;
  }
  emit(kind, details = {}) {
    this.onDirective({ kind, ...details });
  }
  beginHide() {
    if (this.phase !== PHASE.IDLE) return false;
    this.phase = PHASE.HIDDEN;
    this.exposure = this.nextEntryExposure;
    this.highestPresented = this.exposure; // pre-position a resumed take; don't reanimate pause.
    this.nextEntryExposure = 0;
    this.quietMs = 0;
    this.rewindIssued = false;
    this.emit('SETUP', { exposure: this.exposure, presentation: this.exposure >= 2 ? 'PAUSE_RESUME' : 'NEUTRAL' });
    this.emit('ARM');
    return true;
  }
  exitHide() {
    if (this.phase !== PHASE.HIDDEN) return false;
    this.emit('DISARM');
    this.phase = PHASE.IDLE;
    this.exposure = 0;
    this.quietMs = 0;
    this.highestPresented = 0;
    this.nextEntryExposure = 0;
    return true;
  }
  breach(tier) {
    if (this.phase !== PHASE.HIDDEN) return false;
    if (tier !== 'minor' && tier !== 'major') return false;
    this.quietMs = 0; // only counted, listener-filtered breaches restart silence.
    if (tier === 'major') {
      this.issueRewind('MAJOR');
      return true;
    }
    this.exposure = Math.min(5, this.exposure + 1);
    this.emit('EXPOSURE', { value: this.exposure, cause: 'MINOR' });
    if (this.exposure >= 5) {
      this.issueRewind('EXPOSURE_5');
      return true;
    }
    for (let level = this.highestPresented + 1; level <= this.exposure; level++) {
      const step = PRESENTATION[level];
      if (step) this.emit('PRESENT', { family: step[0], variation: step[1], level });
    }
    this.highestPresented = Math.max(this.highestPresented, this.exposure);
    return true;
  }
  tickGameplay(dtMs) {
    if (this.phase !== PHASE.HIDDEN) return false;
    if (!Number.isFinite(dtMs) || dtMs < 0) return false;
    this.quietMs += dtMs;
    while (this.quietMs >= 12000) {
      this.quietMs -= 12000;
      if (this.exposure > 0) {
        this.exposure -= 1;
        this.emit('EXPOSURE', { value: this.exposure, cause: 'QUIET' });
      }
    }
    return true;
  }
  issueRewind(reason) {
    if (this.phase !== PHASE.HIDDEN || this.rewindIssued) return false;
    this.rewindIssued = true;
    this.phase = PHASE.REWIND;
    this.emit('DISARM');
    this.emit('DEAFEN', { minimumSeconds: 1.5 });
    this.emit('REWIND_ONCE', { reason, outcome: 'SEEN_NOT_DEATH' });
    return true;
  }
  completeRewind() {
    if (this.phase !== PHASE.REWIND) return false;
    this.phase = PHASE.IDLE;
    this.exposure = 0;
    this.quietMs = 0;
    this.highestPresented = 0;
    this.nextEntryExposure = 2;
    return true;
  }
}
