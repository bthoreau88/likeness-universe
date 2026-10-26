# Room 14 authority + cassette source review (proposed decision record)

Reviewer: Claude, the reconciliation/review lane. Date: 2026-10-26 (workstation clock
2026-10-25 PT). Input: `LIKENESS_COLLABORATIVE_HANDOFF_2026-10-25.md`; the copy on the
workstation has SHA-256 `02f693b9…7a1b`.

Everything here was **read-only**. This document **does not approve any spatial or canon
choice**. Each section separates **historical** claims (from receipts and the handoff) from
**current** observations (bytes or state I checked today) and **inference**. Workstation
paths are abbreviated; full paths and hashes are in the workstation copy of this review and
in the passback.

---

## D1 · Room dimensions

| | Evidence |
|---|---|
| Historical | The handoff and the cassette preflight receipt say "older Unreal notes: 3.5 × 5.0 × 2.8 m". This repo's Milestone 02 docs (June 2026) say only "a motel room ~3.5m × 5m", with **no height**. |
| Historical (founder record) | OVS-OS `g02/LKN_GAME_ASTRA_G02_FOUNDER_LOCK_V001.md` (`f7b48208…`) and `..._STATE_V001.json` (`375c7a99…`), both dated 2026-09-05, record the founder disposition **"APPROVE + LOCK G02"**. The spatial authority is "ROOM14-ENV-BIBLE"; the source-locked envelope is "18 ft × 12 ft 6 in × 8 ft 6 in" = 5.4864 × 3.81 × 2.5908 m. The lock covers the reviewed provisional transforms for `ROOM14_GAME_GREYBOX_V001` only, and it includes a reopen law. The lock text states that the approval was given from thumbnails and not from full-resolution inspection. |
| Current, verified | A headless, read-only Blender 5.1.2 pass over the locked greybox (hash `4b2bc819…89aa`, identical before and after) measured an interior floor of 0.0–5.4864 × −1.905–1.905 m and a ceiling underside at 2.5908 m. That matches the manifest. The outer shell including 0.12 m walls is 5.7264 × 4.05 × 2.7708 m. |
| Current, not found | No source for the 2.8 m height in either Unreal project's docs, in `D:\OVS\LIKENESS` text files, or in this repo. The actual size of `Lvl_Room14` is **not measured**; that needs the editor. |
| Inference | 5.0 / 3.5 = 1.43 and 5.4864 / 3.81 = 1.44, the same proportion. The older figure reads as a rounded early target, not a competing design. |

**Recommendation (proposed):** treat the G02 founder lock as the record that governs the game
greybox, and mark 3.5 × 5.0 × 2.8 as a superseded early target. No resizing in either direction.
**Founder question:** do you confirm that the 2026-09-05 G02 lock is yours and still governs
(the record was written by an agent session)? **Acceptance test:** once Unreal capacity
allows, measure the `Lvl_Room14` interior in the *sandbox* and record it. If it differs, the
Unreal handoff gate rebuilds from the locked greybox instead of resizing the old map.

## D2 · Map identity

| | Evidence |
|---|---|
| Current, verified | `/Game/OVS_LIKENESS/02_Environments/L_Dellwood_Room14` is **absent** from the original and the sandbox. `/Game/M02/Maps/Lvl_Room14.umap` exists in both, byte-identical (`446ae134…054c`, 64,817 B, 2026-06-29). `EditorStartupMap` and `GameDefaultMap` are `/Game/DemoTemplate/_Core/Lvl_IntroRoom` in both. |
| Historical | GAME_LANE records a rename attempt that failed while the map was loaded. The G02 lock says "zero Unreal mutation until explicitly authorized". |
| Inference | `Lvl_Room14` predates the G02 lock (June vs September), so it can't be the locked greybox. |

**Recommendation:** keep `level_registry.csv` → `L_Dellwood_Room14` as the *target* name.
Treat `Lvl_Room14` as the only existing candidate, **not as equivalent**. Make no rename and
no startup-map change until the Unreal handoff gate is authorized. **Founder question:** is
the canonical map built from the locked G02 greybox (import), or is the old `Lvl_Room14`
renamed and conformed? **Acceptance test:** exactly one map at the registry path, set as the
startup map, with a measured interior equal to the locked envelope.

