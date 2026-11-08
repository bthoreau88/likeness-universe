# GL-19R.2 — Independent HUSH Code Review + Hide Director Contract V001

**Project:** LIKENESS : THE GAME · Room 14 · scene 3.3 · `MECH_HIDE_001`  
**Authority:** GL-19R provisional design (founder-approved); GL-19R.1 simulated-only source (host-tested; Unreal unverified)  
**State:** REVIEW CONTRACT / PROPOSED DIRECTOR INTERFACE / NOT IMPLEMENTED IN UNREAL / NOT CANON  
**Isolation:** `handoff/unreal/hush/director_contract_candidate/` only. No `cpp_rowstructs`, `Build.cs`, `.uproject`, game worktree, canonical registry or story edit.

## 1 — Responsibilities

| Owner | Input / output | Must never own |
|---|---|---|
| Existing `UOVSHideSpotComponent` (GL-15 still unverified) | Hide enter/exit, movement/look constraints, slat-view | HUSH audio tiering, exposure, rewind outcome |
| Simulated-only `UOVSNoiseListenerComponent` | `Arm`/`Disarm`, `Deafen`, `ReportNoise(margin,reason)` → `OnThresholdBreached(tier,margin,Simulated,reason)` | Breath input interpretation, performance, exposure, state aliases, audio hardware |
| **Hide director (this contract)** | Only accepted listener breach events, gameplay clock, existing hide lifecycle → exposure/presentation directives and **single** existing rewind request | Microphone, live sound analysis, actor animation content, new room-state IDs, screenplay revisions |
| Existing Room 14 rewind owner | Execute already-established `seen → rewind, never death`, acknowledge complete | Invent a second rewind endpoint, death state or global `ROOM_ATTENTION` |

**No hardware mic:** there must be no `AudioCapture` dependency, permission, input stream or real dB measurement in Milestone 2. The numerical 10/12/25 values are simulated margins, not acoustic calibration.

## 2 — Event bridge, directional only

1. GL-15 `OnHideChanged(Pawn, true)` → director `beginHide()` → `SETUP(exposure)`, then `ARM`; bind to listener only after GL-15 confirms the actual component signature.
2. Input director converts **hold release early** to `ReportNoise(10, Exhale)`, **attempted look while frozen** to `ReportNoise(12, Hanger)`, **breath exhaustion** to `ReportNoise(25, Gasp)`. Player movement/look still obey hide locks.
3. Listener ignores sub-8 input, blocks duplicates within **1.2 seconds**, and emits a counted minor at `>=8` and major at `>=20`.
4. Only the counted `OnThresholdBreached` event calls director `breach(minor|major)`; uncounted raw input **must not** reset the silence timer.
5. Director emits `EXPOSURE`, `PRESENT` or `REWIND_ONCE` directives; actual Level Sequence/animation binding is a separate, human-checked PC implementation.
6. On hide exit the director emits `DISARM`. On rewind it issues **DISARM → DEAFEN(min 1.5s) → REWIND_ONCE**, then waits for completion acknowledgment; new noise while pending is ignored. The rewind owner must not invoke the callback more than once for this transition.
7. A completed rewind queues exposure **2** for *the next* hide entry; the director does not immediately arm or fabricate a player action.

**Clock contract:** A single pause-aware *gameplay* timebase must drive the listener's refractory/deafening and director's silence timer. The director oracle accepts an explicit `tickGameplay(dtMs)` rather than sampling system time. While paused, the caller sends no positive gameplay delta. World time dilation, cutscene-pauses, focus loss, alt-tab and long-frame catch-up require future PIE verification. No busy loops or real-time background polling.

## 3 — Exposure and observed behavior

`Exposure` is hide-session local and stays between **0 and 5**. It is never `ROOM_ATTENTION`, `ROOM_TRUST`, `ROOM_MEMORY`, sanity, grief, or a persistent canon state.

