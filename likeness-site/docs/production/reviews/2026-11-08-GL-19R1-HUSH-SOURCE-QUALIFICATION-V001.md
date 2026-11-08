# GL-19R.1 — HUSH Simulated Listener Source Qualification V001

**Project:** LIKENESS : THE GAME / `MECH_HIDE_001` · Room 14 / Milestone 2  
**Date:** 2026-11-08  
**Classification:** CONDITIONAL SOURCE-CANDIDATE PASS (host-only) · UE5.8 BUILD AND GAMEPLAY UNVERIFIED  
**Review basis:** founder provisionally approved [GL-19R V001](../receipts/2026-11-07-GL-19R-HUSH-FOUNDER-PROVISIONAL-APPROVAL-V001.md); existing [GL-19R.1 contract](../../../handoff/unreal/hush/GL-19R1_SIMULATED_ONLY_PREPARATION_V001.md); staged candidate C++; UE5.8 class-metadata specification.  
**Review boundary:** exact HUSH candidate source, no installed game or current sandbox access, no claims about the main app or other branches.

## Gate outcome

**QUALIFIED FOR NEXT INDEPENDENT SOURCE REVIEW ONLY.**

- Candidate `UOVSNoiseListenerComponent` has simulated event classification, arming/disarming, deafen and refractory functions.
- No microphone capture class, `AudioMixer`, `AudioCapture`, sound-submix dependency, hardware access, or input-device request is present in this simulated-only source.
- One reflection declaration defect was detected and **corrected on a separate review branch**: the top-level `UCLASS` `DisplayName=` specifier is now class metadata inside `meta=(...)`, consistent with Epic's UE 5.8 documentation. This metadata is **not validated by actual UHT**.
- The candidate's code was compiled using a **host-only UE interface shim** and C++17 GNU g++ 14.2 with strict warnings-as-errors. **20/20 behavior assertions passed**, compiled from byte-identical C++ sources verified by Git blob SHA-1. The shim test is reproducible at `handoff/unreal/hush/simulated_only_candidate/qualification/`.
- Both header and CPP remained outside the compile-checked `cpp_rowstructs` module; nothing installed to the original `C:\OVS\LIKENESS_THE_GAME`, existing UE 5.8 sandbox, game content or plugins.

## Exact source audit

| ID | Area | Finding | Disposition |
|---|---|---|---|
| SR-01 | Unreal metadata | `UCLASS(... DisplayName=...)` incorrectly places `DisplayName` at class-specifier level, not class metadata. | **FIXED in review candidate** by `meta=(BlueprintSpawnableComponent, DisplayName="OVS Noise Listener (Simulated)")`; UHT test still required |
| SR-02 | Hardware privacy | Candidate header and CPP reference no `UAudioCaptureComponent`, `USoundSubmix`, `AudioCapture` plugin or microphone state. | **PASS static**; hardware privacy in PIE not yet observed |
| SR-03 | Boundary conditions | Minor `>=8`, major `>=20`, sub-8 ignored; NaN/Infinity rejected; threshold ordering clamps. | **PASS host shim** |
| SR-04 | Event safety | Only armed events count; 1.2-second refractory; idempotent arm; reentrant callback guarded; disarmed events ignored. | **PASS host shim** |
| SR-05 | Tail/rewind protection | `Deafen` suppresses events until expiry; survives disarm/rearm. | **PASS host shim**; game rewind not implemented by listener |
| SR-06 | Framework coupling | Uses `GetWorld()->GetTimeSeconds` (game-time clock) and `OnThresholdBreached.Broadcast`. | **CONDITIONAL**: actual UE tick/pause/Level Sequence behavior requires engine/PIE test |
| SR-07 | Missing gameplay director | Listener does not implement exposure 0–5, 12 s silence decay, three performer beats, once-only room rewind, actor input bindings, slat-view or re-arm timing. | **OUT OF LISTENER SCOPE**, but mandatory downstream integration proof; do not call whole HUSH mechanic complete |
| SR-08 | Duplicate class risk | Old composite mic-aware candidate also uses `UOVSNoiseListenerComponent`. | **BLOCK** copying both into one Unreal module; later adoption must be exclusive |
| SR-09 | Legacy install document | `INSTALL_NOISE_LISTENER.md` still targets original project `Build.bat` invocation. | **BLOCK** original-project build; later disposable-third-copy invocation requires review |
| SR-10 | Approval/governance | GL-19R design approved provisionally, GL-15 hide-spot PC passback unresolved, G06 clean startup/load/MapCheck/exit unresolved. | **BLOCK** real Unreal installation or production promotion |

## Behavior evidence

Command executed **locally on the review machine**, not MSI or Unreal:

```sh
g++ -std=c++17 -Wall -Wextra -Werror -pedantic \
  -Iqualification/stubs -IPublic \
  OVSNoiseListenerComponent.cpp qualification/host_shim_test.cpp \
  -o /tmp/hush_host_shim_test
/tmp/hush_host_shim_test
```

Observed output:

```text
HOST_SHIM_PASS checks=20; NOT_UE_COMPILATION
```

Source identity (Git object SHA-1):
- Header before review: `d4d8239fd9453098c640309ec24d75f716079d9e`.
- Header corrected: `df5c70f12d03c127730da932993e077db68f5ed3`.
- CPP unmodified: `0e68687824f58f4092991cb4b50c3109edc9fe95`.

The host shim **does not execute Unreal Header Tool, run the actual UE5.8 build, create a real Blueprint, call the microphone, change gameplay state, run PIE or verify Room 14**. These omissions are material.

## Required next gate: GL-19R.2 — Independent Cold Review and Director Contract

1. Independent reviewer checks corrected header macro/UHT shape and source files, compares with legacy composite, and confirms no mic dependencies or conflicting `UCLASS` installation path.
2. CLOUD lane proposes a **separate hide director/adapter contract** (exposure 0–5, 12-second decay, three performance beats, once-only rewind, re-entry rules). No change to approved character or story/dialogue.
3. GL-15 PC hide-spot logs, slat view and inspect parity must pass; G06 resource-safe third-copy load and clean exit must pass **before UE C++ build**.
4. Later disposable sandbox UHT + `Build.bat` + PIE and measured logs; real mic remains excluded.
5. Any app/source promotion, registry `qa_notes` update, merge or production deployment requires its own explicit authority.

**No installation, deployment, engine build, paid credits, microphone permission or canon promotion authorized by this qualification.**
