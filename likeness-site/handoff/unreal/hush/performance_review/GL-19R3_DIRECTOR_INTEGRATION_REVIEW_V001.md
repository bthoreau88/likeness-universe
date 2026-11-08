# GL-19R.3 — HUSH Director Integration & Timing Collision Review V001

**Scope:** LIKENESS : THE GAME, Room 14, `BEAT_DOUBLE_OCCUPANCY_001`, `MECH_HIDE_001`  
**Status:** **REFERENCE INTEGRATION LOGIC TESTED / REAL ACTOR AND UE INTEGRATION NOT VERIFIED**  
**Branch:** GL-19R.3 review-only, stacked on GL-19R.2; **no production, original sandbox, or site changes**.

## Source / ownership ledger

| Authority | What controls | What GL-19R.3 cannot change |
|---|---|---|
| `handoff/story/A_NIGHT_FOR_FOUR.fountain` scene 3.3 (draft; GL-16 pending) | THE OTHER's camera → desk chair → existing DRYA-triggered tape rewind → later closet approach; DRYA has agency | Do not replace or casually reorder the existing confrontation |
| `SCREENPLAY_TO_GAME.md` | Milestone 2 scene / existing `MECH_HIDE_001`, failure = rewind, not death | No new story state / wider first slice |
| Founder-approved GL-19R | Three HUSH performance families, simulated noise only | No microphone or DRYA inversion |
| GL-19R.1 candidate listener | Accept/reject simulated sound; minor 8, major 20, 1.2 s cooldown; disarm | No listener-owned exposure, performance or scene graph |
| GL-19R.2 oracle | Exposure 0–5; 12s decay; ordered PAUSE start/extend, CAMCORDER, APPROACH; one HUSH rewind request | Oracle is not a real Unreal director |
| GL-19R.3 cue-read gate | **NEW pure, review-only** eligibility check for scene pose/window; rewind-intent coalescing | No actual actor motion, Blueprint graph, Level Sequence, UE script, sound capture or new dialogue |

## Cue dispatch rule (separate from exposure)

**Do not equate reaching exposure 3 with an actor physically being able to turn the camcorder.** The previous oracle's `PRESENT` directive is an *intent*. A future adapter must validate whether the actor's **real position and active scene action** make it playable.

1. When THE OTHER is interrupted during an active task, a PAUSE intent may be eligible. Exposure 1 begins the pause, exposure 2 extends it; two different playable responses remain in **one** family.
2. CAMCORDER intent must wait until he is **within reach of the tripod** and no scripted actor action owns that interval. While seated at the desk, it is **deferred/unresolved**, not teleported.
3. APPROACH intent cannot overtake a still-pending camcorder intent. If already standing next to the tripod, the approach must not play a second stand. A seated alternate reblocking route is **not approved** and cannot be synthesized from the existing director.
4. Active scripted/cutscene actions lock HUSH cue execution; cues may be pending within that same local hide attempt but **must not play after a rewind**. The window itself has no validated duration. If the action never becomes physically playable before exit/rewind, record **coverage failure**, not a silent gameplay pass.
5. Existing DRYA-triggered scripted rewind and HUSH-triggered detection rewind are two **intents** to one *existing* Room 14 rewind owner. Requests made before the commit interval ends are coalesced; scripted one takes precedence when both occur prior to commit. Once any owner has committed, further intent does **not** cause another rewind.
6. Rewind discards pending HUSH body/prop actions. No pose reset is invented by this adapter. Only the verified scene/shot rewind owner may restore the correct frame/pose; after its acknowledgment the next hide has the already approved local exposure 2.
7. If THE OTHER's scripted late scene approach toward the closet is already active, any separate HUSH approach must be held/skipped and reported to editorial. Do not duplicate the movement or retime DRYA to accommodate it.

## Review-only test harness

Files are in `handoff/unreal/hush/performance_review/`: `cue_read_gate.mjs` and `cue_read_gate.test.mjs`.

