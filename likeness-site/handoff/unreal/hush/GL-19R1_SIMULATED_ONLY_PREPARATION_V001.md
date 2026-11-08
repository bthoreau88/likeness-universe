# GL-19R.1 — Simulated-only HUSH source preparation V001

**Project:** LIKENESS : THE GAME · Room 14 · Milestone 2  
**Status:** CLOUD PREPARATION GATE — authorized by [GL-19R founder provisional approval](../../../docs/production/receipts/2026-11-07-GL-19R-HUSH-FOUNDER-PROVISIONAL-APPROVAL-V001.md) · NO INSTALLATION  
**Parent mechanism:** `MECH_HIDE_001` · `STATE_05_DOUBLE_OCCUPANCY` · `BEAT_DOUBLE_OCCUPANCY_001`  
**Scope:** separate a minimal, simulated-only noise event listener from experimental mic + web-story layers; prove deterministic rule behavior before any UE editor use.

## 0. Authority, exclusions and location

- Preserve `mechanics_registry.csv`, `src/lib/registry.ts`, all room-state enums, original game source, original and current UE5.8 sandbox untouched.
- No new state ID, mechanic, `ROOM_ATTENTION` / `ROOM_TRUST` / `ROOM_MEMORY` alias, `STORY_BIBLE` change, DRYA inversion, five-node forced resolution, 90-second survival loop, real microphone, paid generation, or source merge.
- All implementation candidates must be authored **only in review-only `handoff/unreal/hush/simulated_only_candidate/`**, not in `cpp_rowstructs` or `C:\OVS\LIKENESS_THE_GAME`. Original composite mic-capable HUSH candidate remains historical reference; do not silently install it.
- Cloud may **prepare** files, compare against the earlier staged composite source and run static or pure-logic tests; only a separately authorized PC gate after successful GL-15 and G06 can compile/run in a third disposable sandbox copy.

## 1. Component separation contract

Prepare one candidate `UOVSNoiseListenerComponent` that:
1. Is an `UActorComponent`, Blueprint spawnable, and uses `LIKENESSTHEGAME_API` for the existing game's module. Files must have Unreal-compatible generated-header ordering and unique module placement upon a later installation.
2. Has **no** `UAudioCaptureComponent`, `USoundSubmix`, `AudioMixer`, `AudioCapture` plugin dependency, permission request, microphone initialization, device selection, waveform storage, network handling or voice stream. `bUseMicrophone` is not necessary in the simulated candidate.
3. Receives source events solely from game input via `ReportNoise(float MarginDb, FName Reason)`, classifies into ignored / minor / major using a **simulated rule margin**. Do not represent these values as measured physical sound pressure or assume dBFS equivalence; the numbers are tuning thresholds.
4. Exposes `Arm()`, `Disarm()`, `Deafen(float Seconds)`, `IsArmed()`, `OnThresholdBreached`, and only the metadata required by the hide-beat director. The listener **must not** own exposure, actor performance, rewind, scene selection, or room-state transitions.
5. Applies **8** threshold to minor, **20** threshold to major and **1.2 s** refractory after a counted event. If the listener is not armed, deafened, or within its refractory interval, it produces no breach.
6. Uses the same local clock for refractory/deafening, resets transient counts on rearm and disarm, guards against reentrant duplicate broadcasts, and logs event values + reasons without capturing audio.
7. Keeps the composite staged source's mic implementation isolated and **not compiled** in Milestone 2. If one class name is kept, only the selected simulated version may ever be placed in the compiled module; do not copy both classes.

## 2. Hide director contract (separate from listener)

- `OnHideChanged(Pawn, true)` → arm; `OnHideChanged(Pawn, false)` or rewind → disarm (requires GL-15 verified event contract).
- Input: hold to suppress breathing; release early → `ReportNoise(10.0f, "Exhale")`; attempted look while hidden → `ReportNoise(12.0f, "Hanger")`; time-out → `ReportNoise(25.0f, "Gasp")`. All use simulated events. Check actor/input accessibility separately.
- Session-local `Exposure` 0–5 is director-owned. Each counted **minor** increments exposure by one; a counted **major** or arrival at **5** triggers the pre-existing seen → rewind (never death) **exactly once**.
- Silence: only after 12 seconds without a counted breach, decrement exposure by 1 (to minimum 0) and restart that silence interval. No global `ROOM_ATTENTION` mutation.
- Rewind resets exposure to **2**, per approved design; disarms listener, suppresses any trailing stinger through `Deafen`, and requires a clear rearm path.
- Three performance steps only, independent of implementation of clip/VFX: **first pause**, **camcorder screen turns toward the closet**, **THE OTHER stands/approaches**. Suggested trigger mapping for human test: exposure 1–2, 3, 4; exposure 5 is the existing rewind. No six-step lamp flicker or newly generated shots without a specific shot review.
- Preserve existing story and character authority. Do not add new DRYA dialogue or bring in the five-node web director's `N5_RESOLVE` / `handleSustain` arc.

## 3. Isolated contract verification matrix

| Case | Input | Expected outcome |
|---|---|---|
| IDLE | `ReportNoise(25, Gasp)` when disarmed | no log/event/rewind |
| IGNORE | armed; margin 7.99 | no counted event |
| MINOR-BOUNDARY | armed; margin 8.0 | exactly one minor |
| DEBOUNCE | another event within 1.2 s | no additional counted event |
| MAJOR-BOUNDARY | armed; margin 20.0 | exactly one major |
| EARLY-RELEASE | twice, separated by >1.2 s | exposure 2; first two reactions legible |
| HANGER | attempted look while hidden | minor 12; no player camera rotation |
| GASP | strain max | major 25; closet opens and rewind once |
| QUIET | 12 continuous seconds after last counted event | exposure -1 to floor 0 |
| RETRY | rewind then reenter | exposure resumes at 2; no stale second rewind |
| EXIT | `Disarm()` followed by noise | no event |
| DEAFEN | noise during tail-deafening interval | no event |
| PRIVACY | fresh slice | microphone permission never requested; no capture plugin required |
| CUSTODY | before/after test | original source, existing sandbox, registry/room-state IDs unchanged |

## 4. Required CLOUD passback for GL-19R.1

1. Candidate header/source outside compiled module with dependency list proving **no mic library**.
2. Readable change plan against the former composite `UOVSNoiseListenerComponent`.
3. Pure-rule fixture/test output and known gaps; an Unreal compilation is **not** implied by browser or Node tests.
4. Follow-up notes for GL-15 hide-spot integration only; no actual actor wiring.
5. Explicit human check: approve/revise/reject candidate source before any move to `cpp_rowstructs`.
6. G06 (OVS-OS PR #328) remains an independent safe runtime load/exit gate. Never use the earlier original-project `Build.bat -project=C:\OVS\LIKENESS_THE_GAME\...` path as a workaround.

## 5. Stop conditions

Stop on source/role ambiguity, compilation API uncertainty, broken approval chain, or a requested microphone/DRYA inversion transition. An untested Windows build may be labeled **source candidate**, never **working plugin** or **Unreal ready**.

**Gate disposition:** DESIGN APPROVED PROVISIONALLY · SIMULATED-ONLY SOURCE PREPARATION AUTHORIZED · HUMAN SOURCE VALIDATION HOLD · ZERO PAID SPEND.
