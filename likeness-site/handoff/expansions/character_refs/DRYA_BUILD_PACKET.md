# DRYA — Character Build Packet (CHR_DRYA_001)

The concrete UE 5.8 pipeline for building DRYA as a **MetaHuman**, matching the THOREAU
MetaHuman already in the project. Paste the step blocks as you go. Identity lock is law;
the 4-step reference gate comes first.

> **OVS law for this build:** Face is the budget. Drya is a counterpart and witness with
> emotional force — never decorative suffering, never a glamour model. Build from approved
> sheets, never from loose AI art.
>
> **2026-11-26:** route B (sculpt → Mesh-to-MetaHuman) is now the minimum for the final DRYA,
> and it must add the sculpt, texture and look-dev stages and the acceptance gate in
> `docs/production/CHARACTER_FIDELITY_LAW_V001.md`. Route A stays valid for blockout only.

---

## 0 · Why MetaHuman (not a from-scratch Blender character)

THOREAU is already a MetaHuman. Keep DRYA a MetaHuman too so they **share one rig, one
Live Link Face workflow, one LOD/groom pipeline**, and the same facial animation system.
Blender is used for the *head sculpt and the wardrobe*, not for a separate custom rig.

---

## 1 · Prerequisites (do once)

- **Quixel Bridge / Epic logged in** (the editor Login dialog must be signed in — Mesh-to-
  MetaHuman submits to the cloud and downloads the assembled rig through Bridge).
- **MetaHuman plugin enabled** (already in `.uproject`) + restart if you just enabled it.
- **DRYA 4-step references PASSED QC** — see `DRYA_4STEP.md`. You need at least the
  **Clean Sheet** (neutral A-pose, flat light, plain background) and the **Views**
  (front / side / 3⁄4 / back) before touching geometry. If those aren't approved, stop and
  finish them first.
- Identity lock (from `character_registry.csv` → `CHR_DRYA_001`):
  *Black woman, late 20s, warm medium-brown skin, dancer body language, jewelry/piercing
  details, guarded emotional presence.* **QC: no generic glamour drift.**

---

## 2 · Choose the head route

| Route | Use when | Likeness | Effort |
|-------|----------|----------|--------|
| **A · MetaHuman Creator** | blockout / first pass to get her in scenes now | close-ish | low |
| **B · Blender (or iPhone scan) sculpt → Mesh-to-MetaHuman** | the final, exact DRYA | exact | medium |

Recommended: **A to start blocking scenes, B for the canon hero asset.** Both end as a
MetaHuman, so swapping A→B later doesn't break the rig or animations.

---

## 3 · Route A — MetaHuman Creator (fast pass)

