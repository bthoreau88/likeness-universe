# Asset fast lanes — source most of Room 14, make only what's costly

Extends [ASSET_SOURCING.md](ASSET_SOURCING.md) (decision rule, cost formula, distribution
rules). That doc says *how* to decide; this one applies it to the Room 14 kit so a session
can start placing assets instead of searching. Nothing here is purchased, downloaded or
approved — every row is a starting lane, and each file still needs its license recorded
at download time per [ASSET_SOURCING.md](ASSET_SOURCING.md).

## The rule in one line

**Make only what carries identity or story; source or adapt everything a player would
call "furniture."** A mechanic is never blocked on final art — a greybox proxy ships the
mechanic, the asset swaps in later under the same ID.

Timebox: 30 minutes of search per item. Nothing passes → place a proxy, log the gap, move on.

---

## Make list (the only things worth authoring)

| What | ID | Why it can't be bought | Cheapest honest path |
|---|---|---|---|
| THOREAU face + performance | `CHR_THOREAU_001` | Identity lock; the game is about his likeness | MetaHuman base Brandon already owns + identity work; performance via MetaHuman Animator |
| DRYA face + performance | `CHR_DRYA_001` | Identity + dignity lock | `handoff/expansions/character_refs/DRYA_BUILD_PACKET.md` |
| DARK THOREAU | `CHR_DARK_THOREAU_001` | Same identity, wrong timing/posture/gaze | **No new mesh** — animation and timing on THOREAU's rig |
| The black device | `PROP_DEVICE_001` | Unique readable silhouette | Proxy now; model once its interaction is proven |
| Mirror lag | `MECH_MIRROR_LAG_001` | It's a mechanic, not an asset | Code (GAME_LANE GL-05); the frame itself is sourced |
| Evidence surfaces | `PROP_KEY14_001`, `PROP_LOCKET_001`, `PROP_TAPE_001` | The worn "14" tag, the tintype, the tape label carry story | Source the shell; author only the decal/texture (hours, not days) |
| Dellwood signage + room number | `LOC_DELLWOOD_ROOM14_001` | Brand text | 2D texture on a sourced sign/door mesh |
| Impossible-room variants | `LOC_DELLWOOD_ROOM14_001` | Layout is the antagonist | Level design work with sourced pieces, not new assets |

Everything below is sourced or adapted.

---

## Room 14 kit — where to look first

"Dressing" rows have no canon ID on purpose: they are procurement candidates, not game
entities. Give one a canon ID in `handoff/data/asset_manifest.csv` only when gameplay
needs to reference it (the parity check will then enforce it everywhere).

