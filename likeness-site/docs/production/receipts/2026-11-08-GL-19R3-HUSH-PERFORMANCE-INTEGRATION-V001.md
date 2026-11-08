# GL-19R.3 — HUSH Performance Cold Read & Director Integration Review Receipt V001

**Date:** 2026-11-08 (PT)  
**Project:** LIKENESS : THE GAME  
**User approval:** "Ok next gate" after the GL-19R.2 director contract pass and explicit recommendation for GL-19R.3. Approval authorizes **review, tests and staging**; not new story, acting, UE installation, source promotion, mic, paid generation or merge.
**Source base:** GL-19R.2 PR #29, head `8eb520211d0e8be08384d7e6c9330691ecff36eb`.  
**Review branch:** `codex/lkn-game-gl19r3-performance-integration-v001`.  
**Scope:** `handoff/unreal/hush/performance_review/` plus this receipt; nothing modified under `cpp_rowstructs`, original UE source, preserved sandbox, canon registry or screenplay.

## Completed / evidence

1. Retrieved **actual draft** `handoff/story/A_NIGHT_FOR_FOUR.fountain`, Git blob `023d1ebbd0baf1f0e59421a0b86f8dc07f484981`, and `SCREENPLAY_TO_GAME.md`. Verified the order of camera on tripod, seated desk-chair dialogue, DRYA's refusal, THE OTHER's **script-motivated** tape rewind and later closet approach.
2. Compared those source physical beats with the GL-19R.2 exposure-1/2 PAUSE, exposure-3 CAMCORDER, exposure-4 APPROACH, major/exposure-5 HUSH rewind.
3. **Identified real story/blocking collisions**: screen turning from desk chair; a second duplicated stand/approach; and HUSH failure rewind colliding with DRYA's own already-scripted room rewind. No scene reblocking was performed.
4. Produced `GL-19R3_SCENE_GROUNDED_COLD_READ_V001.md` with an observable-behavior acting matrix and eight **pending** human cold-read scenarios.
5. Produced `GL-19R3_DIRECTOR_INTEGRATION_REVIEW_V001.md` with actor-pose eligibility gates, causal ordering, scene lock and *single* rewind owner contract.
6. Implemented **pure reference-only** `cue_read_gate.mjs` and Node test suite. Ran `node --test` on exact source locally: **15 tests passed, 0 failed**. Verified file bytes from GitHub:
   - Source Git blob SHA-1 `c8ef71a614f12283c7f100b200c194602d0b9c51`
   - Test Git blob SHA-1 `0cfb56d20cda340b1d5c933e7e8fe3bf820c1701`.
   These tests do not execute C++ or the GL-19R.2 oracle together.

## Unverified / held

- **No human table read, rehearsal, video or acted performance** occurred. Do not say "performance cold read passed."
- No GL-15 hide-spot passback, no G06 resource-safe editor start/load/MapCheck/clean exit, UE UHT, C++ build, PIE, animation/Level Sequence binding, actor path check, rendered cinematic or real once-only rewind proof.
- No real microphone used, accessed or authorized. No hardware privacy observation in Unreal has been made.
- No original or sandbox files written, no canon promotion, no `STORY_BIBLE.md` or screenplay changes, no new dialogue, no paid AI generation, no merge to main or `claude/dreamy-hawking-VcoBe`.

## Gate result and next action

**GL-19R.3 = REFERENCE CUE TESTS PASS / PERFORMANCE COVERAGE CONDITIONAL-FAIL FOR UNRESTRICTED SCENE / HUMAN REHEARSAL & STORY-BLOCKING REVIEW REQUIRED → STOP.**

Recommendation: rehearsal **Option A**, limit first HUSH proof to the camera-setup window where THE OTHER is physically near the tripod. Measure how long this window actually lasts and check if player can generate meaningful noise decisions before scripted chair dialogue; this duration is not currently established. If the mechanic must span the seated exchange, commission a **separate**, explicit actor reblocking review instead of silently changing scene/canon or forcing actor teleportation.

GL-15 + G06 must pass prior to Unreal installation; all work stays review-only.
