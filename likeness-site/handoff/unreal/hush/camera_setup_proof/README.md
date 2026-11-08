# GL-19R.3A — Camera-Setup Window / Blocking Proof Preparation

**Status:** SOURCE + SYNTHETIC FEASIBILITY COMPLETE · **NOT** A PHYSICAL PERFORMANCE PROOF  
**Purpose:** Determine whether HUSH's three reaction families can fit inside THE OTHER's original camcorder setup before he sits, without changing DRYA's confrontation or faking camera/actor movement.

Read these documents:

1. [Grounded rehearsal protocol](GL-19R3A_WINDOW_AND_BLOCKING_PROTOCOL_V001.md) — source authority, camera setup opportunity, human timing procedure, six-gate acceptance matrix and critical return-to-tripod concern.
2. [Blank rehearsal timing & blocking CSV](GL-19R3A_REHEARSAL_MEASUREMENTS_V001.csv) — ten scenario rows and 26 columns, with no observations invented.
3. [Pure timing feasibility model](assess_setup_window.mjs) and [reproducible Node tests](assess_setup_window.test.mjs).
4. [Execution receipt](../../../../docs/production/receipts/2026-11-08-GL-19R3A-CAMERA-SETUP-WINDOW-V001.md).

## Reproduce the logic check

Requires Node.js 18 or newer; from the repo root:

```sh
node --test likeness-site/handoff/unreal/hush/camera_setup_proof/assess_setup_window.test.mjs
```

**Evidence:** The exact pure evaluator later committed was exercised in a JS runtime with **13/13 manual scenario assertions passing**. The Node test suite is staged for independent rerun; this receipt does **not** claim that Node or Unreal CI executed on the target MSI.

The calculator takes **invented or subsequently measured** window and reaction durations explicitly as inputs. It does not infer seconds from screenplay, recognize prop geometry, prove breath-input accessibility, grant story permission for an extra return movement, or turn a mathematically possible 8s hypothetical into a real performed read.

## Source vs. assumptions

**Grounded:** Camcorder against chest → dresser tripod / flip-out screen setup → desk chair → DRYA refusal and scripted rewind → later scripted closet approach, from `A_NIGHT_FOR_FOUR.fountain` scene 3.3 (draft). Existing `MECH_HIDE_001` failure = rewind, never death.

**Derived:** Four counted minors need at least **3.6 seconds between first and fourth** if the listener maintains a **1.2-second refractory**. Action durations, sightline, window start/end and return path require human measurement or directing authority.

**Unverified:** Whether four physically legible cues fit; whether third camera cue is visible through slats and fourth approach can return to the camera/chair without rewriting the scene; all actor-rehearsal P01–P08 and GL-15/G06/UE5.8 tests.

**Verdict:** Do **not** implement or claim GL-19R.3A success until the human performed blocking test, return-path decision, and previous runtime source safeguards are satisfied. No microphone, paid generation, original/sandbox source changes, script/canon promotion or merge.
