# GL-19R.3A — Camera-Setup Window and Physical Blocking Proof V001

**Project:** LIKENESS : THE GAME / Room 14 / `MECH_HIDE_001` / `BEAT_DOUBLE_OCCUPANCY_001`  
**Gate:** GL-19R.3A — the explicitly recommended next **review/proof-design** gate after GL-19R.3.  
**Status:** **DOCUMENTED DESK FEASIBILITY / HUMAN PHYSICAL REHEARSAL PENDING / NOT PASSED**  
**Date:** 2026-11-08 PT. **Zero paid generation; no Unreal installation, script/canon change or merger.**

## 1. Governing sources and provenance

- Screenplay: `handoff/story/A_NIGHT_FOR_FOUR.fountain`, draft v001, Git blob `023d1ebbd0baf1f0e59421a0b86f8dc07f484981`. The source gives **order of events but no exact time codes, path distances or screen orientation**. GL-16 story sign-off remains pending.
- Screenplay mapping: `handoff/story/SCREENPLAY_TO_GAME.md`, first vertical slice ends at scene 3.2 side A; closet hiding is **Milestone 2**.
- Founder-approved GL-19R: simulated noise, three behavioral reaction families, 1.2 s refractory, exposure 0–5, 12 s quiet decay, seen → rewind not death, microphone OFF, DRYA inversion held.
- GL-19R.2 director oracle: **logic reference only**. GL-19R.3 actor cue-read gate: 15/15 pure tests, uncovered camcorder reach, duplicate scripted rewind/approach and unperformed human acting. [Previous cold-read packet](../performance_review/GL-19R3_SCENE_GROUNDED_COLD_READ_V001.md).

**Do not promote the scene's draft text or this rehearsal protocol to screenplay or visual canon.** It is a proposed **blocking feasibility procedure**.

## 2. The selected Option A experiment

**Narrow scope:** Run one measured, disposable *camera-setup-only* rehearsal of THE OTHER **after he has brought the camcorder to the dresser/tripod** and **before he commits to sitting in the desk chair**. The scene's original physical authority is unchanged: DRYA has already pushed THOREAU into the slatted closet; THE OTHER enters, switches on the lamp, places camcorder on tripod, adjusts the flip-out screen, and later sits to address DRYA. The script **does not** say he stands in that window for a set number of seconds.

**Opportunity begins:** on a human-marked start frame when THE OTHER is actually within reach of the mounted camcorder and the shot/story director confirms an interruptible task. Do not start the timer at closet entry, key turn, entrance, lamp-on or an assumed animation marker.

**Opportunity ends:** first frame where THE OTHER relinquishes tripod reach, commits to walking/sitting at the desk chair, or a dialogue/Level Sequence beat gains exclusive ownership—whichever is earliest. End must be visible and time-coded. No arbitrary six- or eight-second addition to the scene is approved.

**Proof positions:** (1) actor's grounded camera-setup mark and reach to flip-out screen; (2) tripod/dresser (prop not teleported); (3) closet/slat viewing line; (4) chair; (5) approach route from tripod toward closet and a **return path** that restores the source's camera/chair business if a HUSH diversion happens. Actual measurements and positions are **UNKNOWN** until recorded. If a return path cannot be shown *without* unapproved reblocking, stage 4 fails the gate.

## 3. Timing floor and why it isn't a rehearsal measurement

The existing simulated listener's accepted-minor event refractory is **1.2 s**. If the window opens at the first eligible event (t=0), four accepted minor events can occur no earlier than:

| Counted event | Earliest model time | Proposed physical reaction |
|---|---:|---|
| 1 | 0.0 s | PAUSE / start |
| 2 | 1.2 s | PAUSE / extend; visibly different from 1 |
| 3 | 2.4 s | CAMCORDER / screen turn |
| 4 | 3.6 s | APPROACH / first deliberate movement |

**3.6 s is only the interval to the fourth counted event**, not enough evidence that four **acted** reactions fit. Real HUSH input also needs breath-hold/release cycles or attempted-look/Hanger events; the listener's cooldown is necessary but not sufficient for playable input. Actor reaction durations, shot hold, player feedback, movement, camcorder-screen reach, return path and dialogue timing must be measured.

A deliberately **synthetic example**, for testing the calculator rather than asserting story timing: `reactionDurationsMs=[450,500,700,1300]`, accepted events at `[0,1200,2400,3600]` ms. The fourth simulated action would finish at **4.9 s** if each action queues after the previous one; a synthetic 8 s window contains this scenario, a synthetic 4.5 s window does not. **Neither window nor the four reaction durations occur in the authoritative screenplay or observed rehearsal.**

At 12 s without a counted event, exposure decays by one, so long rehearsal gaps can change which stage would be eligible. A fifth counted minor reaches exposure 5 and triggers **one existing rewind**, not an additional performance step or player death.

## 4. On-the-floor zero-credit proof plan