1. In UE 5.8: **Window → MetaHuman → MetaHuman Creator** (in-engine in 5.8; follow the
   plugin's prompts — exact menu wording can differ slightly from 5.7).
2. Pick the closest base preset, then sculpt to the **Clean Sheet + Views**: face shape,
   skin tone (warm medium-brown), brow, nose, lips, jaw, eyes. Hold the identity lock —
   do **not** drift toward a generic glamour preset.
3. Hair/groom: choose a close MetaHuman groom for now (refine in Route B / Blender later).
4. Assemble → it downloads through Bridge as a MetaHuman. Name it **`MH_Drya`**.
5. Park it in staging (Section 7) until QC.

---

## 4 · Route B — Blender sculpt → Mesh-to-MetaHuman (exact likeness)

### 4a · Get a head mesh
- **Sculpt in Blender** to the 4-step Views, **or**
- **Scan** with your iPhone (KIRI Engine / RealityScan) for a real-likeness base, then clean
  topology in Blender.
- Blender export settings for UE: **scale 1.0, metric, +Z up / -Y forward** (UE corrects on
  import), real-world head scale (~16–18 cm tall). Export **FBX** (or OBJ) — head only,
  neutral expression, mouth closed, eyes open, ears visible, no hair, symmetrical.

### 4b · Mesh-to-MetaHuman in UE 5.8
1. Import the head mesh into `/Content/OVS_LIKENESS/10_Art_Staging/Drya/`.
2. Create a **MetaHuman Identity** asset (right-click → MetaHuman → MetaHuman Identity).
3. **Components from Mesh** → pick your imported head → **Track Active Frame** (fit the
   facial markers to eyes/nose/mouth/jaw) → **MetaHuman Identity Solve**.
4. **Mesh to MetaHuman** → submits to the cloud → the rigged MetaHuman comes back through
   Bridge. Name it **`MH_Drya`**.
5. Body: set MetaHuman body type to match her dancer build (do not slim-drift). Wardrobe and
   the locket are authored in Blender (Section 5).

> If a 5.8 menu name differs from the above, follow the MetaHuman plugin's on-screen step
> order — the sequence (Identity → Components → Track → Solve → Mesh to MetaHuman) is stable.

---

## 5 · Wardrobe, jewelry, hair

- **Wardrobe** (deep olive/black layers, dancer drape): model in Blender as a **skeletal
  mesh** weighted to the MetaHuman body skeleton, or use Chaos Cloth. Export FBX with the
  MetaHuman skeleton as the reference. Materials named (`M_Drya_Garment_*`).
- **Locket** = `PROP_LOCKET_001` (already in `asset_manifest.csv`). Build it as a separate
  prop, attach to a neck socket — it is also a close-inspect evidence asset, so model it at
  inspect detail. Collision proxy `_COL` if needed.
- **Hair/groom:** refine in UE groom or author cards in Blender. Keep it readable in
  silhouette (a 4-step acceptance criterion).

---

## 6 · Share THOREAU's animation

DRYA is a MetaHuman, so she uses the **MetaHuman body/face skeleton** — the same animations,
Live Link Face captures, and control rig retarget straight onto her. No separate rig. Use an
**IK Retargeter** only if a clip was authored on a different proportion.

---

## 7 · Folder routing & naming (OVS conventions)

```
Staging:   /Content/OVS_LIKENESS/10_Art_Staging/Drya/   ← all WIP, Route A/B output
Approved:  /Content/OVS_LIKENESS/01_Characters/Drya/     ← only after QC passes
```
Names: `MH_Drya` (MetaHuman), `SK_Drya_Garment`, `M_Drya_Skin`, `M_Drya_Garment_*`,
`GROOM_Drya_Hair`, prop `SM_Locket` / `PROP_LOCKET_001`.

**Do not import into `01_Characters/` until QC passes.**

---

## 8 · QC gate (before promotion — from DRYA_4STEP.md)

- [ ] Identity holds: Black woman, late 20s, warm medium-brown skin — recognizable in
      silhouette + front + 3⁄4.
- [ ] **Dignity lock held** — no victim-only staging, no glamour drift.
- [ ] Body type consistent with the dancer build (no slimming drift).
- [ ] Jewelry + locket correct (`PROP_LOCKET_001`).
- [ ] Wardrobe matches the locked olive/black layers.
- [ ] Clean topology, named materials, real-world scale, clean UE import (no errors).
- [ ] Reads under the room's tungsten/teal lighting, not just neutral light.

---

## 9 · Registry update (close the loop)

When `MH_Drya` is promoted to `01_Characters/`:

1. `data/character_registry.csv` → row `CHR_DRYA_001`: set `model_folder` =
   `/Content/OVS_LIKENESS/01_Characters/Drya`, set `reference_folder` to the approved 4-step
   folder, flip `status` from `REF_IN_PROGRESS` toward `MODEL_IN_PROGRESS`/`MODEL_DONE`.
2. `data/asset_manifest.csv` → add/confirm a row for the DRYA model asset
   (`engine_path` filled), and ensure `PROP_LOCKET_001`'s `engine_path` points at the built
   locket.
3. Mirror the same status into the web registry (`src/lib/registry.ts`) so the companion and
   game don't drift. Commit: `data: promote CHR_DRYA_001 model`.

---

## 10 · Acceptance

DRYA is "in engine" when: `MH_Drya` stands in `Lvl_Room14` at correct scale, lit by the
room's practicals, holding the identity + dignity locks, with the locket attached and a
THOREAU-shared facial animation playing cleanly — and the registries point at her asset.
That is the entry condition for the Characters milestone (doubles, mirror-lag, gaze come
later — and the double `CHR_DARK_THOREAU_001` is built from posture/timing/gaze, never gore).
