# GL-18 — original PROP_TAPE_001 proxy + 10-second inspect proof

- Session / date: Claude Code `session_01M7hBtD6sjMASJZcMJkMzxS` / 2026-10-26
- Authorized by: Brandon, "I approve we can continue to next gate" (2026-10-26), after the review
  named GL-18 as the next task not blocked by any open decision
- Script: `handoff/assets/props/PROP_TAPE_001/v001/work/build_PROP_TAPE_001_proxy_v001.py`
  (SHA-256 `d920e77f0c9075808d3a094591367f5a095b83bfbc7c2b186e2987c5f29f0a60`)
- Lane note: the review assigned GL-18 to Codex. With the founder's go-ahead and the workstation
  offline, Claude staged the script and verified it in the cloud. **Codex: verify, don't redo** —
  the workstation run below is the remaining step.

## What it builds

From an empty file (no Room 14 file, Unreal project or third-party mesh is opened):

- `PROP_TAPE_001_PROXY`: an original compact-cassette shell, nominal 100.4 × 63.8 × 12.0 mm, with a
  shallow label recess on one face so orientation reads; origin at the center, scale applied,
  custom properties `canon_id=PROP_TAPE_001`, `ovs_asset_class=A_PROXY`, `rights=ORIGINAL_OVS`.
  20 triangles.
- Scene `INSPECT_STAGE` (not Room 14): pivot empty, table, camera, key light.
- 240 frames at 24 fps (10.0 s) on the pivot, editable Bézier F-curves: rest (1) → lift and face the
  camera (60) → 360° about the long axis (150) → 180° to the back (180) → return to rest (240).
- Five 480p Cycles stills (frames 1, 60, 120, 180, 240) and a receipt JSON with hashes.

## Verification

| Run | Blender | Result |
|---|---|---|
| Cloud (scratchpad venv, `bpy` module) | 5.0.1 | **PASS**: reopened; bbox [100.4, 63.8, 12.0] mm (±0.1 mm); scale applied; parented to pivot; 6 F-curves on location/rotation, 5 keys each; frames 1–240 at 24 fps; custom properties present. Stills checked by eye: cassette in frame at all five keys |
| Workstation | 5.1.2 | **PENDING**: the workstation was offline. Run `blender -b --factory-startup --python <script> -- D:\OVS\LIKENESS\PROPS\PROP_TAPE_001\v001\<run-id>` and pass back its receipt |

Cloud-run outputs (not committed; reproducible from the script):

| File | SHA-256 |
|---|---|
| `LKN_PROP_TAPE_001_PROXY_V001.blend` | `6c7c3fd7f824…` |
| `PROP_TAPE_001_PROXY_V001_f001.png` | `f1ba7e948c42…` |
| `PROP_TAPE_001_PROXY_V001_f060.png` | `e440f684fadd…` |
| `PROP_TAPE_001_PROXY_V001_f120.png` | `c8dbf5c6401c…` |
| `PROP_TAPE_001_PROXY_V001_f180.png` | `da3f36d8a931…` |
| `PROP_TAPE_001_PROXY_V001_f240.png` | `e60f9a365279…` |

## Limits

- Blender proof only. **Not an Unreal interaction** (that is GL-01/GL-04 territory).
- The 100.4 × 63.8 × 12 mm size is from reference knowledge of IEC 60094-7 and has not been checked
  against a copy of the standard.
- Neutral greybox lighting and material; not a look or grade proof.
- The Deko cassette meshes stay `BLOCKED_PROVENANCE` and were not used.
