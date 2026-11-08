# GL-19R — HUSH provisional founder design approval V001

**Project:** LIKENESS : THE GAME  
**Date:** 2026-11-07  
**Gate:** GL-19R (five-part HUMAN design disposition)  
**Source:** [GL-19R review candidate](../reviews/2026-11-07-GL-19-HUSH-FOUNDER-REVIEW-CANDIDATE-V001.md) · [HUSH proposal](../../../handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md) · [GAME_LANE GL-19](../GAME_LANE.md)  
**Evidence of human decision:** Founder responded "**Yes approve**" directly to the complete GL-19R V001 five-part provisional design proposal in the conversation.  
**Recorded disposition:** **FOUNDER APPROVED — PROVISIONAL DESIGN DIRECTION ONLY**. Not canon/production implementation approval.

## Five approved design dispositions

| # | Decision | Approved provisional scope |
|---|---|---|
| 1 | Noise layer | **Adopt as a provisional extension** of existing `MECH_HIDE_001`, specifically the Room 14 hide scene. **No new mechanic ID**, registry row or room-state alias. A future scoped `qa_notes` change remains gated by an independent reviewed CLOUD patch. |
| 2 | Input | **Simulated breath hold** in Milestone 2. Early release = `Exhale` (10 dB simulated margin, minor); attempted look = `Hanger` (12 dB simulated margin, minor); exhaustion = `Gasp` (25 dB simulated margin, major). Otherwise ignore non-events. **No mic hardware**. |
| 3 | Presentation | **Three restrained behavioral escalations**: THE OTHER pauses; turns the camcorder screen toward the closet; then stands/approaches. Preserve local exposure (0–5), 1.2-second refractory, 12-second quiet decay, exposure 2 after rewind. Existing **seen → rewind, never death** and replay-safe once-only behavior remain authority. Screenplay/character animation details are still separate review. |
| 4 | Microphone | **Defer to future optional research only**. This approval is **not** permission to enable Audio Capture, add audio module dependencies, compile the mic source, open permissions, access a device, stream or store audio. First slice `bUseMicrophone=false` and simulated-only implementation. Later exploration would require explicit separate human permission and privacy/accessibility gates. |
| 5 | DRYA inversion | **HOLD** pending GL-16 screenplay/story-lane review. No spoken-response reversal, new dialogue, five-node forced resolution or public storytelling promotion under this approval. |

## Mandatory implementation boundaries

- **Approved:** Stage a **CLOUD-only simulated-source separation/preparation patch** from the current HUSH staged source, on a review branch, for later independent verification. Tests are permitted for the isolated simulated-state logic; this approval is not a go-ahead to install/build against the original game.
- **Not approved:** Merge draft PR #27; edit `mechanics_registry.csv`/site registry/room-state enums; modify live UE source or current preserved sandbox; add `AudioCapture` and `AudioMixer` dependencies or enable Audio Capture plugin; call a microphone; modify `STORY_BIBLE.md`; claim GL-15 or G06 runtime pass; paid AI generation.
- **Retain prior engine gates:** GL-15 hide spot **must** be verified on the MSI; separate OVS-OS **G06** resource-safe disposable sandbox MapCheck and clean exit must pass before further Unreal execution. Use a **third disposable copy** for any later compile/run, not the original `C:\OVS\LIKENESS_THE_GAME\LikenessTheGame\LikenessTheGame.uproject`.
- **No scope creep:** The larger five-node web director (N1–N5, 90 s survival, fail convergence, sustained voice) is not adopted in this provisional design; treat it as historical experimental tooling only unless separately approved.
- **Quality proof needed later:** Simple observable behavior, input fairness, 1.2 s refractory, 12 s decay, exactly-once rewind, safe disarm on exit, silent and disabled microphone, actor reactions legible without captions, source/hash preservation.

## Next gate — GL-19R.1 (CLOUD simulated-only preparation)

**Authorized:** prepare, audit, and test a review-only source package with `ReportNoise`, local exposure logic in a separate director/adapter, clear log lines and no microphone dependencies. Do not move this package into the compile-checked `cpp_rowstructs` module before GL-15 passes and an additional explicit implementation review. See [GL-19R.1 preparation contract](../../../handoff/unreal/hush/GL-19R1_SIMULATED_ONLY_PREPARATION_V001.md).

**Gate hold:** No Unreal installation, no update of approved canon/state rows, no CLI/Live Coding/PIE build, no mic, no spend. After source-only preparation, stop for bounded human review and source-integrity revalidation.

**Status:** DESIGN PROVISIONAL APPROVED / INSTALLATION AND PRODUCTION LOCK NOT AUTHORIZED.
