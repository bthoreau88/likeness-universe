// GL-19R.3 review-only cue eligibility and rewind arbitration model.
// No Unreal API; no runtime installation, camera movement, new story, or microphone.
export class CueReadGate {
  constructor() {
    this.locked = false;
    this.actor = { mode: 'CAMERA_SETUP', atTripod: true, seated: false, scriptedBeat: false };
    this.seenLevels = new Set();
    this.pending = new Map();
    this.actions = [];
    this.rewindIntent = null;
    this.rewindCommitted = false;
  }
  setActor(state) {
    this.actor = { ...this.actor, ...state };
    return this.drain();
  }
  acceptPresentation({ family, variation, level }) {
    if (this.locked || this.rewindIntent || this.rewindCommitted) return false;
    const valid = (level === 1 && family === 'PAUSE' && variation === 'start') ||
      (level === 2 && family === 'PAUSE' && variation === 'extend') ||
      (level === 3 && family === 'CAMCORDER' && variation === 'turn') ||
      (level === 4 && family === 'APPROACH' && variation === 'stand');
    if (!valid || this.seenLevels.has(level) || this.pending.has(level)) return false;
    this.pending.set(level, { family, variation, level });
    this.drain();
    return true;
  }
  eligible(cue) {
    if (this.locked || this.actor.scriptedBeat) return false;
    if (cue.level <= 2) return this.actor.mode === 'CAMERA_SETUP' || this.actor.mode === 'DIALOGUE';
    if (cue.level === 3) return !!this.actor.atTripod && !this.actor.seated;
    if (cue.level === 4) return !!this.actor.atTripod && !this.actor.seated;
    return false;
  }
  drain() {
    if (this.locked || this.rewindIntent || this.rewindCommitted) return 0;
    let n = 0;
    for (const level of [1,2,3,4]) {
      if (!this.pending.has(level)) continue;
      // Preserve causal order of already-issued cues. A camera movement must not
      // overtake a pending pause; an approach must not overtake the screen turn.
      if ([...this.pending.keys()].some(previous => previous < level)) break;
      const cue = this.pending.get(level);
      if (!this.eligible(cue)) break;
      this.pending.delete(level);
      this.seenLevels.add(level);
      this.actions.push({ kind: 'PERFORMANCE', family: cue.family,
        variation: cue.variation, level: cue.level });
      n++;
    }
    return n;
  }
  requestRewind(origin) {
    if (this.rewindCommitted) return false;
    if (origin !== 'HUSH' && origin !== 'SCRIPT') return false;
    // Calls within one uncommitted decision interval are coalesced;
    // story-owned rewind has priority only if requested before commit.
    if (!this.rewindIntent || origin === 'SCRIPT') this.rewindIntent = origin;
    this.locked = true;
    this.pending.clear();
    return true;
  }
  commitRewind() {
    if (!this.rewindIntent || this.rewindCommitted) return false;
    this.actions.push({ kind: 'REWIND_ONCE', owner: this.rewindIntent });
    this.rewindCommitted = true;
    return true;
  }
  resetAfterRewind() {
    if (!this.rewindCommitted) return false;
    this.locked = false;
    this.rewindIntent = null;
    this.rewindCommitted = false;
    this.seenLevels.clear();
    this.pending.clear();
    // Actual body/prop continuity and exposure-two pose are NOT reset here.
    // The game must receive an authoritative shot/source reset before any new cue.
    this.actor = { mode: 'LOCKED', atTripod: false, seated: false, scriptedBeat: true };
    return true;
  }
}
