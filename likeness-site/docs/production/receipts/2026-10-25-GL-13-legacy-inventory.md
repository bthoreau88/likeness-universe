# Session exchange receipt — GL-13 legacy inventory (PC, remote)

- Session ID / local date / sender / receiver: Claude Code `session_01M7hBtD6sjMASJZcMJkMzxS` / 2026-10-25 / Claude (driving the workstation remotely via Desktop Commander) / Brandon + next agent
- Repository / task / allowed paths: `bthoreau88/likeness-universe` / GAME_LANE GL-13 steps 1–2 (inventory + proposed triage) / workstation: read-only scans; writes only to a new salvage folder outside every project. Repo: this receipt and one GAME_LANE row.
- Canonical source baseline SHA: `432d592`; scanner fetched from GitHub on the workstation, SHA-256 `2d7b414d124e143e846f35f22a6ffffdc5b192ea8ca1c13322ff6df72235db86`, identical to the committed file.
- Workstation: MSI Raider GE78HX 13VG, Windows, 15.7 GB RAM, Python 3.14. Free disk: C: 32 GB, D: 18 GB.

## What ran

`legacy_inventory.py` over the character-design archive (18 projects), two old game projects, a MetaHuman project, the UE 5.8 sandbox copy, and the OVS work folder on D:. Nothing was opened in the editor, converted, moved or deleted. Full inventories, a condensed summary and a detailed `TRIAGE_PROPOSAL.md` stay on the workstation (salvage folder); paths are withheld here.

## Findings

| Finding | Detail | Proposed |
|---|---|---|
| Old game builds are almost empty | `LIKENESS_001` (5.7, 443 assets, 140 MB) and `LIKENESS_TAPE3_001` (5.7, 246 assets, 226 MB) contain Unreal template content only | Screenshot `LIKENESS_001` layouts (203 placed actors), then RETIRE both |
| THOREAU MetaHuman has drifted | `Thorea_MEta_Iden` exists **9 times in at least 5 revisions** (310–996 MB, 2024-05 → 2025-07) across character projects; plus a separate `Brandon` MetaHuman and a dressed `MT_THBXY` (newest, 2025-07-21) | **HUMAN decision:** pick one canon copy for `CHR_THOREAU_001`; all others REFERENCE |
| Identity source material exists | Custom MetaHuman build with source assets (2 GB), a glasses set, two photogrammetry scan projects, ~494 loose head/body meshes | KEEP (identity sources); consent check for any scan of another person |
| Dressing candidate for Room 14 | A "VintageRoom" environment pack (472 assets, 2.8 GB) in two projects | Verify source; if Fab, re-claim fresh into staging |
| UE 5.8 sandbox is a full project copy | 3,024 assets incl. its own `M02/Lvl_Room14` and C++; last change 2026-07-06 | **HUMAN decision:** compare with the live project before retiring |
| A purchased skin texture pack (214 PSDs) | Paid, single-user license | KEEP privately; never commit |
| Copyrighted reference clips and course audio | Film clips, a game trailer, course sound files | Reference only; never ship |
| Current pipeline output on D: | Room 14 Blender greybox, camera-repair revisions, review views, a Blender round-trip receipt | Not legacy; G04 evidence candidates |

## Gate status

G01 passed for inventory (metadata registered on the workstation); triage proposed, **not approved**. Step 0 (archive) **blocked**: the material worth keeping (~60 GB) exceeds local free space — needs an external drive or cloud folder. No migration done (by design).

## Boundaries / next

- Not done: archiving, any editor open, any migration.
- Needs Brandon: (1) canon THOREAU pick, (2) sandbox vs live project, (3) where the "ReauxMeta" MetaHuman actually lives (that project contains template content only), (4) an archive destination, (5) approval of the triage table.
- Next bounded task: archive to the chosen destination with SHA-256s, then migrate only approved KEEP items into `10_Art_Staging/Legacy/` per LEGACY_SALVAGE.md §4.
