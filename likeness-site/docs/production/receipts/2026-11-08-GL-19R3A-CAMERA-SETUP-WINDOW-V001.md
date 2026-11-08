# GL-19R.3A — Camera-Setup Window & Performance Blocking Proof Intake Receipt V001

**Date:** 2026-11-08 PT  
**Project:** LIKENESS : THE GAME / Room 14 / `MECH_HIDE_001`  
**User direction:** "Recommended next gate GL-19R.3A — Camera-Setup Window & Performance Blocking Proof" following GL-19R.3 review PR #30. Interpreted as authorization to **enter the bounded desk/rehearsal-preparation gate**, not to revise the story, perform a fake acting proof, move source to the UE module, or merge anything.  
**Base:** `codex/lkn-game-gl19r3-performance-integration-v001` at `6b6eea37af73915b6c8650302bf8084096b77226` (draft PR #30, remains unmerged).  
**Work branch:** `codex/lkn-game-gl19r3a-camera-setup-proof-v001`, stacked for review.

## What was actually completed

1. Re-read draft screenplay `handoff/story/A_NIGHT_FOR_FOUR.fountain` blob `023d1ebbd0baf1f0e59421a0b86f8dc07f484981`: THE OTHER enters, uses mounted tripod and flip-out screen, sits in desk chair, performs DRYA-refusal rewind later, and approaches closet even later. **No duration, distances, marked timing or physical return-to-camera path is specified.**
2. Reconciled GL-19R.3 physical blocking and causality findings; retained provisional Option A as a **bounded rehearsal candidate** only, not a completed solution.
3. Prepared source-grounded **blocking/rehearsal protocol** with source authority, eligibility window markers, two camera witnesses, explicit no-teleport/no-retiming and DRYA/rewind constraints, and a 6-gate acceptance matrix.
4. Prepared a **26-column, ten-scenario blank measurement CSV** for timecode, actor/prop geometry, two witness views, accepted simulated events, performance, return path and existing story arbitration. **All observed measurement fields intentionally blank.**
5. Created the pure `assess_setup_window.mjs` **synthetic timing calculator** and companion reproducible Node suite. Tested the exact evaluator in the local JS runtime with **13/13 scenario assertions** covering four staged cues, 1.2-second spacing, insufficient windows, rejected inputs, 12-second decay, event filtering, and ongoing proof blockers. This does **not** assert that the separately staged Node file was run in a real engine.
6. Calculated an optimistic lower bound for fourth accepted minor: if first is at 0ms, fourth cannot be earlier than **3600 ms** at a 1200 ms listener cooldown. A wholly illustrative fixture with event times `[0,1200,2400,3600]` ms and **invented reaction lengths** `[450,500,700,1300]` ms finishes last cue at **4900 ms**; synthetic 8s fits and synthetic 4.5s fails. **The screenplay contains no such seconds, and no human timing was measured.**

## Open contradictions — NOT solved

- A cue at exposure 3 requires THE OTHER to touch the **real camera screen while at the tripod**. After sitting, it cannot fire immediately.
- An early exposure-4 **APPROACH** takes THE OTHER away from the camera before he has finished the scripted camera/chair business; **a return/reconciliation path is not supplied in the screenplay**. Rendering such a return would be a directing/story reblocking decision, not a minor technical adjustment.
- The draft already owns a separate DRYA-driven rewind and later closet approach. No duplication/reassignment is permissible.
- Four accepted minor events every 1.2s is a **cooldown floor**, not evidence a human can execute breath-hold / release inputs so quickly or that the actor can read and play each response.
- Prior P01–P08 **human** performed cold reads are **all pending**. No actual actor, prop, slat-view or live-room capture has occurred.

## Negative assertions and custody

**No** UE5.8 editor launch or UHT/Build/PIE; no actual GL-15 hide-spot passback or G06 resource-safe load/MapCheck/clean exit; no microphone capture, plugin, mic permissions, voice test, web app route, paid AI generation or cinematic shot creation. **No** source/canon screenplay, `STORY_BIBLE.md`, CSV registry, `Build.cs`, `.uproject`, `cpp_rowstructs`, original `C:\OVS\LIKENESS_THE_GAME`, existing sandbox, PR #27/#28/#29/#30, production branch or published site changed by this gate. Scope restricted to new GL-19R.3A review files.

## Disposition and next step

**GL-19R.3A DESK PREPARATION COMPLETED; SOURCE-BASED NUMERIC FEASIBILITY ONLY; PHYSICAL BLOCKING PROOF **NOT PASSED**; HOLD FOR REAL HUMAN TIMED REHEARSAL AND APPROACH-RETURN DIRECTING DECISION.**

Recommend **human-directed Option A camera-setup rehearsal** with the measurement CSV, but do not declare GL-19R.3A passed unless actual timed video/table blocking proves the camera-window length, sightlines, input fairness and actor return without script drift. If the approach cannot return credibly, send exposure 4 for separate GL-16/directing reblock review rather than silently shorten/exempt it.

Only after independent GL-15 + G06 success could a distinct, expressly authorized **disposable UE third-copy** integration gate be considered.
