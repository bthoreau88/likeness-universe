# Install the hide spot, wardrobe and interact prompt (GAME_LANE GL-15)

This adds three things to the same `LikenessTheGame` module, all driven from Details panels
with no Blueprint graph wiring:

- `IOVSInteractable`: one interface for anything the player can use.
- `UOVSHideSpotComponent` (`MECH_HIDE_001`): THOREAU hides in the Room 14 closet.
- `UOVSWardrobeComponent`: modular outfit swaps on one rig via leader pose, which gives
  THOREAU and THE OTHER their wardrobe tells.

It also updates `UOVSInteractorComponent`: an optional `TXT_Prompt` ("E  Hide"), an Enhanced
Input binding, and setup that waits for the controller if it doesn't exist at BeginPlay.
Inspect behavior is unchanged. Story context: `handoff/story/SCREENPLAY_TO_GAME.md` §4.

**New UCLASSes mean a full build. Live Coding can't add them** (GAME_LANE trap). Close the editor first.

---

## 1 · Copy the source (editor CLOSED)

From `likeness-site/handoff/unreal/cpp_rowstructs/Source/LikenessTheGame/` into the game
project's `Source/LikenessTheGame/`:

| File | |
|---|---|
| `Public/OVSInteractable.h` | new |
| `Public/OVSHideSpotComponent.h`, `OVSHideSpotComponent.cpp` | new |
| `Public/OVSWardrobeComponent.h`, `OVSWardrobeComponent.cpp` | new |
| `Public/OVSInteractorComponent.h`, `OVSInteractorComponent.cpp` | overwrite |
| `Public/OVSRoomStateSubsystem.h` | overwrite: three states **appended**; existing values unchanged |
| `LikenessTheGame.Build.cs` | overwrite: adds `EnhancedInput` |

## 2 · Build

Build **LikenessTheGameEditor (Win64, Development)** the same way as before. Then verify:

```python
import unreal
for c in (unreal.OVSHideSpotComponent, unreal.OVSWardrobeComponent, unreal.OVSInteractorComponent):
    print(c.static_class().get_name())
```

## 3 · Interact input (about 2 minutes)

1. Content Browser → `Content/OVS_LIKENESS/Input/` → Input → **Input Action** `IA_OVS_Interact`
   (Value Type: Digital/bool).
2. Input → **Input Mapping Context** `IMC_OVS_Interact`: map `IA_OVS_Interact` → **E**.
3. On `BP_FirstPersonCharacter` → `OVSInteractor` component → set
   **Interact Action = IA_OVS_Interact** and **Interact Mapping Context = IMC_OVS_Interact**.

## 4 · Prompt text

In `WBP_OVS_InspectUI`, rename the existing static prompt TextBlock (`[E] Inspect`) to
**`TXT_Prompt`**. The component then sets it ("E  Hide", "E  Leave") and collapses it when
nothing usable is in reach. Layouts without `TXT_Prompt` keep working as before.

## 5 · The closet

1. Create `BP_OVS_HideSpot` (Actor) with a closet mesh as its root, then add:
   - a **Camera** placed inside, looking out through the slats (this becomes the view);
   - an **OVS Hide Spot** component.
2. The mesh must block the **Visibility** channel so the interact trace can find it.
3. Place one in `L_Dellwood_Room14`.

## 6 · PIE proof

1. Walk up to the closet: the prompt reads **E  Hide**. Press E: the view blends to the slat
   camera, movement and look freeze, and the log shows `OVSHide: … entered …`.
2. The prompt reads **E  Leave**. Press E: the view returns, you can move, and the log shows `left`.
3. Inspect on the five props still shows name and line as before.
4. Screenshots: the slat view, and the prompt in front of the closet.

## 7 · Wardrobe (optional for GL-15, needed before THE OTHER appears)

On the THOREAU character BP add **OVS Wardrobe**. Set **Leader Component Name** to the
body mesh component's name (`Body` on MetaHumans, `CharacterMesh0` on the template
character). Then add outfits, for example:

- `THOREAU_PRECAMERA`: `Torso` → jacket without strap
- `THE_OTHER_CAMCORDER`: `Torso` → jacket with camcorder strap

Call `ApplyOutfit` from the beat's Level Sequence, or set **Initial Outfit**. Leave
**Follow Leader** off for a MetaHuman face slot.

## Passback

Build result (exit code and any warnings), the class-name printout, the two log lines,
two screenshots, and the game commit hash.
