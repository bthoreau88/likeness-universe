# Screenplay → game: "A Night for Four"

How [`A_NIGHT_FOR_FOUR.fountain`](A_NIGHT_FOR_FOUR.fountain) maps onto the canon IDs in
`handoff/data/*.csv`. The `[[…]]` notes in the screenplay carry the same IDs. Story
canon is in [STORY_BIBLE.md](STORY_BIBLE.md).

**Rule:** the screenplay is the story source. Game dialogue moves into data (a future
dialogue table keyed by beat), never into Blueprint graphs or React components.

---

## 1 · Scene map

| # | Scene | Location | Beat · room state | Mechanics · props | Game form | Slice? |
|---|---|---|---|---|---|---|
| T1 | *The Late Room* host | CRT | — | — | Title / attract screen on the Room 14 CRT | Later |
| T2–T3 | Bus shelter, crosswalk | Route 9 (no canon ID) | — | — | Short playable walk-in; outside cast | Later |
| T4 | Front office: bell, ledger, two keys | `LOC_DELLWOOD_OFFICE_001` | Arrival ritual | `PROP_KEY14_001` | Playable | Later (office access is out of the first slice) |
| 1.1 | Hallway: two doors marked 14 | `LOC_DELLWOOD_HALLWAY_001` | — | `MECH_ROOM_STATE_001` | Playable corridor | Later |
| 1.2 | Room 14: DRYA already inside | `LOC_DELLWOOD_ROOM14_001` | `BEAT_ARRIVAL_001` · `STATE_00_NORMAL` | `MECH_INSPECT_001` | **Slice entry point** (the slice starts inside the room) | **Yes** |
| 1.3 | Coffee, locket, red phone, two versions of the night | Room 14 | `BEAT_ARGUMENT_RESIDUE_001` · `STATE_01_RESIDUE` | Inspect `PROP_LOCKET_001`; coffee and phone as interactables | Inspect + scripted dialogue | **Yes** (inspect) |
| 1.4 / 2.1 | Bathroom mirror answers late | Room 14 | `BEAT_MIRROR_LAG_001` · `STATE_02_MIRROR_LAG` | `MECH_MIRROR_LAG_001`, `PROP_MIRROR_001` | Playable (GL-05/06) | **Yes** |
| 2.2–2.4 | Ice, Otis, Desmond, horse in the pool, THE OTHER on the street | Outside | — | `PROP_DEVICE_001` warms and hums | Playable exterior | Later |
| 3.1 | Manuscript pages predict the scene | Room 14 | — | Inspect (pages) | Inspect | Later |
| 3.2 | *FINAL CUT* side A, then side B | Room 14 | `BEAT_TAPE_CONTRADICTION_001` · `STATE_04_TAPE_CONTRADICTION` | `PROP_TAPE_001`, room edits itself | Playable (GL-09) | **Yes** (the slice ends after side A's "...Cut." with the end title card) |
| 3.3 | "We're showing three." Lamp out; hide in the closet | Room 14 | `BEAT_DOUBLE_OCCUPANCY_001` · `STATE_05_DOUBLE_OCCUPANCY` | `MECH_HIDE_001`, `PROP_DEVICE_001` | Playable hide over a Level Sequence | Milestone 2 |
| 4.1 | Floor conversation | Room 14 | — | — | Cinematic | Milestone 2 |
| 4.2 | Hallway dance | Hallway | — | Count/rhythm traversal (candidate) | Playable set piece | Milestone 3 |
| 4.3 | Ledger | Office | `BEAT_FINAL_MEMORY_LOCK_001` · `STATE_06_MEMORY_LOCK` | Choice | Playable choice | Milestone 2 |
| 4.4–Tag | Crosswalk at 3:15, THE OTHER at the door, the bed, the host | Various | — | — | Ending cinematics | Milestone 2 |

The first vertical slice (GAME_LANE GL-11: enter → inspect → mirror → tape → recap)
covers scenes 1.2 through 3.2 side A. Nothing in this map widens the slice.

---

## 2 · New canon rows added with this pass (status `IDEA`)

- `narrative_beats.csv`:
  - `BEAT_ARGUMENT_RESIDUE_001`. `PROP_LOCKET_001` already depended on it, but the row was missing until now.
  - `BEAT_DOUBLE_OCCUPANCY_001`
  - `BEAT_FINAL_MEMORY_LOCK_001`
  
  These match the six-beat arc the site already shows.
- `EOVSRoomState`: `STATE_01_RESIDUE`, `STATE_05_DOUBLE_OCCUPANCY`, `STATE_06_MEMORY_LOCK`.
  They are **appended** after the three existing values, so the stored numbers 0/1/2 (and
  GL-04's expected log `OVSRoomState: 0 -> 1`) don't change.
- `mechanics_registry.csv`: `MECH_HIDE_001` (Hide Spot).

The parity check (`npm run validate:production`) enforces all of these across CSV, site and C++.

---

## 3 · Endings in the game

DRYA always signs "as it happened"; that choice is hers, not the player's. The player picks
THOREAU's line:

| Player signs | Result | Ending |
|---|---|---|
| "As we remember it" | The lines differ, so they haven't agreed | **STAY**, the screenplay ending |
| "As it happened" | They agree and the door opens | **OPEN**: THE OTHER finds the room empty |

Failure never kills the player. If THE OTHER sees THOREAU during the hide, **he does another
take: the room rewinds** to the start of the scene, the way Tape 03 replaces a restart
screen with a blackout.

---

## 4 · The pasted Hitman prototype code, translated

The code you pasted was written for a Hitman-style prototype (`HITMANPROTOTYPE_API`,
disguises, stashing bodies). LIKENESS has no combat, no bodies and no guards (Tape 03
doctrine; STORY_BIBLE §10), so each part was rebuilt for this game in the existing
`LikenessTheGame` module:

| Pasted part | What LIKENESS uses it for | Staged as |
|---|---|---|
| Part 1: outfit swap with **Set Skeletal Mesh Asset + Set Leader Pose Component** | The technique is right. THE OTHER shares THOREAU's rig (canon: no new mesh), so modular wardrobe pieces become the tell: camcorder strap, chain worn outside the tee, the "pre-camera" jacket for THOREAU | `UOVSWardrobeComponent`: named outfits, data-set in Details, applied in C++ with the leader pose |
| Part 2: `IInteractableInterface` | One interface for closet, door, phone and coffee | `IOVSInteractable` (BlueprintNativeEvent `Interact`, `CanInteract`, `GetInteractVerb`) |
| Part 2: `UClosetComponent::TryStashBody` | **The player hides, not a body.** THOREAU hides in the slatted closet; the view locks to a camera behind the slats; movement and look are frozen; the pawn is tagged `OVS_Hidden` | `UOVSHideSpotComponent` (`MECH_HIDE_001`) |
| "Press [E] to Stash Body" prompt **vs** AI guards and map-wide alarms | **The prompt, kept minimal:** one verb ("Inspect", "Hide", "Leave") in the existing inspect widget, shown only within reach. **No guards and no alarms:** THE OTHER is scripted (Level Sequence) and the room's response is a rewind, not a search | `UOVSInteractorComponent` now drives an optional `TXT_Prompt` and binds an Enhanced Input action, so no Blueprint graph is needed |

A note on the pasted closet code: it called `SetActorLocation` right after
`AttachToActor(... SnapToTarget ...)`, which is redundant, and it held raw `AActor*` in a
`TArray`. Neither matters now because that component isn't used. The staged code uses
`TWeakObjectPtr` for references it doesn't own.

PC install and verification: `handoff/unreal/cpp_rowstructs/INSTALL_HIDE_AND_WARDROBE.md`
(GAME_LANE GL-15).

---

## 5 · Candidate mechanics from the screenplay (not canon yet)

- **Two lights:** under tungsten an object shows the remembered version; under the teal
  seam it shows the true one. The locket's smile is the first case.
- **The rewind:** THE OTHER's camcorder rewinds the room as diegetic retry. It's needed for
  the hide; generalize it only after it's proven.
- **The count:** the hallway dance as rhythm traversal on floor marks.
- **Room attention:** the Hitman translation from intake 006 §4. The lamp going out is its
  first tier.
