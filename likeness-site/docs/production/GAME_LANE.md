# Game lane — Room 14 vertical slice, finish-line handoff

Session: 2026-10-25. This is the game-side companion to `../../CODEX_HANDOFF.md` (which
covers the website). It extends [UNREAL.md](UNREAL.md), [BLENDER.md](BLENDER.md),
[ASSET_SOURCING.md](ASSET_SOURCING.md) and [AGENT_EXCHANGE.md](AGENT_EXCHANGE.md); it does
not replace them. Written for any agent that reads `AGENTS.md` — Codex (including GPT-6
Astra), Claude, or a human. No claim is made here about what a specific model can do;
the lanes below are about where each kind of work physically has to run.

**Finish line:** a packaged development build of Room 14 in which the player walks in,
inspects evidence (text from the DataTable), inspecting the mirror changes the room
state, the mirror visibly answers late, one tape beat fires, lighting is motivated, and a
continuous capture proves it. That is gate G05 in [WORKFLOW.md](WORKFLOW.md).

---

## 1. Three lanes — put every task in exactly one

| Lane | Where it runs | Can do | Cannot do |
|---|---|---|---|
| **CLOUD** | This repo (Codex cloud, Claude, any repo agent) | Author C++ under `handoff/unreal/cpp_rowstructs/`, edit canon CSVs + `src/lib/registry.ts` together, specs, scripts, site, validation | Compile Unreal, open the editor, press Play, run Blender |
| **PC** | The Windows workstation, a local agent in VS Code (Codex CLI or Claude Code) with the Unreal MCP bridge at `http://127.0.0.1:8000/mcp` | Sync source, build, attach components, import DataTables, PIE, screenshots, commit to the game repo, write a passback | Make purchases, approve identity, decide canon |
| **HUMAN** | Brandon | Purchases, THOREAU/DRYA identity review, final creative calls, pressing Play when an agent can't | — |

The CLOUD lane prepares; the PC lane proves. A CLOUD task is never "done" until a PC
passback shows it compiled and ran. A PC session never re-writes code the CLOUD lane
already staged — it pulls it (§4).

---

## 2. Current state (2026-10-25)

Status words follow the passback rules: **verified** means a screenshot or log was seen;
**reported** means a PC session said so in its transcript but no proof is in this repo.

| Item | Status | Evidence / location |
|---|---|---|
| Game project | reported | `C:\OVS\LIKENESS_THE_GAME\LikenessTheGame\LikenessTheGame.uproject`, UE 5.8.0, local git (`master`), **no remote** |
| Unreal MCP bridge | reported | VibeUE built from source for 5.8; `.mcp.json` in project root; tool surface is `execute_python_code` + VibeUE `BlueprintService` |
| Foundation + canon CSVs | reported | game commits `42c2d04`, `d1cbc1b`, `4d9bbfe`; canon = `handoff/data/*.csv` here |
| C++ module + 9 DataTables | reported | game commit `5441161`; `/Game/OVS_LIKENESS/09_Data/DT_*`, row names = canon IDs |
| Room 14 greybox | reported | game commit `1e1d2f5`; map `/Game/M02/Maps/Lvl_Room14` (rename to `L_Dellwood_Room14` attempted, failed while loaded — pending); wide screenshot `Saved/Screenshots/M02_Room14_Wide_v2.png` |
| 5 evidence props | reported | tags `[PROP_*_001, OVS_Interactable]`, asset ID at index 0 |
| Inspect UI widget | reported | `/Game/M02/UI/WBP_OVS_InspectUI` with `TXT_Name`, `TXT_Line`, `RootCanvas`, `UpdateInspect` |
| Inspect logic | **blocked** | Two competing versions exist: a hand-wired Blueprint graph in `BP_FirstPersonCharacter` that the editor log shows failing to compile, and a C++ component the PC re-derived (`RunTrace`/`TraceRange`) instead of pulling the staged one (`DoInspect`/`TraceDistance`). On-screen inspect text has not been shown. → task GL-01 |
| Room State subsystem | staged | `handoff/unreal/cpp_rowstructs/Source/LikenessTheGame/Public/OVSRoomStateSubsystem.h` — never compiled on the PC |
| Mirror lag | spec only | `handoff/mechanics/MECH_MIRROR_LAG_SPEC.md` |
| DRYA | packet only | `handoff/expansions/character_refs/DRYA_BUILD_PACKET.md` |
| Legacy inventory (GL-13) | verified (scan) | Old game builds are template-only. THOREAU MetaHuman exists 9 times in 5+ revisions — canon pick pending (HUMAN). Archive blocked on disk space. See `receipts/2026-10-25-GL-13-legacy-inventory.md` |

---

## 3. Known traps (each one cost at least one session)

1. **Live Coding cannot add a new `UCLASS`/`USTRUCT`.** Ctrl+Alt+F11 fails or silently does
   nothing for new reflected types. Close the editor and run a full build:
   `"C:\Program Files\Epic Games\UE_5.8\Engine\Build\BatchFiles\Build.bat" LikenessTheGameEditor Win64 Development -project="C:\OVS\LIKENESS_THE_GAME\LikenessTheGame\LikenessTheGame.uproject" -waitmutex`.
   It must end with `Build succeeded`. Do not rely on `BuildAndLaunchGame.ps1` (a VibeUE
   plugin script) for the game module.