Run with Node 18+:
```sh
node --test likeness-site/handoff/unreal/hush/performance_review/cue_read_gate.test.mjs
```

**Observed with local Node:** TAP **15 passed, 0 failed**. Verified GitHub blob identities exactly match the locally executed test files:
- `cue_read_gate.mjs` SHA-1 `c8ef71a614f12283c7f100b200c194602d0b9c51`
- `cue_read_gate.test.mjs` SHA-1 `0cfb56d20cda340b1d5c933e7e8fe3bf820c1701`

Coverage: early/second pause, seated screen-turn rejection/defer, eligible return, no CAMCORDER→APPROACH reordering, story-beat locking, duplicate cue refusal, concurrent rewind coalescing, single commit, pending cue cancellation, no automatic actor reset, no microphone hooks.

**Critical limitation:** The cue model is *not wired* to the GL-19R.2 oracle or the C++ listener. Tests are isolated reference checks, not evidence of integrated gameplay, frame timing, collision detection, or actor blocking.

## Real-engine interface required later (do not wire yet)

| Signal | Expected owner | Necessary evidence |
|---|---|---|
| `HideEnter/HideExit` | Verified `UOVSHideSpotComponent` after GL-15 | Live log + slat-view + inspect parity |
| `OnThresholdBreached` | Simulated listener, post-UHT qualification | One accepted event, cooldown, source=Simulated; no real mic |
| `ActorBusy`, `AtTripod`, `Seated`, `ShotOwner` | Existing Level Sequence/animation, to be inspected | Actual scene position and cutscene tracks, not an assumed boolean |
| `PauseStart/Extend`, `TurnCamcorder`, `Approach` | Human-approved acting/animation | Clear causal and spatial performance with no forced camera changes |
| `RequestRewind`, `RewindCommitted`, `RewindComplete` | Identified Room 14 rewind owner | Exactly-once requests; no conflict between scripted and HUSH causes |
| `GameplayDelta` | UE world/gameplay time | Paused focus and cinematic sequencing don't advance 12s silence incorrectly |

## Integrated QA failure matrix

| Risk | Trigger | Required observation / fail rule |
|---|---|---|
| Cue teleport | Exposure 3 while seated | Reject screen-turn; no actor position jump |
| False player agency | Repeated minor sounds while script locked | If actor cannot respond in playable window, **FAIL fairness cold read** |
| Duplicate performance | Exposure decays and crosses 3 again | No repeated camcorder turn without separate acted reset |
| Double rewind | HUSH major collides with DRYA-refusal scripted rewind | One actual room rewind; retain causality/DRYA agency |
| Wrong owner | HUSH approach fires during later scripted closet approach | Hold/skips one rather than duplicate step/animation |
| Post-rewind contamination | Cue queued before rewind | No late cue after reset; authoritative reentry pose |
| False audio assertion | No captured mic requested | **No mic use**, not a claim that audio device privacy was observed in UE |
| Invalid authority | Applying new shot/line to fix reachability | Founder + story/performance review; no silent update |

## Gate decision

**Software reference:** PASS for 15 isolated cue-eligibility/arbitration tests.  
**Scene coverage:** **NOT PASSED** for unrestricted HUSH behavior across the seated dialogue; a camera-screen turn at distance lacks physically justified blocking.  
**Performed actor cold read:** **NOT DONE**; requires human acted/mimed read and shot blocking after GL-15 and G06 resource gates.  
**Recommended experiment:** Try the narrow camera-setup window first, measure actual available action duration, and confirm whether it supports the player's breath-hold/event cadence without removing DRYA's dialogue or the existing rewind.

**GL-19R.3 disposition: CUE REFERENCE PASS / SOURCE CONTINUITY REVIEW REQUIRES REVISION / HUMAN PERFORMANCE HOLD.** No Unreal build or production/canon changes.