## D3 · Inspect-system status

| | Evidence |
|---|---|
| Current, verified | Every C++ file in the original and the sandbox is identical. With line endings normalized to CRLF, the game's headers, `Build.cs`, `OVSRoomStateSubsystem.*` and `LikenessRows.h` match this repo's staged versions from before 2e5471f exactly. The game's `OVSInteractorComponent.cpp` (`cb35cf3d…`, 2026-07-06) is the staged `DoInspect`/`TraceDistance` version **plus on-screen debug messages and a `GetFirstPlayerController` fallback**. There is no `RunTrace`/`TraceRange` anywhere. |
| Correction | GAME_LANE §2 ("the PC re-derived `RunTrace`/`TraceRange`") is **stale** against these files. |
| Not verified | The Blueprint graphs and widget fixes (the two manual fixes in the handoff), whether the editor build is current, and on-screen inspect. All of these need the editor. |
| Also staged, not installed | The newer interactor, hide spot and wardrobe (repo `2e5471f`), which compiled with UE 5.8 in a throwaway project. |

**Recommendation:** prove inspect (GAME_LANE GL-01) with the code that's already there before
installing anything newer. Strip the debug messages before any capture counts as evidence.

## D4 · Cassette source / license

| | Evidence |
|---|---|
| Current, verified | `SM_Record_Cassette_A01_N1.uasset` (`1b969f5a…4474dd3f`) and `..._B01_N1.uasset` (`c14fd1d7…414806b4`) are present and identical in both projects, dated 2026-06-22 19:00. The `Deko_MatrixDemo` pack is 357 files, about 2.5 GB, per project. |
| Current, not found | No license, readme or non-asset files in the pack. No launcher manifest, VaultCache folder or launcher/project log line mentions Deko or MatrixDemo. The local `FabPlugins` folder holds only Blender/Maya/C4D plugin installers. |
| Repo record | `asset-plan.json` PROP_TAPE_001: `rights_status: unverified`, `license_record: null`. `asset_manifest.csv`: `IDEA`, with an empty `engine_path`. |

**Status: `BLOCKED_PROVENANCE`.** No acquisition record exists on the workstation.
**Recommendation:** don't assign either mesh to `PROP_TAPE_001`. Prove the 10-second
interaction on an **original proxy** (task below) while Brandon looks up the source.
**Founder question:** where did `Deko_MatrixDemo` come from (Fab listing or order, license
type, date)? **Acceptance test:** a license record (listing URL, license, date) mapped to the
two mesh hashes and kept private. Only after that is a QC comparison against the proxy useful.

## D5 · V002 entry-camera preview

| | Evidence |
|---|---|
| Current, verified | The hashes of the V002 blend (`670d1c67…4748`), the preview (`61e1158d…cd87`) and the verification JSON (`45b1c0f9…d376`) match the handoff. A read-only measurement (hash unchanged) gives: 32 objects; active camera `R14_REV_ENTRY` at (0.5, 1.0, 1.6), 28 mm, 854×480; the forward vector (0.9049, −0.4113, −0.1097) equals the direction to the stated target (3.8, −0.5, 1.2); the envelope is identical to the original. Original: no active camera, and the entry camera sits **inside** `R14_PROXY_PLAYER`, whose surface the center ray hits at 0.415 m. |
| Current, observed | The original entry view is one flat gray surface. V002 reads as a room (ceiling, two walls, floor). **Its center ray hits `R14_PROXY_THOREAU` at 2.42 m**, and the two 1.8 m actor proxies fill the center third of the frame. The window, doors and mirror can't be identified, and the bed-left hierarchy (review criterion R02) can't be confirmed from this frame. Lighting is neutral; it isn't a lighting or grade proof. |
| Gap | The V002 verification JSON doesn't record the camera location or target. The handoff's values are confirmed only by this measurement. |
| Governance | `R14_REV_ENTRY` belongs to the founder-locked G02 transform set (`sceneContract.reviewMarkers`). V002 is correctly a separate derivative. **Promoting it needs `REOPEN GATE LKN-GAME-ASTRA-G02`, or a founder ruling that review cameras are tooling outside the lock.** |

