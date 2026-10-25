# Legacy salvage — old Unreal projects and assets (GAME_LANE GL-13)

Brandon has earlier LIKENESS builds and assets on the workstation that need near-total
revamps. This layer gets their value out without risking the originals and without
dragging old IDs, broken Blueprints or unknown-license files into the current project.
It feeds [ASSET_FAST_LANES.md](ASSET_FAST_LANES.md) (the "reuse" lane) and follows the
staging rules in [ASSET_SOURCING.md](ASSET_SOURCING.md) and [BLENDER.md](BLENDER.md).

**"Revamp from scratch" does not mean "delete."** Old work is reference, raw material and
devlog history. It is archived first, triaged second, and only the parts worth it move.

---

## 0 · Protect the originals (before anything else)

Opening an old project in UE 5.8 offers to convert it, and assets saved by 5.8 cannot be
opened by the older engine again. One wrong click converts the only copy.

1. Copy each old project folder to an archive location (external drive or cloud storage).
2. Zip the copy and record its SHA-256 (Windows: `certutil -hashfile <file>.zip SHA256`).
3. Mark the original folders read-only. **Never open an original in the editor.**
4. When you do open an old project later (step 3), open the archived *copy*, and when UE
   shows the conversion dialog choose **Open a Copy** — never **Convert in-place**.

---

## 1 · Inventory (read-only, about a minute per project)

`scripts/production/legacy_inventory.py` comes down with the GAME_LANE §4 sync. It reads
file names and sizes only, skips `Intermediate`, `DerivedDataCache`, `Binaries`, `Saved`
and `.git`, and records paths relative to the scan folder.

```text
python -I legacy_inventory.py "D:\Old LIKENESS builds" legacy-inventory-2026-10-25.json
```

Per project it reports engine version (flagged if not 5.8), enabled plugins, whether it
has C++ source, every map, assets per top-level `Content` folder with sizes, asset name
prefixes, and loose source files (FBX, .blend, textures, audio, video). Files outside any
project are listed separately. It refuses to overwrite an existing output file.

The JSON stays on the workstation. Only the summary in step 6 comes back to this repo.

---

## 2 · Triage by folder, not by file

Give every top-level `Content` folder (and each loose-file group) one decision. One session
is enough; don't open individual assets yet.

| Decision | Meaning |
|---|---|
| **KEEP** | Migrate into staging, then revamp |
| **REWORK** | Migrate as a starting point for something on the make list; expect heavy changes |
| **REFERENCE** | Don't migrate; capture screenshots/notes, rebuild fresh |
| **RETIRE** | Stays in the archive only |

Default calls (override when you have a reason):

| What it is | Default | Why |
|---|---|---|
| Your own source files (.fbx, .blend, .psd, textures, audio you made) | KEEP | Highest value; re-export through the Blender fast path |
| Your own recordings, voice, performance capture | KEEP | Irreplaceable; check consent for anyone else in them |
| Maps and level layouts | REFERENCE | Screenshot top-down + key angles; rebuild in the greybox with canon IDs |
| Blueprints / gameplay logic | REFERENCE | Logic now lives in C++ components; old Blueprints drag dependencies and old IDs |
| Hero materials (skin, mirror, brass) | REWORK | Starting point for make-list items |
| Generic materials (carpet, plaster, tile) | RETIRE | CC0 replacements are faster (ASSET_FAST_LANES) |
| Fab / marketplace packs | RETIRE the copy | Re-claim fresh from your Fab library into staging; the license sits with your account, not the old folder |
| Old character / MetaHuman attempts | REFERENCE | New builds go through the 4-step identity gate; never promote an old face directly |
| Anything with no known source or license | RETIRE | Until the rights are found and recorded |
| Off-tone content (sci-fi cut, gore, generic horror) | RETIRE | Same quarantine logic as the site's `/alt` page |
| Old builds, captures, screenshots | KEEP as history | Devlog "where it started" material; archive, not canon |

The one-line test for anything else: *is a fresh sourced asset faster than fixing this
one?* For furniture, almost always yes. For something on the make list, often no.

---

## 3 · Capture REFERENCE items

Open the archived copy (Open a Copy). For each REFERENCE map: a top-down shot, the
player-height entry view, and any composition worth keeping. For Blueprints: a screenshot
of the graph plus a one-line note of what it did. Save under a private
`legacy/<project>/reference/` folder on the workstation.

---

## 4 · Migrate KEEP and REWORK items into staging

Unreal's **Migrate** copies an asset with its dependencies but keeps its folder path, so
gather first:

1. In the opened copy, move the kept assets into one folder named `Legacy_<ProjectName>`
   and run **Fix Up Redirectors**.
2. Right-click that folder → **Migrate** → choose the current project's `Content` folder.
3. In the current project, move `/Game/Legacy_<ProjectName>/` under
   `/Game/OVS_LIKENESS/10_Art_Staging/Legacy/` and fix redirectors again.
4. Review what came along as dependencies; delete stray duplicates of things you already
   have from the staging folder only.

Nothing goes into production folders from here. Each item then follows the normal path:
Blender pass if needed → QC → license record → `asset_manifest.csv` row only if gameplay
references it → promotion.

---

## 5 · Revamp order

Work the KEEP/REWORK list in the same order as the finish-line queue needs it: Room 14
dressing first (GL-07), then evidence props, then anything character-adjacent (GL-10,
human-reviewed). Don't revamp an asset the current slice doesn't use yet.

---

## 6 · Passback (what comes back to this repo)

Add to the session receipt, with no private paths:

```text
- Projects archived: name, engine version, archive SHA-256
- Inventory file name and date (file itself stays on the workstation)
- Per project: assets / maps / content MB, and the decision for each top-level folder
- Items migrated to staging (names only), and anything RETIRED for unknown rights
```

## PC prompt (GL-13)

```text
Task GL-13 (legacy salvage), read-only. Read docs/production/LEGACY_SALVAGE.md from the
latest handoff archive. Do NOT open any original project in the editor. Step 0: confirm
each old project folder is copied to the archive and record its zip SHA-256. Step 1: run
legacy_inventory.py over the archive folder into a new JSON file and print its summary.
Step 2: propose a KEEP / REWORK / REFERENCE / RETIRE decision for every top-level Content
folder using the default table, and list anything you are unsure about for Brandon.
Stop there — no migration until Brandon approves the triage. Write the step 6 passback.
```