**No UE required for this read.** Use a stand-in actor or blocking markers, a non-recording camcorder-shaped prop or a correctly positioned available camcorder, a tripod/dresser/chair with verified relative placement, and a closet-slat sightline. Do not portray stand-ins or newly staged geometry as approved Room 14 art.

Capture two continuous references if authorized: (A) neutral side/wide that reveals actual actor, prop and chair movement; (B) slat-view witness showing what the player can really see. Record both with a shared time marker and no editorial speed manipulation. If footage is unavailable, a timed human table/mime read plus marked plan is acceptable **only as an initial measurement**; it does **not** close visual read/continuity checks.

**Required run conditions:**
- Baseline no noise: THE OTHER sets up tripod and proceeds toward the desk chair with original neutral physical behavior. Record window start/end, tripod reach, slat visibility and actor mark.
- One minor event: action pauses briefly without immediately staring into closet. Preserve one-beat-late relationship to DRYA's dialogue.
- Two accepted minors **more than 1.2 s apart**: same PAUSE family, but a second distinct behavioral extension; no duplicate gesture or invented dialogue.
- Third event: turn the *real, already-mounted* flip-out screen while **physically at tripod**; show screen orientation from the slats and the side. If impossible, mark **NO-GO**.
- Fourth event: make one controlled step/approach toward the closet; then **show the return/reconciliation** to the tripod/chair at normal speed without unscripted teleport, jump cut, duplicate approach or removal of DRYA's existing agency. **This is currently unapproved reblocking and must be separately reviewed.**
- Negative run: deliver the third cue only after THE OTHER is seated. The actor must not reach/turn the tripod from the chair; log cue **deferred/failed**, not a pass.
- Competing rewind run: simulate HUSH major and the script's DRYA-refusal rewind being requested before commitment; only the *existing* rewind owner fires, at most once, preserving DRYA's story action. No actual game rewind is proven.
- Retry run: after hypothetical rewind, the next hide has exposure 2; no replayed pause transition or invented actor reset. Actual first-frame pose requires later review.

For each performance beat, choose **one primary action and at most one secondary**; no camera whip, guard search, scream, new line, logo, title, or trailer aphorism.

## 5. Human measurement sheet and evidence

Use [`GL-19R3A_REHEARSAL_MEASUREMENTS_V001.csv`](GL-19R3A_REHEARSAL_MEASUREMENTS_V001.csv). The sheet intentionally contains **empty measurements**: no durations or pass statuses have been fabricated. At minimum, capture:

- take / performer / source identity, timing rate and two synchronized view references;
- true start/end timecodes of tripod-reachable window; measured window seconds;
- event types/timestamps and whether they were *accepted* by the 1.2 s debounce; actor reaction start/end; cooldown and 12 s silence handling;
- source prop placement and actor-chair distance; reach/eye-line from actual slat POV;
- return to prior camera/chair task after the HUSH approach; no unapproved script timing;
- HUSH/script rewind collision arbitration; before/after prop/actor continuity;
- the one-primary/one-secondary behavioral observation; human pass/fail/needs-revision with exact timecode evidence.

## 6. Acceptance gates (no partial proof laundering)

| Gate | Evidence needed | Current disposition |
|---|---|---|
| A — Source custody | Draft scene verified; no story/canon rewrite, retained camera/tripod/chair/DRYA | **PASS for desk source identification only** |
| B — Timed opportunity | **Measured** reachable camera-setup window; event + reaction duration comparison; breath-input fairness | **NOT MEASURED** |
| C — Body/prop blocking | Prop reachable from actor mark; third cue seen through slats; fourth cue has justified move and return path | **UNPROVEN — source requires return reconciliation** |
| D — Dramatic continuity | DRYA keeps dialogue agency; script-owned rewind and later approach not duplicated | **UNPROVEN** |
| E — Actor cold read | 8 prior GL-19R.3 P01–P08 scenarios performed, time-coded, visible acting | **NOT PERFORMED** |
| F — Integration | GL-15 hide spot, G06 third-copy UE load/exit, then separate UHT/PIE/rewind owner | **BLOCKED** |

**No-GO rule:** If B/C/D/E is missing or failed, this gate may only report **feasibility analysis / proposed rehearsal**, not `PERFORMANCE BLOCKING PROOF PASS`. A numerical model fitting an invented window cannot override physical/creative evidence.

## 7. Recommended disposition and next action

**GL-19R.3A V001: SOURCE/TIMING MODEL PREP COMPLETE; PERFORMANCE BLOCKING PROOF NOT ACQUIRED.** The project has a possible partial Option A proof for pauses and the camera screen, but **full APPROACH within the camera setup is structurally unresolved** because the actor must return to script-authored camera/chair business. Do not silently stretch the setup window, reset actor position or skip the reaction to force a pass.

**Next human decision:** stage/film a zero-credit timed performer + prop mockup **with the approved authority references** or return the fourth HUSH cue for a separately scoped **GL-16/directing reblock review**. This gate has not opened GL-15/ G06 or authorized UE installation.
