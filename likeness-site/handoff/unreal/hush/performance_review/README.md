# GL-19R.3 — Performance & Integration Cold Read

**Status: DESK READ COMPLETE / REAL ACTOR PERFORMANCE NOT YET PERFORMED / HUMAN REVISION HOLD.**

This folder provides a source-grounded review of HUSH `MECH_HIDE_001` for the Room 14 closet sequence, based on the draft `handoff/story/A_NIGHT_FOR_FOUR.fountain`. It is not the source of story canon and contains no Unreal Engine integration.

Read in order:

1. [Scene-grounded cold read](GL-19R3_SCENE_GROUNDED_COLD_READ_V001.md) — source stage positions and causality; eight actor rehearsal scenarios still **pending**.
2. [Integration collision review](GL-19R3_DIRECTOR_INTEGRATION_REVIEW_V001.md) — eligible pose windows, cue holds, scripted action priority, single rewind owner and full QA risks.
3. [Pure cue-read reference](cue_read_gate.mjs) + [15 Node tests](cue_read_gate.test.mjs) — independent desk-model test, not an actor/animation/Blueprint test.
4. [Gate receipt](../../../docs/production/receipts/2026-11-08-GL-19R3-HUSH-PERFORMANCE-INTEGRATION-V001.md).

Test in Node 18+:
```sh
node --test likeness-site/handoff/unreal/hush/performance_review/cue_read_gate.test.mjs
```

**Observed:** 15 tests passed, zero failures. GitHub hashes for both tested files match the locally executed bytes. The reference model does not interact with the GL-19R.2 oracle or UOVSNoiseListenerComponent and has no direct UE5.8 API, microphone, or scene actors.

**Primary blocker:** If THE OTHER is seated, a HUSH cue to turn a camcorder on the dresser is not a physically credible instantaneous action. The original screenplay also already has a DRYA-driven rewind and a later approach toward the closet; duplicate cues could erase story causality. Limit initial HUSH rehearsal to a measurable camera-setup window (recommendation, not yet approved) or separately authorize reblocking.

**Protected:** GL-19R provisional five decisions; GL-19R.1 listener; GL-19R.2 oracle; screenplay/story bible; source game and preserved sandbox; no microphone hardware, paid generation, source installation, branch merge or canon promotion.

**Next hold:** Founder/human performance decision and GL-15/G06 physical prerequisites before any Unreal integration.
