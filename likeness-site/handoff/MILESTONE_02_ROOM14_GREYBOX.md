# Milestone 02 — Room 14 Greybox + Walk + Inspect Stub

The first *playable* milestone. Prove the chamber, the movement, and the data-driven
interaction trace. No final art — greybox only. One location.

## Goal
A player can spawn in a greyboxed Room 14, walk through it and the connected hallway,
look at the five evidence objects, and trigger an inspect prompt whose text comes from
the registry (not hardcoded).

## Scope (do only this)
- **Room 14 greybox**: correct real-world scale (a motel room ~3.5m × 5m) *[superseded 2026-10-26: the founder-locked G02 envelope is 5.4864 × 3.81 × 2.5908 m; see docs/production/receipts/2026-10-26-room14-founder-decisions.md]*, door to the
  bathroom, door to the hallway. BSP/blocking volumes or simple static meshes.
- **Hallway greybox**: a short corridor with the numbered Room 14 door; one sconce light
  placeholder.
- **Player**: first-person pawn, walk + look, collision correct (can't pass walls).
- **Lighting placeholders**: one warm tungsten lamp (Room 14), one fluorescent (bathroom),
  motivated only — no skylight dump.
- **Inspect trace**: a `BP_OVS_InteractableBase` line-trace from the camera; when it hits
  an interactable, show a sparse prompt (`WBP_OVS_InspectUI`) with the object's name +
  one inspect line **read from the data registry by ID**.
- **Five inspectables placed** (placeholder cubes/props), tagged with their registry IDs:
  `PROP_KEY14_001`, `PROP_LOCKET_001`, `PROP_TAPE_001`, `PROP_MIRROR_001`, `PROP_DEVICE_001`.

## Blueprint classes (from the bible §11)
| Class | Responsibility (this milestone) |
|---|---|
| `BP_OVS_InteractableBase` | Interaction trace, prompt, data lookup by ID |
| `BP_OVS_InspectableObject` | Close-read / rotate stub (full inspect later) |
| `BP_OVS_RoomStateController` | Exists with STATE_00_NORMAL only (states come later) |
| `WBP_OVS_InspectUI` | Sparse editorial prompt — name + one line |

## Data wiring
- Read object name + inspect line from a DataTable imported from `data/asset_manifest.csv`
  (or a generated JSON). Keys must match the web registry IDs so site + game stay in sync.
- No story strings in the Blueprint graph.

## Acceptance criteria
- [ ] Play-in-editor: player spawns, walks Room 14 ↔ hallway, collisions hold.
- [ ] Looking at each of the 5 objects shows the inspect prompt with the **correct
      registry text** (swap a CSV value → prompt changes, proving data-driven).
- [ ] Lighting is motivated (no unmotivated ambient fill).
- [ ] Scale reads as a real motel room.
- [ ] Screenshot proof: one wide of Room 14, one of an active inspect prompt.
- [ ] Commit: `feat: add room 14 greybox` (+ `feat: add inspectable object system`).

## Explicitly NOT in this milestone
- No final meshes/materials, no MetaHuman, no mirror lag, no tape playback, no doubles,
  no audio design. Those are Milestones 03–08.

## Next
Milestone 03 — Inspectable system full (rotate, evidence unlock) → 04 Mirror Lag →
05 Tape Contradiction (each adds one mechanic, one pressure variable).