2. **The workstation runs out of memory while compiling.** The build accelerator killed
   compile processes at its memory threshold on a 15.7 GB machine. Close browsers and other
   heavy apps first. If kills continue, lower Unreal Build Tool's parallel action count
   (`BuildConfiguration.xml` supports a max-parallel-actions setting; confirm the key name in
   the 5.8 UBT docs before editing).
3. **API macro is `LIKENESSTHEGAME_API`** (module `LikenessTheGame`). `LIKENESSGAME_API`
   compiles into dozens of cascading errors.
4. **DataTable CSV import needs the key column named `Name`.** `import_asset_tasks` creates
   nothing otherwise. Use `handoff/unreal/cpp_rowstructs/scripts/import_registries_as_datatables.py`
   (fixed 2026-10-25: `create_asset` + `fill_data_table_from_csv_string`).
5. **The MCP bridge cannot author certain Blueprint nodes.** `BlueprintService.build_graph`
   returns nothing for Cast nodes, struct Break nodes and typed `GetDataTableRow`. Gameplay
   logic therefore goes in C++ components the CLOUD lane writes; MCP is for placement,
   materials, lighting, scene reads and asset setup.
6. **Never re-derive staged source on the PC.** Pull it (§4). Re-deriving produced the
   macro bug and the property-name mismatch with the attach script.
7. **PowerShell `Invoke-RestMethod` hangs on the MCP server's SSE stream.** Use `curl.exe`
   with a UTF-8 file body written **without** a byte-order mark (`--data-binary @file`).
   Each session: `initialize` → read `Mcp-Session-Id` header → `notifications/initialized`
   → `tools/call`.
8. **The editor log is the source of truth**:
   `C:\OVS\LIKENESS_THE_GAME\LikenessTheGame\Saved\Logs\LikenessTheGame.log`. Blueprint
   compile errors, Live Coding failures and Python tracebacks all land there.
9. **A Blueprint that fails to compile never runs `BeginPlay`.** A component attached to a
   broken Blueprint looks dead. Fix compile errors before debugging components.
10. **Stay in Play long enough.** Stopping PIE within a second tears the world down before
    timers fire.

---

## 4. PC session ritual (every session, in order)

```text
1. SYNC (never skip, never re-derive):
     cd C:\OVS\LIKENESS_THE_GAME\_foundation
     git fetch origin claude/dreamy-hawking-VcoBe --depth 1
     git archive FETCH_HEAD likeness-site/handoff likeness-site/docs/production likeness-site/scripts/production -o ..\_handoff_latest.zip
     cd .. ; Expand-Archive _handoff_latest.zip -DestinationPath _handoff_latest -Force
   The archive also carries docs/production (this file) and scripts/production.
   Copy likeness-site/handoff/unreal/cpp_rowstructs/Source/LikenessTheGame/** over
   LikenessTheGame\Source\LikenessTheGame\ (overwrite). Copy handoff/data/*.csv over data\.
2. If any .h/.cpp changed: close the editor, full build (trap 1). Read the result.
3. Relaunch. Verify every staged class exists, e.g.
     import unreal; print(unreal.OVSInteractorComponent.static_class().get_name())
4. If any CSV changed: run import_registries_as_datatables.py via MCP.
5. Do ONE task from §5. Prove it in PIE (screenshot + log excerpt).
6. Commit in the game repo; write a passback (§6). Stop.
```

---

## 5. Finish-line task queue

One task per session. Do not start the next until the previous passback is accepted.