**Recommendation:** keep V002 as the technical review candidate. Before asking the founder to
judge the entry read, a V003 review render could hide the actor proxies; that's Codex's call.
Make no change to the locked file.

## D6 · Historical receipts vs today

| Claim | Today |
|---|---|
| PR #19 merged, source `1c929ec`, Pages `00353a9`, Pages run success | Verified through the GitHub API. `gh-pages` is still `00353a9`. |
| Source branch at `1c929ec` | **Moved:** now `932f182`, with 7 newer commits from the Claude lane. `1c929ec` is an ancestor. These were pushed directly to the source branch, not through a PR, and **none has been published to Pages**. |
| 4 intake batches / 36 records | Now **6 batches**: 005 and 006 were added by the Claude lane. |
| Drive asset ZIP unverified | **Superseded:** the workstation copy matches Drive's byte size. SHA-256 `13dffa31…8300`; 178 content files (PNG/JPG/HEIC/DNG/video); **no engine or 3D files**. See `data/production/external-assets-inventory-001.json`. |
| Free memory 0.53 / 1.74 / 0.93 GiB | Today: 1.87, 1.28 and 1.33 GiB. **Still below a safe Unreal launch.** A desktop Blender session (pid 49528, running since 2026-10-15) was not touched. |
| PythonScriptPlugin not enabled | Consistent: neither `.uproject` lists it. |
| Original repo `4d9bbfe` | Verified from `.git/HEAD` → `master` → `4d9bbfe…`. No remote is configured. |

---

## One task for Codex (does not depend on any unresolved choice)

**Build an original `PROP_TAPE_001` proxy and its 10-second editable inspect proof, isolated
from Room 14.**

1. Check free memory first, and stop if Blender background can't run without closing apps.
   Work in a new run folder (for example `D:\OVS\LIKENESS\PROPS\PROP_TAPE_001\PROXY_V001\<run-id>\`).
   Don't open or modify the G02 greybox, V001/V002, either Unreal project or the Deko meshes.
2. In Blender 5.1.2 (background), create `LKN_PROP_TAPE_001_PROXY_V001.blend` from scratch.
   One object, `PROP_TAPE_001_PROXY`: a compact-cassette shell at nominal **100.4 × 63.8 × 12.0 mm**.
   Record the dimension source you use in the receipt. Origin at the geometric center, +X
   along the long axis, scale applied, metric units. Custom properties
   `canon_id=PROP_TAPE_001`, `ovs_asset_class=A_PROXY`, `rights=ORIGINAL_OVS`. One neutral material.
3. In a separate scene `INSPECT_STAGE`, which is not Room 14, add an empty
   `PROP_TAPE_001_INSPECT_PIVOT` parenting the proxy and one camera. Keyframe 240 frames at 24 fps
   (10.0 s): rest → lift and face the camera (frames 1–60) → rotate 360° about the long axis,
   then 180° to the label side (61–180) → return to rest (181–240). Use editable F-curves, not baked ones.
4. Save, reopen and verify: the bounding box is within ±0.1 mm of the nominal size, F-curves
   exist on the pivot, the frame range is 1–240, and the proxy still carries its custom properties.
5. Render 480p review stills at frames 1, 60, 120, 180 and 240 (and an optional 480p MP4).
6. Pass back using the template below: the receipt, SHA-256s of the blend and renders, and
   check results. Label it "Blender proof, not an Unreal interaction".

**Not in scope:** Unreal import, room placement, choosing the final mesh, any purchase or generation.

---

## Founder decisions still open

1. Confirm or reject the 2026-09-05 G02 lock as governing, which retires 3.5 × 5.0 × 2.8.
2. Decide whether `L_Dellwood_Room14` is built from the locked greybox or by conforming `Lvl_Room14`.
3. Issue `REOPEN GATE LKN-GAME-ASTRA-G02` for the review camera, or rule that review
   cameras sit outside the lock.
4. Supply the acquisition record for `Deko_MatrixDemo`.
5. Decide whether the 7 unpublished source commits on the branch should go through a PR or be
   published as they are. Neither has happened.
