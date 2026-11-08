# GL-19R.2 — HUSH Director Contract Candidate (review only)

**Gate:** Independent Code Review and Hide Director Contract  
**Status:** **PURE REFERENCE VERIFIED · NO UE INSTALLATION · NO CANON PROMOTION**  
**Authority:** Founder approval to advance GL-19R.2 from GL-19R.1; prior five-part GL-19R provisional design remains the governing scope.

This directory contains a **deterministic reference oracle** for `MECH_HIDE_001`. It is not an Unreal C++ `UCLASS`, does not run in the Next.js site, and should **never** be confused with the older, broader `handoff/web/hush/HideNoiseDirector.js` five-node prototype.

| Artifact | Role |
|---|---|
| `GL-19R2_HIDE_DIRECTOR_CONTRACT_V001.md` | Actor lifecycle, event bridge, local exposure, three performance families, quiet decay and exactly-once rewind specification |
| `HideDirectorContractOracle.mjs` | Pure reference state machine, no DOM/audio/network/device access |
| `HideDirectorContractOracle.test.mjs` | 15 deterministic Node tests for event order, state, stage continuity and silence timing |

Run from repo root (Node 18+):

```sh
node --test likeness-site/handoff/unreal/hush/director_contract_candidate/HideDirectorContractOracle.test.mjs
```

**Observed in independent local source test:** 15/15 PASS, zero failures, with exact tested local Git blob SHA-1 reconciled against branch:
- Oracle: `13bacc2cfb96f927bb67db907ef9e1154b82d675`
- Test: `47c4c1bd096178628927b2ea14542974ebc3061b`

**Unverified:** real listener-to-director bridge, 1.2-second refractory integrated with director, UHT/UE build, GL-15 hide actor, G06 resource-safe MapCheck and clean exit, real actor performance and rewind. The prior listener source is unchanged by this gate; no new C++ director is installed.

**Governance:** no Audio Capture, microphone permission, global room-state alias, `STORY_BIBLE.md`, `mechanics_registry.csv`, `cpp_rowstructs`, paid generation or game-source mutation. Any later Unreal work uses a *third disposable test copy*, not the original game. Review [cold-read findings](../../../../docs/production/reviews/2026-11-08-GL-19R2-HUSH-INDEPENDENT-CODE-COLD-REVIEW-V001.md) before further adoption.

**Next review:** human/independent performance cold read of the PAUSE start/extend → CAMCORDER → APPROACH behavior, followed by a separately gated implementation candidate; GL-15 and G06 must pass before real UE work.