| ID | Lane | Task | Acceptance (all required) | Gate |
|---|---|---|---|---|
| **GL-01** | PC | Converge inspect on the staged C++ component; delete the broken Blueprint inspect graph | Build succeeded; `OVSInteractorComponent` + `OVSRoomStateSubsystem` classes resolve; `BP_FirstPersonCharacter` compiles clean; PIE screenshot shows a prop's `name` + `inspect_text`; edit one `inspect_text`, re-import, re-PIE shows the change; game commit | G05 (partial) |
| GL-02 | HUMAN + PC | Back up the game repo to a private remote with Git LFS | Remote URL recorded (private); `git lfs ls-files` shows `.uasset`/`.umap`; push succeeded | — |
| GL-03 | CLOUD | Inspect → room-state hook: inspecting `PROP_MIRROR_001` sets `STATE_02_MIRROR_LAG`, data-driven (canon column, matching struct field, `npm run validate:production` green) | Parity check passes; spec of the column in `asset_manifest.csv` and `FAssetManifestRow`; no hard-coded IDs in C++ | G02 |
| GL-04 | PC | Build + verify GL-03 | Log line `OVSRoomState: 0 -> 1` (or equivalent) on mirror inspect; screenshot; game commit | G05 (partial) |
| GL-05 | CLOUD | Mirror lag stages 0–2 per `MECH_MIRROR_LAG_SPEC.md` (SceneCapture + ring buffer, placeholder proxy, `DT_MirrorLag`) | Compiles in review; parity green; capture gated by proximity | G02 |
| GL-06 | PC | Build + verify GL-05 | Side-by-side capture: reflection in sync at state 00, visibly late at state 02; change `lag_seconds`, re-import, behavior changes; frame time recorded | G05 (partial) |
| GL-07 | HUMAN → PC | Dress Room 14 from the sourced kit in [ASSET_FAST_LANES.md](ASSET_FAST_LANES.md) into a staging folder | Every placed asset has a license record; nothing in production folders; wide screenshot | G03/G04 |
| GL-08 | PC | Motivated lighting pass in a sandbox copy of the map (tungsten lamp, teal intrusion, bathroom fluorescent) | Every light has a visible source; no skylight dump; Lumen frame time recorded | G05 (partial) |
| GL-09 | CLOUD → PC | Tape contradiction beat (`BEAT_TAPE_CONTRADICTION_001`, `STATE_04_TAPE_CONTRADICTION`) | One event fires once (replay-safe); same expected output as a web fixture | G02/G05 |
| GL-10 | HUMAN | DRYA via `DRYA_BUILD_PACKET.md` (4-step references gate first) | Identity review signed off by Brandon; no generic purchased face | G04 |
| GL-11 | PC | Packaged development build + continuous capture: enter → inspect → mirror → tape → recap | Build hash, machine spec, frame time, video file; editor stills alone do not count | **G05 exit** |
| GL-12 | CLOUD | Companion parity: devlog/press reflect only verified status | Lint + build green; no claim above its evidence | G06 |
| GL-13 | PC + HUMAN | Legacy salvage: archive old projects untouched, inventory them, triage by folder ([LEGACY_SALVAGE.md](LEGACY_SALVAGE.md)). Read-only; can run any time, in parallel with GL-01..GL-12 | Each original archived with a SHA-256; inventory JSON written; every top-level Content folder has KEEP / REWORK / REFERENCE / RETIRE; nothing migrated before triage is reviewed | G01/G03 |

Keep out of the first slice: hallway/office access, multiplayer, microphone input, final
character art, save-system migration, branching beyond one event.

---

## 6. Passback from a PC session

Use [templates/SESSION.md](templates/SESSION.md) and add these game fields:

```text
- Game repo HEAD before / after (local SHA; remote URL once GL-02 is done):
- Unreal version/build and machine (CPU, RAM, GPU actually used):
- Handoff archive SHA pulled (git rev-parse FETCH_HEAD):
- Build.bat result line (exact) and duration:
- Classes verified (names printed):
- PIE proof: screenshot paths + the matching LikenessTheGame.log excerpt:
- Task ID (GL-xx) and each acceptance line: passed / failed / not run:
- Anything changed outside the task (should be none):
```

Save it as `docs/production/receipts/<date>-GL-xx.md` through a CLOUD session (the PC has
no push access to this repo by default).

---

## 7. Handoff prompts

### CLOUD session (paste into Codex / GPT-6 Astra / Claude working in this repo)

```text
Resume the LIKENESS game lane in bthoreau88/likeness-universe.
Read likeness-site/AGENTS.md, likeness-site/CODEX_HANDOFF.md,
likeness-site/docs/production/README.md, likeness-site/docs/production/GAME_LANE.md,
and the newest file in likeness-site/docs/production/receipts/.
Branch from origin/claude/dreamy-hawking-VcoBe. Take the first open CLOUD task in
GAME_LANE.md §5 whose dependencies have an accepted PC passback. Do only that task.
C++ lives in likeness-site/handoff/unreal/cpp_rowstructs/ (module LikenessTheGame,
macro LIKENESSTHEGAME_API). Any new canon ID or column goes into handoff/data/*.csv and
the matching row struct in the same change. Never invent IDs. Gameplay logic is C++
components, not MCP-wired Blueprint graphs.
Run from likeness-site: npm run validate:production && npm run test:production &&
npm run lint && NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build.
You cannot compile Unreal: mark the task "staged", never "done". Write a receipt with
docs/production/templates/SESSION.md and the exact PC steps for the matching PC task.
```

### PC session (paste into the local agent in VS Code with the Unreal MCP connected)

```text
You are the PC lane for LIKENESS : THE GAME (UE 5.8, C:\OVS\LIKENESS_THE_GAME).
Read likeness-site/docs/production/GAME_LANE.md from the latest handoff archive first,
especially §3 (known traps) and §4 (session ritual). Follow §4 exactly: sync, full build
if source changed, verify classes, import CSVs if changed, then do ONE task from §5:
[TASK ID]. Do not rewrite C++ that the handoff provides; if it does not compile, stop and
report the exact compiler errors instead of re-deriving it. Prove the result in PIE with
a screenshot and the matching LikenessTheGame.log excerpt. Commit in the game repo.
Write the passback using §6 and stop.
```