| Exposure | Director's **proposed** performance directive | Editorial rule |
|---|---|---|
| 0 | Neutral setup of THE OTHER's existing action | No reaction |
| 1 | **PAUSE / start** | First audible slip interrupts his dialogue/action |
| 2 | **PAUSE / extend** | Second slip lengthens the *same pause family*, not a fourth stage |
| 3 | **CAMCORDER / turn** | He turns the screen toward the closet, without new clue content |
| 4 | **APPROACH / stand** | He stands/approaches; no automatic death/attack |
| 5 or any major | **Existing seen → rewind** | Once only; no new final outcome or forced-story node |

This resolves the prior review ambiguity: *two* early exhale inputs must produce two **observable changes**, while the scene retains only **three families** (pause, camcorder, approach). The pause's second variation is not a new animation family or a new line of DRYA dialogue.

At most one presentation directive is fired per threshold per hide attempt. When 12 seconds of counted-event-free gameplay pass, exposure falls by 1 (floor 0); subsequent uninterrupted 12s periods can each lower it again. Physical actions already performed are **not reversed or replayed** merely because exposure decays and later rises. The director tracks `highestPresented` for that attempt. On rewind, the next entry at exposure 2 uses a **PAUSE_RESUME setup posture** without replaying earlier pause transitions; its next counted minor to 3 can trigger camcorder turn. This is **a proposed presentation mapping**, not a new visual/canon lock: human performance cold read must review it before camera/animation work.

## 4 — State transition acceptance

- `IDLE → HIDDEN`: open a hide attempt, set exposure 0 (or 2 from completed rewind), emit setup and one arm.
- `HIDDEN → IDLE`: normal exit, disarm; a new ordinary entry starts exposure 0.
- `HIDDEN → REWIND_PENDING`: major or exposure 5, disarm → deafen → request rewind once; suppress further breaches.
- `REWIND_PENDING → IDLE`: only explicit rewind-complete acknowledgment; queues exposure 2, but does not auto-reenter.
- No `N1_INTRO` / `N4_SURVIVE` / `N5_RESOLVE`, 90-second forced survival, three-failure convergence, DRYA voice inversion, new death branch, or second mechanic ID.

## 5 — Verification and execution proof

**Run the oracle:** `node --test likeness-site/handoff/unreal/hush/director_contract_candidate/HideDirectorContractOracle.test.mjs` (Node >=18). It tests the *director reference* with already-filtered listener events. Listener thresholds and refractory were host-tested in GL-19R.1; that test is separate and not repeated by this oracle.

**Observed at GL-19R.2 preparation:** 15/15 node:test cases PASS against exact local oracle/test bytes. The GitHub blobs must match these identities:
- Oracle `13bacc2cfb96f927bb67db907ef9e1154b82d675`
- Test `47c4c1bd096178628927b2ea14542974ebc3061b`

**Not verified:** dynamic Blueprint signatures; UE5.8 UHT; GL-15 hide spot/slat view; G06 Editor startup/MapCheck/clean exit; once-only *real* rewind; a real actor's timing/performance; pause/focus behavior; mic privacy in Unreal. These remain blocking.

## 6 — QA and stop conditions

- **Director ↔ listener handoff:** test two Exhales separated by >1.2 s, a Hanger minor, a Gasp major; prove event filtering occurs upstream and that only accepted events update exposure.
- **Presentation:** separate human cold read of three families, with no unsanctioned script/text, no camera/lens drift and no automatic rollback of actor position on exposure decay.
- **Timing:** no double-count inside refractory; 12s decay; pause/focus frame-stall; reset/disarm/rewind; repeated scene entries; exactly-once rewind under event storms.
- **Custody:** after GL-15 + G06 pass independently, use **third disposable UE sandbox copy**, hash source and current sandbox before/after; never follow earlier install instructions targeting original `C:\OVS\LIKENESS_THE_GAME`.
- **Stop:** on unclear GL-15 delegate, missing authoritative rewind owner, unknown UE5.8 compile behavior, proposed mic or story mechanics, insufficient machine RAM or any unexpected source mutation.

**Disposition: DIRECTOR CONTRACT CANDIDATE + DETERMINISTIC ORACLE TESTED / HUMAN PERFORMANCE AND UE INTEGRATION REVIEW REQUIRED.** No game installation, audio permission, source promotion or paid generation authorized.
