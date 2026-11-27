# Receipt — CF-0 THOREAU canon selection rule and CF-0b capability recommendation

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Law | `CHARACTER_FIDELITY_LAW_V001.md` §7–§8 (proposed, PR #39) |
| Tasks | GAME_LANE GL-20 (CF-0) and GL-21 (CF-0b) |

## CF-0 — canon THOREAU MetaHuman (founder delegated the pick)

**Founder (2026-11-27):** "I'm not sure, but most are only slightly changed — maybe just the outfit switched with Marvelous Designer. So that's whatever you choose for now. It should be the newer ones; look for words like FINAL."

**Known from GL-13 (2025-10-25 inventory, receipt `2026-10-25-GL-13-legacy-inventory.md`):**
- `Thorea_MEta_Iden` exists 9 times in at least 5 revisions (310–996 MB, 2024-05 → 2025-07) across character projects.
- There is also a separate `Brandon` MetaHuman and a dressed `MT_THBXY`, the newest at 2025-07-21.
- Exact paths are withheld from the public repo and are kept in the workstation salvage folder (`TRIAGE_PROPOSAL.md`).

**Selection rule.** The next MSI session applies it mechanically, read-only, with nothing opened in the editor:
1. **Candidates:** every THOREAU MetaHuman asset folder (`Thorea_MEta_Iden*`, `MT_THBXY`, and any other THOREAU-named MetaHuman). `Brandon` is a separate identity and is not a candidate.
2. **Prefer the newest candidate whose project, folder or asset name contains `FINAL`** (case-insensitive). If none contains it, take the newest by last-write time of the face assets.
3. **Face, not outfit.** Hash the face and head meshes and textures of each candidate.
   - Copies whose face is identical to the pick and that differ only in clothing (Marvelous Designer outfits) are recorded as **outfit variants** of the canon face. They are not competing identities.
   - Copies with a different face are recorded as **REFERENCE** revisions.
4. **Write the result** to a GL-20 receipt: the chosen path (private; the public receipt gets a label and hashes only), its SHA-256 manifest, and the variant and reference lists.
5. **Archive, never delete.** The other copies stay exactly where they are until an archive destination exists, because GL-13 step 0 is blocked on disk space. Then they are copied out with SHA-256s, and the originals are left in place.

**Status:** the rule is approved by founder delegation. The pick itself is **pending**: the MSI was offline on 2026-11-27. This choice is provisional ("for now") and can be revised at the CF-6 identity check (Q10).

## CF-0b — capability route (recommendation; awaiting founder approval)

**Constraint:** funds are limited for now.

**Recommendation: upgrade in house first; outsource later, and only narrowly. No second machine.**

| Priority | Item | Why | Approve? |
|---|---|---|---|
| 1 | **RAM upgrade to 64 GB** in the MSI Raider GE78HX 13VG. The slot count, current modules and the supported maximum are to be read from the machine before buying | Unblocks G06 (the UE 5.8 sandbox load), MetaHuman look-dev in UE, and 8K texturing in a single purchase | Founder |
| 2 | **External SSD** (≥ 1 TB) | GL-13 archive (~60 GB of keep-material) is blocked on disk space. The CF-0 "archive, don't delete" rule needs it | Founder |
| 3 | **Use what is already owned first** | GL-13 found: a purchased skin texture pack (214 PSDs, single-user licence); a custom MetaHuman build with source assets; two photogrammetry scan projects; ~494 loose head/body meshes. Licence terms must be checked before use | — |
| 4 | **Sculpt in Blender first** (owned). The law allows Blender sculpt if it passes the Q1 clay read | Avoids a ZBrush licence until Blender demonstrably falls short | — |
| 5 | **One texturing licence, later**, only once the THOREAU sculpt passes Q1: the lowest-cost tier of Substance 3D Painter or Mari. Current pricing to be verified at that time | Texturing is where Blender is weakest for AAA skin | Founder, later |
| 6 | **Outsource only if needed, once, capped:** if THOREAU fails Q3–Q6 (spec, subsurface, micro-detail, eyes) after the in-house pass, contract a single texture/look-dev pass on that one head under law §7 | The cheapest way to buy the hardest skill. No retainer | Founder, later |
| Not recommended now | A separate texturing workstation; a hero scan-studio session | Highest cost; not needed to learn where our in-house ceiling is | — |