| Item | Canon ID | Strategy | Try first | Then |
|---|---|---|---|---|
| Walls, ceiling, trim (modular) | room shell | source | Fab motel/apartment modular kits | Greybox cubes already placed |
| Carpet, plaster, wallpaper, tile | — dressing | source | ambientCG / Poly Haven materials (CC0) | Megascans surfaces on Fab |
| Grime, water stains, cigarette burns | — dressing | source | Megascans decals on Fab | ambientCG |
| Bed + headboard, nightstand, chair | — dressing | source | Fab vintage furniture; Poly Haven models | Sketchfab (per-model license) |
| Tungsten bedside lamp | — dressing | source | Poly Haven / Fab | Sketchfab |
| CRT TV | — dressing | source | Sketchfab / Fab | BlenderKit |
| Curtains | — dressing | adapt | Any sourced curtain + Blender cloth sim | Simple plane + cloth material |
| Door, chain lock, peephole | — dressing | source | Fab door packs | Sketchfab |
| Bathroom sink, toilet, tub | — dressing | source | Fab bathroom packs; Poly Haven | Sketchfab |
| Mirror frame | `PROP_MIRROR_001` | source | Poly Haven / Fab | Any rectangular frame |
| Brass key + fob | `PROP_KEY14_001` | adapt | Sketchfab / Fab key | Author the "14" tag only |
| Locket | `PROP_LOCKET_001` | adapt | Sketchfab / Fab jewelry | Author the tintype image |
| Cassette | `PROP_TAPE_001` | adapt | Sketchfab / Fab cassette | Author the label |
| Already on the PC | various | reuse | Fab downloads: Apartment Tech Props, Glasses, Realistic Rendering | Paragon Morigesh and Tentacles VFX are off-tone; keep out of production |
| Old LIKENESS builds and assets | various | reuse after triage | [LEGACY_SALVAGE.md](LEGACY_SALVAGE.md): archive, inventory, triage by folder | Most furniture/material folders retire in favor of CC0; your own source files and recordings are kept |
| Night exterior HDRI | — lighting | source | Poly Haven HDRIs (CC0) | — |
| Room tone, HVAC hum, fluorescent buzz | `AUDIO_ROOM14_PLAN_001` | reuse → source | Existing OVS recordings; Freesound (check each file's license) | Sonniss GDC bundles (read the bundle license) |
| UI type | — UI | source | Google Fonts (check each family's license) | — |
| Placeholder animation | — prototype | source | Mixamo with an Adobe account (prototype locomotion only) | Unreal template animations |
| Blockout props | — prototype | source | Kenney, Quaternius (CC0 low-poly) | Unreal starter content |

---

## Channel notes (Unreal / Blender specific)

These add to the channel table in [ASSET_SOURCING.md](ASSET_SOURCING.md). Terms change;
record the license text you actually saw at download.

| Channel | Use for | Watch |
|---|---|---|
| **MetaHuman** (inside UE 5.8) | THOREAU / DRYA base rig, grooms, Animator | Epic's MetaHuman terms; identity work is still ours |
| **Fab** (Epic marketplace, includes Megascans) | Modular kits, furniture, scans, decals | License and price are per listing; some free listings are time-limited claims — claim, then record |
| **Unreal template / starter content** | Blockout, placeholder animation | Already in the project; fine for prototype |
| **Poly Haven** (also has a Blender add-on) | CC0 models, materials, HDRIs | Record asset URL + hash |
| **ambientCG** | CC0 materials | Pick resolution deliberately (2K hero, 1K web) |
| **BlenderKit** (in-Blender library) | Fast material/prop trials inside Blender | License per asset; free and paid tiers |
| **Sketchfab** | Specific props (CRT, cassette, key) | Each model has its own license; prefer CC0 / CC-BY |
| **Kenney / Quaternius** | CC0 blockout | Prototype look only |
| **Mixamo** | Placeholder locomotion, auto-rig tests | Prototype only; never identity performance |
| **Freesound / Sonniss** | Ambience, mechanical transients | Freesound license varies per file; read Sonniss bundle terms |
| **Paid generation** (Higgsfield, FAL, Meshy and similar) | Concept frames, texture ideas, rough meshes to retopologize | Costs credits; output rights follow each provider's terms; never for THOREAU/DRYA identity meshes |

**Trap:** some well-known free libraries are non-commercial (for example, many BBC sound
effects). "Free to download" is not "free to ship."

---

## Session flow (fits GAME_LANE GL-07)

1. Pick 5–8 rows from the kit table, not the whole table.
2. For each: 30-minute search → download → record provider, listing URL, license text,
   date, SHA-256 in the asset's `<asset_id>/v001/source/` folder (see [BLENDER.md](BLENDER.md)).
3. Blender pass only if needed (scale to 1 m reference, pivot, material cleanup).
4. Import into `Content/OVS_LIKENESS/10_Art_Staging/` — never production folders.
5. Place in a sandbox copy of the map, screenshot, passback.
6. Add an `asset-plan.json` decision only for canon-ID items; dressing stays in the passback.

Restricted or paid source files stay off this public repository — only license records
and permitted captures come back here.
