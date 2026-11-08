# GL-19R.1 — HUSH simulated-only candidate source (NOT INSTALLED)

**Owner:** LIKENESS : THE GAME / MECH_HIDE_001 / Milestone 2  
**Design:** Founder-provisionally approved 2026-11-07 under [GL-19R receipt](../../../../docs/production/receipts/2026-11-07-GL-19R-HUSH-FOUNDER-PROVISIONAL-APPROVAL-V001.md).  
**Candidate status:** REVIEW-ONLY · **NOT UE 5.8 COMPILED** · NOT IN PROJECT SOURCE · NOT CANON · ZERO MIC · ZERO SPEND  
**Contract:** [GL-19R.1 source-prep standard](../GL-19R1_SIMULATED_ONLY_PREPARATION_V001.md).

## Contents

- `Public/OVSNoiseListenerComponent.h`: Blueprint-spawnable `UActorComponent`; `Arm`, `Disarm`, `Deafen`, `ReportNoise`, threshold delegate.
- `OVSNoiseListenerComponent.cpp`: simulated events only, ignore/minor/major classification and 1.2 s refractory; no input capture, AudioMixer, AudioCapture, or audio-device interaction.
- This README: source manifest and explicit release blockers.

## Design limits

The listener class deliberately **does not own** hide exposure (0–5), 12-second quiet decay, the 3-step performance ladder, slat-view, input bindings, rewind, player state, or any global room-state variable. The future approved **hide director/adapter** must own those. Do not claim the C++ candidate itself implements the whole design.

The prior composite HUSH source one directory up remains staged for review and has the **same class name**. Both variants must **never** be installed in a single compile module. The simulated-only candidate replaces, rather than supplements, the composite class if later selected. No migration or compile is approved by this note.

## Static checks completed on branch

Source text was fetched back through GitHub and checked for:
- no Audio Capture / Sound Submix include or component class;
- no `bUseMicrophone` state or hardware permission/capture;
- Blueprint component declaration and 4-param delegated event shape;
- `Arm`, `Disarm`, `Deafen`, `ReportNoise` and guarded event emission;
- idempotent same-session arm against refractory bypass;
- default 8.0 minor / 20.0 major / 1.2-second refractory;
- provisional founder receipt and independent G06 prerequisite.

**13/13 static string/API-shape checks passed** in a code-review pass on 2026-11-07. These are *not* C++ compilation, Unreal Header Tool reflection, runtime proof or gameplay acceptance. No editor, remote MSI tool, or microphone was used.

## Human source review checklist

- Confirm the event delegate matches expected Blueprint consumers before installation.
- Check class/build compatibility with installed UE5.8 and source module; correct any verified compile errors in a separate review branch, not in production.
- Require GL-15 PC passback: hide actor, `OnHideChanged`, slat-view, no breakage of inspect action.
- Require G06 source hashes and 6 GiB project-specific memory preflight, isolated **third disposable copy**, clean Unreal load/exit. Do not build against the original `.uproject` from the older HUSH install doc.
- In a later PIE test, exercise <8, =8, 10/12 minor, =20 and 25 major, refractory, death-free rewind exactly once, rearm, disarm, silence decay, no mic, and audible/visual feedback fairness.
- Founder can approve/revise/reject this **code candidate** separately. GL-19R's earlier **design** approval does not certify code.

**NEXT: GL-19R.1 source cold review → (GL-15 + G06 holds) → disposable compile proof, only if separately authorized.**
