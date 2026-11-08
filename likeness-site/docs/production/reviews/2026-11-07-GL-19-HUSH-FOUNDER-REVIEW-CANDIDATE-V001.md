# GL-19R — MECH_HIDE_001 / HUSH founder review candidate V001

**Project:** LIKENESS : THE GAME — Room 14, `A_NIGHT_FOR_FOUR.fountain` scene 3.3  
**Disposition:** HISTORICAL REVIEW CANDIDATE — superseded by [FOUNDER-APPROVED PROVISIONAL DESIGN receipt](../receipts/2026-11-07-GL-19R-HUSH-FOUNDER-PROVISIONAL-APPROVAL-V001.md) · NOT INSTALLED OR CANON-PROMOTED  
**Date:** 2026-11-07  
**Parent source:** [HUSH proposal](../../../handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md) · [GAME_LANE GL-19](../GAME_LANE.md) · draft [PR #27](https://github.com/bthoreau88/likeness-universe/pull/27)  
**Strict impact:** No implementation, game-source write, state/registry/CSV change, canon promotion, microphone use, paid generation, engine launch, or merge.

## Gate selection

GL-19R is the next useful **review** gate because it can decide which parts of the HUSH proposal deserve a Milestone 2 implementation **without** conflating a document review with the currently blocked UE 5.8 resource/load/exit proof (OVS-OS G06, draft PR #328). The independent SECOND HAND Prop Pass V001 remains an unapproved, distinct film prop-authority workflow.

## Founder decisions — five recommendations, NONE presumed approved

| GL-19 item | Advisor recommended disposition | Scope and acceptance restriction |
|---|---|---|
| 1. Adopt a noise layer for `MECH_HIDE_001`? | **YES — CONDITIONAL, PROVISIONAL DESIGN SELECT ONLY** | One scoped addition to the existing mechanic's `qa_notes`, *after* explicit human approval; never a new mechanic ID, room-state alias, or global `ROOM_ATTENTION`. |
| 2. Milestone 2 input | **YES — simulated breath hold** | Hold input, early release = `Exhale` +10 simulated-dB margin (minor), attempted look = `Hanger` +12 (minor), exhaustion = `Gasp` +25 (major). Shallow breathing ignored. No microphone permission, plugin or hardware capture in first slice. |
| 3. Exposure/presentation | **EDIT — three escalating performance beats** | Keep local `exposure` 0–5, 1.2 s refractory, 12 s quiet decay, rewind restores exposure 2; present only (i) THE OTHER interrupts speech, (ii) rotates camcorder screen toward closet, (iii) stands and approaches. Major or exposure 5 triggers existing *seen → rewind, never death* outcome exactly once. No arbitrary new state or unapproved dialogue. |
| 4. Mic after G05 | **FUTURE OPTIONAL R&D ONLY — not permission to implement** | Favor a separate, later opt-in study *if* privacy, accessibility, streaming safety, calibrated-room noise and real device behavior are independently approved. Keep `bUseMicrophone=false`; do **not** enable Audio Capture plugin, add `AudioCapture`/ `AudioMixer` modules, create capture components, request access, or test the mic for this Milestone 2 slice. Prefer a **simulated-only C++ path** that does not require microphone dependencies. |
| 5. DRYA inversion | **HOLD FOR GL-16 / story lane** | Do not write or activate the late voice-response reversal, new dialogue, forced resolution, or `STORY_BIBLE.md` amendment via this gate. Separate screenplay authority controls this. |

### Creative rationale

The hide beat has a precise behavioral cause and effect: the player chooses whether to hold or release, THE OTHER changes observable behavior, and being heard leads to an established rewind. Reducing the presentation to three legible actions is better for a cold readability test than six layers of automated visual effects. Do **not** add slogan copy or anthropomorphize Room 14 in gameplay, marketing, or narration. Existing DRYA lines and screenplay remain draft authority unless GL-16 separately signs them.

## Review findings / risk flags

1. **Broader web director than proposed Milestone 2 rule.** `handoff/web/hush/HideNoiseDirector.js` defines `N1_INTRO`, `N2_HIDE`, `N3_FAIL`, `N4_SURVIVE`, `N5_RESOLVE`. Its test exercises survival after 90 seconds, accumulated failures and forced resolution, tuning variables such as `STRAIN`, and a late sustained-voice inversion. A passing web test verifies this test harness only; it does **not** authorize these larger story/state behaviors for the pilot or prove the intended minimal Unreal hide layer. Do not import the five-node loop into canon under GL-19.
2. **Audio compile coupling.** The staged `OVSNoiseListenerComponent.cpp` includes `AudioCaptureComponent.h` and `Sound/SoundSubmix.h`; the staged install document calls for `AudioMixer` and `AudioCapture` dependencies and enabling the Audio Capture plugin even with `bUseMicrophone=false`. A simulated-only pilot should **not** require microphone-capture components or a plugin switch. Cloud lane should first split/defer the mic source rather than copy this composite class into the first slice.
3. **Unsafe install path relative to G06 custody.** `handoff/unreal/hush/INSTALL_NOISE_LISTENER.md` currently shows a `Build.bat` invocation against the original `C:\OVS\LIKENESS_THE_GAME\LikenessTheGame\LikenessTheGame.uproject`. Do not run that command during G06's source-preservation hold. When separately approved and after device/resource preflight, make a *third disposable test copy* of the verified sandbox, with exact hashes, then build there. Never silently modify source `Build.cs` or `.uproject`.
4. **Physical runtime unverified.** GL-15 requires a hide spot verified in PC logs and screenshot, and G06 still lacks a fresh bounded UE 5.8 MapCheck/load-and-clean-exit pass. This package supplies neither. No class compiled, no PIE, no logged rewind, and no mic-privacy observation is demonstrated by the draft proposal.
5. **No evidence that any supplied file is an authority promotion.** The proposal explicitly says **PROPOSED, NOT CANON**. GL-19 is designated **HUMAN** in `GAME_LANE.md`; advisor recommendations are not an approval receipt.

## Proposed downstream gate sequence (do not auto-advance)

**GL-19R / HUMAN SELECT** → record the founder's *five explicit dispositions* → if approved, CLOUD prepares a simulated-only, scope-constrained patch and reviewed `qa_notes` update for the **existing** `MECH_HIDE_001` row → **G06 device/memory/source custody** + **GL-15 hide-spot PC passback** → isolated disposable-copy compile → one bounded PIE test with logs, slat-view, actor performance checks → human cold read → stop.

Any scope growth (real mic, voice inversion, forced ending, room-state aliases, new scene mechanic, new character identity, paid generation) needs its own distinct human approval.

## Evidence / test plan for a future separate proof

- **Baseline:** enter hide spot, camera/look constraints correct, no noise, exposure 0; existing room rewind rule preserved.
- **Minor:** two `Exhale` events separated by at least 1.2 s count twice, show restrained first two performance escalations; events inside refractory window do not duplicate; `Hanger` is a third simulated trigger only when input attempted.
- **Major:** `Gasp` +25 simulated-dB margin produces exactly one *seen → rewind* (no death); a fresh hide resumes at exposure 2.
- **Reset:** leaving hide spot disarms the listener; post-exit `ReportNoise` changes nothing. A single 12-second silence interval decreases exposure by one, not multiple.
- **Privacy:** microphone stays disabled; no Audio Capture plugin or hardware access required for the simulated-only candidate.
- **Production:** source and existing sandbox hash-verified unchanged; disposable test copy only; evidence includes engine version, compile outcome, log extract, process exit status, map identity, and human playback review.

## Action requested from founder

**Approve / edit / reject this recommended five-part GL-19 design disposition as a provisional design decision only.** Approval of this document would **not** install code, license microphone capture, alter runtime source, change story canon, promote final art, or merge a pull request. If approved, a separate, bounded CLOUD implementation-patch task may be prepared; execution still waits for GL-15 and the safe G06 pass.
