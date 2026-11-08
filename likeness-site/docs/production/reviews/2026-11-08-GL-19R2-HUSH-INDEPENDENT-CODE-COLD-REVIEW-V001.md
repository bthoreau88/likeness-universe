# GL-19R.2 — Independent HUSH Code Cold Review V001

**Project:** LIKENESS : THE GAME · Room 14 / `MECH_HIDE_001`  
**Authority:** Founder approval of transition into GL-19R.2, following GL-19R provisional design and GL-19R.1 host-source qualification.  
**Review disposition:** **CONDITIONAL DIRECTOR CONTRACT PROOF / ENGINE INTEGRATION NOT QUALIFIED / HUMAN PERFORMANCE REVIEW HOLD.**  
**Repo:** `bthoreau88/likeness-universe` / review branch `codex/lkn-game-gl19r2-director-contract-v001` based on GL-19R.1 PR #28 at `7e34fe83ef1988e593b837412c946a363e80ddf3`.

## Reviewed source authority

- Simulated listener candidate `handoff/unreal/hush/simulated_only_candidate/Public/OVSNoiseListenerComponent.h` (blob `df5c70f12d03c127730da932993e077db68f5ed3`) and `OVSNoiseListenerComponent.cpp` (blob `0e68687824f58f4092991cb4b50c3109edc9fe95`).
- GL-19R provisional approved five-part disposition and GL-19R.1 implementation contract.
- Legacy `handoff/web/hush/HideNoiseDirector.js` (blob `9e65564c65d4c13944ac67a54e733f64983a784d`) as **experimental reference only**, not adopted runtime behavior.
- The separately staged GL-19R.2 `HideDirectorContractOracle.mjs` and its 15 scenario tests (both source-blob-verified against local executed bytes).

## Independent findings (ranked)

| Ref | Severity | Finding | Required treatment |
|---|---|---|---|
| CR-01 | BLOCK BEFORE UE | The listener does not own the actual `OnHideChanged` bridge, local exposure (0–5), twelve-second decay, behavioral stage playback or rewind once-only latch. Earlier 20/20 host tests therefore **cannot** prove a functioning HUSH hide mechanic. | Director interface contract, independent pure oracle, then verified GL-15 actor/sandbox integration before declaring gameplay readiness |
| CR-02 | BLOCK BEFORE UE | Source C++ was host-compiled under fake UHT macros only. Actual `UCLASS`/delegate reflection, exact `OnHideChanged` signature and Blueprint wiring remain unknown. | UE5.8 UHT/Build/PIE proof in disposable third copy after G06 and GL-15; never compile in current production root |
| CR-03 | MEDIUM | In the reviewed listener, `RefractorySeconds` is Blueprint editable with `ClampMin=\"0.0\"`; a game default override could defeat the approved 1.2-second invariant. | Later integration must enforce or assert >=1.2 seconds, or explicitly document a separately approved tuning variance; keep approved default now |
| CR-04 | MEDIUM | `Disarm()` clears refractory and next `Arm()` can legally accept an event immediately. Valid across distinct hide sessions, but an accidental hide-enter/exit bounce could bypass one-sound-once within the same visual shot. | Validate GL-15 hide lifecycle; debounce actor state transitions and use phase checks. Do not treat listener's idempotent same-session Arm guard as sufficient for all delegate races |
| CR-05 | MEDIUM | `NowSeconds()` returns zero when `GetWorld()` is null. The test shim has a world; an early input before `BeginPlay` is not meaningfully tested. | Require valid world and begin-play readiness before arm/report when implementing actor integration |
| CR-06 | MEDIUM | The approved **three performance families** do not prescribe a unique first/second minor animation. Earlier acceptance asks for two visible reactions by exposure 2, while a family count of three means this needs choreography. | Proposed cold-read mapping: exposure 1 starts a pause; exposure 2 extends the same pause; exposure 3 turns camcorder; exposure 4 stands/approaches. Founder/performance reviewer must judge rhythm and avoid mechanical repetition |
| CR-07 | MEDIUM | Exposure can decay below a stage already acted. Replaying a camcorder turn on re-crossing exposure 3 would create conspicuous actor continuity errors. Rewind at exposure 2 also cannot literally reverse actor posture arbitrarily. | Track highest performed stage within the attempt; decay affects numerical exposure only. After rewind, re-enter with exposure 2 and a preselected pause posture rather than replaying stage 1/2 transitions |
| CR-08 | HIGH SCOPE | The existing five-node web director has 90-second survival, fail convergence, strain and sustained-voice resolution; these exceed GL-19R provisional authority and may conflict with story lane. | **EXCLUDE** from GL-19R.2. Do not import `N4_SURVIVE`, `N5_RESOLVE`, voice inversion or new outcome into Room 14 |
| CR-09 | HIGH SCOPE | The old HUSH install doc invokes UE Build.bat against the original `C:\OVS\LIKENESS_THE_GAME` and references enabling Audio Capture. | **DO NOT RUN** under current approval. Later install must use mic-free candidate in a separately approved disposable copy, not the old composite and not the original game. |

## GL-19R.2 deterministic reference proof

A new pure, **non-production** director oracle with one-way directives was created under `handoff/unreal/hush/director_contract_candidate/`. Its node tests were run locally using Node's built-in `node:test`, with **15 tests passed, 0 failed**, exercising:

- enter/exit/disarm idempotence and idle event suppression;
- two distinct variations of the **same** pause family at exposures 1 and 2;
- camcorder turn at 3, stand/approach at 4, rewind at 5 or major;
- exactly one rewind despite repeated incoming events;
- only counted event resets the 12-second silence clock; multi-period decay;
- no replay of a physical stage after exposure decay and re-cross;
- **DISARM → DEAFEN → REWIND_ONCE** directive order;
- next hide entry starting at exposure 2 only after rewind completion;
- rejection of negative/nonfinite gameplay deltas.

**Test command:** `node --test likeness-site/handoff/unreal/hush/director_contract_candidate/HideDirectorContractOracle.test.mjs` (Node 18+).  
**Observed output:** TAP 15 passing tests / 0 failed.  
**Source hashes (Git blob SHA-1):** oracle `13bacc2cfb96f927bb67db907ef9e1154b82d675`; test `47c4c1bd096178628927b2ea14542974ebc3061b`. GitHub fetch hashes reconciled to the exact tested local bytes.

**Limits:** these tests inject *already-counted* `minor`/`major` events. They do **not** test 8/20 classification or 1.2s cooldown jointly with the director (previous host listener fixture did those separately), input binding, GL-15 real component, actual C++ director, UHT, PIE, lighting/actor performance, microphone privacy in Windows, or the original rewind service.

## Canon and custody

The authority is still the **existing** `MECH_HIDE_001`: seen triggers a rewind and never death. `STATE_05_DOUBLE_OCCUPANCY` and `BEAT_DOUBLE_OCCUPANCY_001` are unchanged. No new mechanic ID, CSV, story bible, public site route, `cpp_rowstructs`, microphone code, Build.cs or installed UE source is touched. Original HUSH PR #27 and source-qualification PR #28 remain separate draft reviews.

## Gate handoff and explicit stops

**GL-19R.2 outcome:** `CONTRACT REFERENCE + PURE-LOGIC TEST PASS`, not gameplay approval. The next meaningful step is a *separate* approved director source candidate and human performance cold read, plus GL-15 hide-spot and G06 resource-safe Editor proofs. The engine cannot be called ready on these tests alone.

**STOP / HUMAN REVIEW:** Keep the three-family stage choreography **provisional** until it passes a performed cold read; do not install, merge, capture mic, mutate production source or spend credits.
