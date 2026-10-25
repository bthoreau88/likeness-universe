# Intake 006: inspiration, the Hitman translation, and the asset archive

Date: 2026-10-25. Inputs: upload batch 006 (`data/production/intake-batch-006.json`),
two Drive archives (`data/production/external-assets-inventory-001.json`), two YouTube
links, one GitHub link and a pasted Hitman-style design brief.

Nothing here adds a canon ID, a Blueprint or a story beat. **Adopt** means a method or
vocabulary that the existing layers take on now. **Candidate** means an idea that waits
for a HUMAN decision before it enters `handoff/data/*.csv`. The parity check
(`npm run validate:production`) still enforces canon everywhere, so a candidate can't
slip into the site or the C++ code unnoticed.

---

## 1 · Disposition per input

| Input | What it actually is | Disposition |
|---|---|---|
| **G03A dossier** (`LKN_GAME_UNIFY_G03A_…_V001.pdf`) | OVS OS "Rapid Scene Assembly + Asset Leverage Contract": asset classes, role-based resolver, prefab registry, IK retarget, contact fixtures, PCG limits, interaction envelope, provenance receipts | **Most useful input. Adopt the vocabulary (§3).** The dossier was written against the OVS-OS repo, so its repo paths, the Beni character, SECOND HAND and Photograph 12 are **not** imported into this repo |
| **Character Prompt System V001** (PDF) | Copy-paste identity locks, visual DNA, lighting/camera law, shot families and an anti-drift block for THOREAU and DRYA | **Adopt as the 2D prompt reference** next to `handoff/expansions/character_refs/*_4STEP.md`. Three conflicts with canon are listed in §5 |
| **Interactive Story Toolkit v1.0** (ZIP, 7 small files) | "Glass Room" template: a 1-page PDF outline, placeholder flowchart and storyboard PNGs, Ink dialogue sample, branching JSON sample, Nano Banana and Kling prompt blocks | **Reference only.** The flowchart is a different, smaller file than batch 004's Glass Room map. The Ink sample's line "The room is listening" is on-tone and feeds the candidate in §4. The Unity + Ink pipeline doesn't apply (the game is UE 5.8) |
| **These Handz game bible** (HTML) | Separate OVS project: a Godot mobile fighter with 18 fighters | **Separate OVS project.** Not LIKENESS; nothing imported |
| **"Creating a short video game…"** (DOCX) | Generic Unreal pipeline guide | **Reference only.** Already covered by `UNREAL.md` and `GAME_LANE.md` |
| **Mouthwashing-inspired PDF** | Byte-identical to batch 004 | Existing disposition stands (design history, not the chamber-game spec) |
| **LIKENESS THE GAME ASSETS.zip** (Drive, 571 MB) | 178 content files: 146 PNG, 5 JPG, 19 HEIC, 1 DNG, 7 videos. **No 3D or engine files.** The copy already on the workstation matches Drive's byte size exactly; its SHA-256 is now recorded | **Concept/reference board (§6).** Never a 3D build source (OVS rule: no 3D characters from loose AI art) |
| **OVS INTERACTIVE MULTIVERSE GAMES (STORY TIE-INS).zip** (Drive, 240 MB) | Unknown: not on the workstation and not downloaded | **Pending.** Download it to the workstation and run `scripts/production/zip_inventory.py` on it (read-only) |
| **morluto/rea** (GitHub) | "REA: Reverse Engineer Anything", an MIT-licensed MCP server for reverse-engineering binaries | **Not adopted.** It isn't a game or asset tool, and pointing it at a commercial game's binaries (Hitman included) would raise EULA and IP problems. Hitman stays **design inspiration only** |
| **Two YouTube links** | Titles unknown: YouTube is unreachable from the cloud session | **Pending.** Brandon: one line per video on what to take from it |
| **Pasted Hitman design brief** | Sandbox levels, disguises, cause-and-effect kills, AI alert states, contracts | **Translated in §2.** Combat, killing and online modes are rejected under the no-combat and no-gore-escalation rules |

---

## 2 · Hitman → LIKENESS translation

LIKENESS is a single-chamber psychological horror game: the room is the antagonist and
the player never fights. What Hitman does well that fits is **density** (one space with
many small, legible systems) and **systemic consequence** (actions change the world
rather than triggering a cutscene). The violence does not fit.

