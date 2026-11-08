# Session exchange receipt: MECH_HIDE_001 noise-layer proposal ("HUSH")

- Session ID / local date / sender / receiver: Claude (CLOUD lane) · 2026-11-07 · → Brandon (HUMAN, GL-19)
- Repository / task / allowed paths: `bthoreau88/likeness-universe` · stage the HUSH audio-reactive package as a proposal for `MECH_HIDE_001` · `handoff/mechanics/`, `handoff/unreal/hush/`, `handoff/web/hush/`, `docs/production/GAME_LANE.md` (one row), this receipt
- Canonical source baseline SHA / observed Pages SHA: `c53809b` (origin/claude/dreamy-hawking-VcoBe) / not observed
- Feature branch / implementation head SHA / PR URL: `claude/hush-noise-source-v001` / see PR / draft PR into `claude/dreamy-hawking-VcoBe`
- Merged source SHA / published Pages SHA / Pages run URL: not merged · not published
- Input batches read / further uploads pending: none. Source is the HUSH package Claude authored 2026-10-28 (chat delivery, not an intake batch)
- Decisions superseded (explicitly) / preserved authorities: none superseded. Preserved: GAME_LANE §5 "no microphone input in the first slice"; UNREAL.md "keep microphone off; simulated noise supplies the sound input"; AUDIT_AND_INTAKE "do not alias ROOM_ATTENTION / ROOM_TRUST / ROOM_MEMORY"; `MECH_HIDE_001` "seen = the room rewinds, never death"; STORY_BIBLE "no combat, no bodies, no guards"

## Delivered

| Path / asset or event ID | Change and reason | SHA-256 for binary delivery | Evidence |
|---|---|---|---|
| `handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md` | New. Maps HUSH onto scene 3.3 / `MECH_HIDE_001`; simulated breath-hold input by default, mic opt-in post-G05; local `exposure` (no canon alias); five HUMAN decisions | text | this PR |
| `handoff/unreal/hush/Public/OVSNoiseListenerComponent.h` | New. Staged outside `cpp_rowstructs`; `LIKENESSTHEGAME_API`; `bUseMicrophone = false`; `ReportNoise()` simulated path | 7064b10d…a59 | not compiled |
| `handoff/unreal/hush/OVSNoiseListenerComponent.cpp` | New. Shared tier logic for simulated + mic; `OVSNoise:` log lines for passbacks | 03836241…621 | not compiled |
| `handoff/unreal/hush/INSTALL_NOISE_LISTENER.md` | New. Install blocked on GL-19 + GL-15; Build.cs deps, full-build rule, wire-up, acceptance | text | — |
| `handoff/web/hush/HorrorAudioMonitor.js` | New. Web mic monitor (tuning only, not in the site) | e62b50cf…e4b | node --check |
| `handoff/web/hush/HideNoiseDirector.js` | New. HUSH director with local names `EXPOSURE` / `STRAIN` (renamed from VACANCY-era `ROOM_ATTENTION` / `GRIEF_PRESSURE`) | 4ae119ce…681 | test below |
| `handoff/web/hush/index.html`, `hideNoiseDirector.test.mjs`, `README.md` | New. Tuning rig, state-machine test, usage | 36e9e0e7…a79 (html) | test below |
| `docs/production/GAME_LANE.md` | One row added: GL-19 (HUMAN) | text | diff |

No CSV, registry, room-state enum, row struct, site route, or `cpp_rowstructs` file changed.

## Verification

| Command or editor check | Exact outcome / exit code | Evidence location |
|---|---|---|
| npm ci | ok | session log |
| npm run validate:production | exit 0 · "Registry parity valid: 28 site IDs, row structs and room states match handoff/data." Two pre-existing EXP_ warnings, unrelated | session log |
| npm run test:production | node 14/14 pass · python 17 tests OK | session log |
| node --test handoff/web/hush/hideNoiseDirector.test.mjs | 1/1 pass | session log |
| npm run lint | exit 0 | session log |
| NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build | **not_run (environment)**: sandbox cannot reach fonts.googleapis.com (Geist via next/font). No site source changed in this PR | session log |
| Live / mobile / reduced-motion screenshot checks if UI changed | not_applicable (no site UI changed) | — |
| Blender / Unreal version and proof if applicable | **not compiled**. CLOUD-authored against UE 5.x audio APIs; PC passback required after GL-19 | — |

## Gate status

G01: pending (GL-19 HUMAN decision). G02: not_applicable until adopted (no canon row). G03–G08: not_applicable.

## Boundaries

- Not implemented / not tested: Unreal compile; any real microphone; Level Sequence ladder; breath-hold input binding.
- State migration / feature flags / microphone status: **microphone off**. Unreal default `bUseMicrophone = false`; no audio device opened unless a future settings toggle enables it. No state migration.
- Asset rights and distribution restrictions: original code; no third-party assets.
- Costs incurred / authorized ceiling / remaining: none.
- Conflicts or blockers: the earlier advice to place HUSH in a P.T.-style corridor is superseded by the Room 14 slice recorded in GAME_LANE; Wwise adoption would require moving the mic path to Wwise Audio Input.
- Rollback (new revert PR; preserve intervening work): revert this PR; it only adds files plus one table row.
- Next bounded task / inputs required / acceptance: GL-19 (HUMAN) answers proposal §6. If adopted, a CLOUD task moves the component into `cpp_rowstructs` after GL-15's passback, then a PC task proves the acceptance in INSTALL_NOISE_LISTENER.md.