| Hitman pillar | LIKENESS translation | Maps to existing canon | Status |
|---|---|---|---|
| **Sandbox density**: one level, many routes, every object has a use | Room 14 is a dense sandbox. Every HERO object has at least two states and can be approached more than one way; layout variants, not new rooms, provide the replay | `LOC_DELLWOOD_ROOM14_001`, `MECH_INSPECT_001`, impossible-room variants on the make list | **Adopt** as a level-design rule for GL-07 |
| **Cause-and-effect chains** ("opportunities": a small action sets up a later outcome) | **Evidence chains**: inspect → room-state change → a new contradiction becomes visible. Replace each kill with a revelation | `MECH_ROOM_STATE_001`, `BEAT_TAPE_CONTRADICTION_001`, the GL-03 inspect→state hook | **Adopt.** GL-03/GL-09 already build the first link; later chains are authored as data rows |
| **Disguise system** (wear someone's identity to gain access) | **Inverted: the double wears yours.** DARK THOREAU is THOREAU with wrong timing, posture and gaze. The horror is that the room may accept him as you | `CHR_DARK_THOREAU_001`, `MECH_MIRROR_LAG_001` | **Adopt as theme only.** The player gets no disguise mechanic |
| **AI awareness tiers** (unaware → suspicious → searching → compromised) | **Room attention tiers** change presentation (light temperature, room tone, mirror lag, door behavior) instead of sending guards. There is no fail state and no death on detection | The unresolved `ROOM_MEMORY` / `ROOM_TRUST` / `ROOM_ATTENTION` question noted in [INTAKE_BATCHES_003_004.md](INTAKE_BATCHES_003_004.md) | **Candidate** (§4). Needs the state-contract decision first |
| **Instinct / x-ray vision** | **Listening, not seeing.** At most a "hold still and listen" input that raises room tone; no highlight outlines through walls | `AUDIO_ROOM14_PLAN_001` | **Candidate**, after the slice |
| **Hiding spots** (closets, crates) | A closet or bathroom-door hold the double walks past | None yet | **Candidate**, after the slice |
| **Mission ratings / replay mastery** | A **witness recap** that records what you saw and what you missed (not a score); a replay keeps the knowledge you gained | GL-11 recap step; the Glass Room loop requirements in [GLASS_ROOM_REFERENCE.md](GLASS_ROOM_REFERENCE.md) | **Adopt** the recap; the loop stays a candidate |
| **Multi-zone map** (several entry points) | The Dellwood hallway and front office as later zones around Room 14 | `LOC_DELLWOOD_HALLWAY_001`, `LOC_DELLWOOD_OFFICE_001` (already in `level_registry.csv`) | **Later.** Room 14 ships first |
| Kills, accidents, weapons, body hiding, guards, crowds, contracts, escalations, elusive targets, online leaderboards | — | — | **Rejected** (no combat; no gore escalation; single-player slice) |

**One-line test for any future "Hitman idea":** does it make the *room* more legible and
more wrong, or does it give the *player* a way to hurt something? The first kind fits;
the second doesn't.

---

## 3 · G03A, adopted into the existing layers

G03A's core law is **"reuse aggressively below canon; preserve authority above reuse."**
It's the same economics as [ASSET_FAST_LANES.md](ASSET_FAST_LANES.md), stated more
precisely. Its parts map onto what this repo already has:

| G03A system | Where it lands here | What changes now |
|---|---|---|
| **Asset classes** A / PROXY, B / SUPPORT, C / HERO | ASSET_FAST_LANES make list = C; kit table = A/B | Use these three words in asset passbacks. HERO items get no silent substitution, no PCG or random variant, and no marketplace replacement |
| **Resolver outcomes** (`VERIFIED_*`, `BLOCKED_LICENSE`, `BLOCKED_PROVENANCE`, `BLOCKED_DEPENDENCY`, `BLOCKED_CANON`, `NOT_FOUND`) | `asset-plan.json` status + rights fields | Missing or unclear provenance is `BLOCKED_PROVENANCE` by default, which matches ASSET_SOURCING. `NOT_FOUND` never authorizes inventing an asset |
| **Prefab registry** | GL-07 dressing | Assemble Room 14 clusters (bed, desk, bathroom, door) as **Level Instances**, and dense static architecture as **Packed Level Actors**. Never bury an evidence prop inside a packed actor: it must stay individually addressable |
| **Player-interaction envelope** (HERO / SUPPORT / BACKGROUND / UNREACHABLE zones) | GL-07 and GL-08 | Spend polish on the mirror, nightstand, desk/TV and door, where the player can inspect or act. Walls and ceiling get silhouette and lighting mass only |
| **Performance classes** P0–P4 | GL-11 packaged-build receipt | Tag each placed asset with a class; numbers come from profiling the real build, not from the dossier |
| **IK retarget harness + contact fixtures** (door open, pickup, sit, mirror) | After GL-11 | Candidate GL task. Motion Warping is Beta in Unreal, so every fixture needs a non-warped fallback |
| **Deterministic PCG** | Barely needed for one room | **Deferred.** If it's ever used: fixed seed, baked, and never on evidence or canonical furniture |
| **Failure arbitration** (fix the narrowest failing layer first) | GAME_LANE traps | When a hand misses the doorknob, check the contact fix, then the retarget. Don't change the room, the door asset or the character |
| **Authority stack** (Unreal presents and never owns narrative truth) | Already the rule: logic lives in C++ components driven by DataTables; no story text in Blueprints | No change |

**Not imported:** G03A's `projects/likeness/game/` tree and the G01–G03 reducer artifacts
both belong to the OVS-OS repository, and the dossier itself records them as absent.
"G03A" is the dossier's own gate name (`LKN-GAME-UNIFY-G03A`), which is separate from
this repo's G00–G08 production gates.

---

## 4 · Candidates waiting for a HUMAN decision

These are not canon IDs. If approved, each becomes a row in `mechanics_registry.csv` (and
the parity check then requires it on the site and in C++).

1. **Room attention** (from the Hitman alert tiers and the Ink line "The room is
   listening"). Three or four tiers that change light, audio, mirror lag and door
   behavior, with no fail state. It needs the `ROOM_ATTENTION` vs `ROOM_TRUST` vs
   `ROOM_MEMORY` decision first.
2. **Listen input**: hold still to raise room tone and hear the double's position.
3. **Hiding hold**: one closet or bathroom-door moment where the double passes.
4. **Contact fixtures**: door, pickup, sit and mirror (G03A §9), after GL-11.

---

## 5 · Character Prompt System: conflicts to resolve

| # | Conflict | Canon today | Default until Brandon decides |
|---|---|---|---|
| 1 | The **corruption form** gives THOREAU black vein markings and a forehead eye. Images of it also appear in the asset archive | `character_registry.csv`: DARK THOREAU is the "same identity … with wrong timing/posture/gaze only", with "no gore-first design" | Kept out of the slice. If wanted, it's a separate later state and needs a canon row |
| 2 | **DRYA's body description** ("bustier… do not desexualize") | `DRYA_4STEP.md` dignity lock: "never decorative suffering, never a glamour model" | The dignity lock wins. Use the prompt pack's face, hair and jewelry lines; drop the body-emphasis lines |
| 3 | The **"enemy / corruption sheet"** template implies enemies | No-combat pillar | Use it only for the double, as a presence. No enemy roster |

Minor: the prompts target "UE 5.4 / 5.5" while the game runs on 5.8. Update the string
the next time the pack is revised. The identity details (gold-framed glasses, mustache
and goatee, nose ring) agree with `00_OVS_Production_Workflow.md` and `THOREAU_4STEP.md`.

---

## 6 · The asset archive: what's worth pulling

The SHA-256 and the counts are in `external-assets-inventory-001.json`. A contact sheet
of 38 of the 151 PNG/JPG stills shows:

| Category | Use | Route |
|---|---|---|
| Isometric Room 14 / office / hallway cutaways | **High value.** Layout and dressing intent for GL-07 and the impossible-room variants | REFERENCE: pick 2–3 as the GL-07 layout brief |
| Gameplay-style stills (bathroom mirror, CRT, hallway, desk) | Lighting and composition targets: warm tungsten against teal intrusion | REFERENCE for GL-08 |
| Evidence still: cassette, key with "14" fob, papers | Look-dev for `PROP_TAPE_001` and `PROP_KEY14_001` decals | REFERENCE for the make-list decal work |
| DRYA face consistency sheet | Input to GL-10 Step 2 review, **not** a mesh source | HUMAN review |
| Male face consistency sheet | Identity unconfirmed (no glasses) | **HUMAN:** whose sheet is this? |
| UI mockups (tape scrubber, public-cut panel, character select) | Companion-site and in-game UI reference | REFERENCE; UI type stays licensed per ASSET_FAST_LANES |
| Logotype variants | Brand reference | REFERENCE; the logo stays a HUMAN call |
| Corruption-form THOREAU | See §5 #1 | Out of the slice |
| Biomech / cyborg DRYA stills | Off-tone (same quarantine as the retired biomech art) | RETIRE from LIKENESS |
| Third-party game screenshot, gas-mask still | Not ours | Private reference only; never ship |
| Phone photos (HEIC/DNG), screen recordings | Unknown until viewed; may include real people or places | **HUMAN:** check consent before any use |
| Two generated videos | Motion and mood reference | REFERENCE |

All generated images keep `rights_verified: false`; each provider's terms decide output
rights. Nothing from the archive goes into the repo or into Unreal production folders.

---

## 7 · Next bounded tasks

- **PC (read-only):** download the multiverse archive to the workstation and run
  `python -I zip_inventory.py <zip> <new-output.json>`. Pass back its SHA-256 and counts.
- **HUMAN:** answer §5 #1–#3, identify the male face sheet, give one line per YouTube
  video, and pick the GL-07 layout reference images.
- **CLOUD:** after the decisions, add any approved candidate from §4 as canon rows (the
  parity check then enforces them), or close the candidates out.
