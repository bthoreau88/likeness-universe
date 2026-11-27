# LIKENESS : THE GAME — Character Fidelity Law V001

- **ID:** LKN-CHAR-FID-001
- **Date:** 2026-11-26
- **Status:** PROPOSED LAW. The founder directed this law on 2026-11-26. It becomes binding when its PR is reviewed and merged into `claude/dreamy-hawking-VcoBe`.
- **Scope:** every human character asset in LIKENESS : THE GAME that is seen on screen.
  - THOREAU, DRYA, DARK THOREAU and the real DRYA;
  - DESMOND and the other supporting cast;
  - any face that appears in an in-engine cinematic, a trailer or a marketing still.
- **Does not cover:**
  - AI image and video generation. That remains under the OVS-OS realism prompt module (`OVS_PHOTOREALISM_HUMAN_PERFORMANCE_PROMPT_MODULE_V001`, branch `codex/ovs-real-g01-photorealism-prompt-v001`) and the castkit / banana-pro skills.
  - Props and environments. Those stay under [ASSET_FAST_LANES.md](ASSET_FAST_LANES.md) and [ASSET_SOURCING.md](ASSET_SOURCING.md).
- **Does not authorise:** any purchase, licence, outsourcing contract, scan session or paid generation, any identity decision, or any canon change. Each of those still needs the founder's own approval.

## 1. The bar

**Founder direction (2026-11-26):**

> Character skin, texture and realism on par with Control, The Last of Us, GTA VI, Detroit: Become Human and Hitman, no matter how long it takes or what we need. Where we lack a capability we outsource or use another method that reaches the same result.

**The bar, stated as something we can test.** A hero face passes when an independent viewer, shown it as a still and in motion under three lighting set-ups (§6), does not read it as CG first. The viewer must also not be able to point to a specific weakness in the skin, eyes, teeth, hair or deformation.

**The benchmark games are a quality target, not a description of their pipelines.**
- What is publicly known is general. Several of these studios capture real, cast performers with 3D scanning and facial performance capture, and then refine the results by hand.
- This law does not claim any detail of their internal tools.
- **We match the result, not the studio.**

## 2. Where we came from (history; nothing is deleted)

| When | What existed | Evidence | Status under this law |
|---|---|---|---|
| Before 2026-10 | AI character references (castkit / banana-pro stills; identity sheets for THOREAU and DRYA) | `public/stills/*lock-sheet*`, `characters` pages | **Kept** as identity reference. Not a 3D source |
| Before 2026-10 | THOREAU as a MetaHuman inside the old UE projects, in **9 copies across 5+ revisions**; which one is canon was never decided | `receipts/2026-10-25-GL-13-legacy-inventory.md` | **Kept untouched.** Becomes the input to CF-0 (§8) |
| 2026-10-25 | Asset fast lanes: the face and performance are "make", via the MetaHuman base Brandon already owns plus identity work, with performance via MetaHuman Animator | [ASSET_FAST_LANES.md](ASSET_FAST_LANES.md) rows `CHR_THOREAU_001`, `CHR_DRYA_001`, `CHR_DARK_THOREAU_001` | **Kept and extended.** This law defines what "identity work" must reach |
| 2026-10-25 | DRYA build packet: route A (MetaHuman Creator, blockout) or route B (Blender or iPhone scan sculpt, then Mesh-to-MetaHuman, final) | `handoff/expansions/character_refs/DRYA_BUILD_PACKET.md` | **Kept.** Route B becomes the floor for heroes, and §4 adds the skin and texture stages it lacked |
| 2026-10 | Workstation plan: iPhone with Live Link Face and KIRI / RealityScan; Blender on the Mac; UE 5.8 on the MSI | `handoff/WORKSTATION_SETUP.md` | **Kept.** §7 adds the hardware gate for hero texturing |
| 2026-11 | No character fidelity standard. No texture spec, skin shader spec, lighting test or acceptance gate | — | **This document closes that gap** |

## 3. The reference workflow: what the founder's example shows

The founder supplied a four-image portrait study: an original fan-art likeness study of a film character. Its stated workflow is:
- **ZBrush** for the sculpt: forms, skin detail and expression;
- **Mari** for texturing: skin variation, subtle imperfections, surface detail;
- **Maya + Arnold** for scene set-up and offline rendering.

| Image | What it demonstrates | Lesson for us |
|---|---|---|
| 1 — base colour on the head, three views, no lighting | Even, believable skin tone. Colour lives in the texture, not the lighting. There is real variation: redness at the nose, ears and cheeks; pallor elsewhere | Albedo must be authored as data, under flat light and free of baked lighting. Check it in an unlit view |
| 2 — clay sculpt, three views | Primary form (skull, mass, fat) and secondary form (folds, jowls, brow) before any texture. Tertiary detail (pores, fine wrinkles) shows up even in clay | Form first. Sculpt detail must read in grey clay before texturing starts. This is the "camera-read gate" already used in our Blender work |
| 3 and 4 — final renders with eyes, low soft key light | Subsurface scattering, roughness that varies across the face, a specular breakup (sheen on forehead and nose, matte cheeks), wet eyes, and expression carried by brow and eyelid shape | Realism comes from the **specular and roughness** maps and the **eyes** as much as from colour. Judge it under a deliberately harsh light, not only a flattering one |

**Handling the reference (binding):**
- The four images are third-party fan art. The character's likeness belongs to a film production; the art belongs to its artist.
- They are used **only as a technique reference**.
- They are **not committed** to this public repository.
- They must never be used as likeness, texture or training input for an OVS character.
- No OVS character may resemble a real actor or public figure.
- If the founder wants the reference kept, record the artist's public link in the intake log, not the files.

## 4. The pipeline: a decision, not a menu

**Decision:**
- The MetaHuman rig and runtime stay, so that THOREAU and DRYA share one rig, one performance pipeline and one LOD set, as the DRYA packet already argues.
- Hero likeness, skin detail and textures are made **outside** MetaHuman Creator in an offline-grade sculpt-and-texture pipeline, like the reference, then brought onto MetaHuman topology.
- **MetaHuman Creator presets alone are not enough for heroes.**

```
 CF-1 IDENTITY SOURCE ─► CF-2 TOPOLOGY ─► CF-3 SCULPT ─► CF-4 TEXTURE ─► CF-5 ASSEMBLE ─► CF-6 LOOK-DEV & QC ─► CF-7 PERFORMANCE
 consented scan or        wrap onto        primary/         multi-channel    MetaHuman in      skin/eye/teeth      MetaHuman Animator
 original sculpt          MetaHuman mesh   secondary/       UDIM maps        UE 5.8 + groom    shaders, 3 lighting  + wrinkle maps,
                                           tertiary                                            rigs, A/B reference  body capture
```

| Stage | Required output | Tools — primary · allowed alternative | Outsourceable? |
|---|---|---|---|
| **CF-1 Identity source** | Either a **consented** photogrammetry or structured-light scan of a cast performer (with a signed likeness release), or an **original** sculpt matched to the founder-approved identity sheet. Neutral and expression set (at least neutral plus about 20 FACS-style poses) when scanning | RealityScan / KIRI (owned, iPhone) for test; a professional scan studio for heroes · ZBrush from reference for original faces | **Yes:** scan studio, or a likeness sculptor |
| **CF-2 Topology** | Head on MetaHuman-compatible topology, with the scan detail projected | MetaHuman Identity, Mesh-to-MetaHuman (in UE) · a topology-transfer wrapping tool | Yes |
| **CF-3 Sculpt** | Detail at three levels: primary (skull and mass), secondary (folds, jowls, brow), tertiary (pores, fine wrinkles, scars). Must pass the **clay read** (image 2 standard). Exported as displacement / normal at the UDIM level | **ZBrush** · Blender sculpt (accepted only if it passes the same clay read) | Yes |
| **CF-4 Texture** | Per-UDIM maps authored at **8K** (shipped smaller, §5):<br>• base colour without baked lighting;<br>• specular / roughness with regional breakup;<br>• cavity;<br>• displacement and micro-normal;<br>• subsurface / redness masks;<br>• colour-variation masks.<br>Scan-derived micro-detail is allowed only from licensed multi-channel skin data | **Mari** · Substance 3D Painter · Blender (cleanup and fixes only) | Yes |
| **CF-5 Assemble** | MetaHuman in UE 5.8 with custom textures applied, plus:<br>• grooms (hair, brows, lashes, peach fuzz);<br>• eyes (cornea, iris depth, wet line, occlusion);<br>• teeth and tongue;<br>• wrinkle-map hookup;<br>• body proportions | MetaHuman (UE 5.8) · groom from Blender or an external groom tool via Alembic. **Verify in 5.8** exactly which custom map inputs MetaHuman accepts, before CF-4 delivery | Groom: yes |
| **CF-6 Look-dev and QC** | Passes every check in §6 under the three lighting rigs | UE 5.8 (Lumen and Path Tracer). An offline renderer (Arnold or Cycles) is allowed for **reference look-dev only**. Game frames must be engine frames | Review only |
| **CF-7 Performance** | Facial performance through MetaHuman Animator (iPhone or a head-mounted rig); body capture; wrinkle maps driven by expressions; DARK THOREAU differs by **timing, posture and gaze only** (no new mesh, as in ASSET_FAST_LANES) | Live Link Face / MetaHuman Animator (owned) · a professional facial and body capture stage | **Yes:** capture stage |

**Why not Maya + Arnold end to end, as in the reference?**
- Arnold is an offline renderer. The game ships real-time frames.
- The reference workflow's *sculpt and texture* half (ZBrush → Mari) transfers directly.
- Its *render* half is replaced by UE 5.8 look-dev.
- Maya is optional. Use it only if a hired artist or a groom tool needs it.

## 5. Technical spec (minimum, hero characters)

| Item | Minimum |
|---|---|
| Head authoring resolution | 8K per UDIM for base colour, roughness / specular, displacement and cavity; 4K masks |
| Shipped resolution | Per the MetaHuman LOD budget for the target spec. Must be decided at CF-5 against measured frame time; never shipped below what passes §6 at the closest gameplay camera |
| Colour management | ACEScg or linear sRGB, declared per file. Base colour in sRGB, data maps linear. No baked light or AO in base colour |
| Naming | Follows `UE58_PACKAGE_ADOPTION_MAP.md` prefixes (`T_`, `M_`/`MI_`, `SK_`, `GROOM_`), plus `CHR_<ID>_<map>_<udim>_v###` |
| Source custody | Sculpt, texture and groom source files are versioned, hashed and kept **outside** the public repo. Only manifests and hashes are committed (identity assets are private) |
| Performance budget | Measured on the founder's real target hardware: frame time with the character at its closest gameplay camera, recorded in the receipt |

## 6. Acceptance gate — "on par" means passing all of this

**Three lighting rigs**, each a fixed, saved UE level, captured as a turntable and a still:
- **L1** neutral HDRI turntable;
- **L2** Room 14 in-game lighting (practicals, low key);
- **L3** harsh single hard key from 45°, the deliberately unflattering one.

| # | Check | Pass |
|---|---|---|
| Q1 | Clay read | Untextured sculpt reads as the approved identity at the closest camera |
| Q2 | Albedo | In an unlit view, skin tone is even, with natural regional variation; no baked shadows or highlights |
| Q3 | Specular and roughness | Regional breakup visible under L3: oily T-zone, matte cheeks. No uniform plastic sheen |
| Q4 | Subsurface | Ears, nostrils and lips transmit warm light under backlight. No waxy or "rubber" look under L1 |
| Q5 | Micro-detail | Pores and fine lines visible at the closest camera and stable in motion, with no swimming or shimmer |
| Q6 | Eyes | Wet line, cornea refraction, a correct catchlight and eye occlusion. No "dead eye" in any rig |
| Q7 | Teeth and mouth | Teeth not over-white; tongue and gum occlusion correct during speech |
| Q8 | Hair | Brows, lashes, peach fuzz and scalp hair hold up at the closest camera; no card edges visible |
| Q9 | Deformation | During the performance test, wrinkle maps engage; no intersections or collapsing volumes in the 20 test expressions |
| Q10 | Identity | Founder signs that it is THOREAU / DRYA (identity lock) and that it resembles no real person who has not consented |
| Q11 | Independent read | At least one reviewer outside the build team sees L1–L3 stills and a 10-second motion clip, uncoached. Observations are recorded verbatim, never invented |
| Q12 | Budget | Frame time recorded at the closest gameplay camera on target hardware |

**Evidence required:** the source files' SHA-256s, the three captures per rig, the reviewer notes, and the founder sign-off. A model or an agent describing a render as "photoreal" is **not** evidence.

## 7. Capability, hardware and outsourcing gates

| Need | Current | Gap | Path |
|---|---|---|---|
| Scan | iPhone with KIRI / RealityScan | Hero-grade multi-camera scan | Book a scan studio (outsource), or accept an original sculpt (CF-1 alt) |
| Sculpt | Blender (owned) | ZBrush licence and skill | Licence it, **or** outsource the likeness sculpt |
| Texture | Blender (owned) | Mari or Substance licence; licensed skin micro-detail data | Licence it, **or** outsource the texturing |
| Workstation | MSI, 15.7 GiB RAM. **UE 5.8 sandbox load still blocked on memory (G06)** | Hero texturing at 8K UDIMs and UE look-dev with a MetaHuman need much more memory than this machine has free today | **Founder decision:** RAM upgrade or a texturing workstation, or outsource CF-3 / CF-4 and keep only CF-5 to CF-7 in house |
| Performance capture | iPhone with Live Link Face | Head-mounted rig and body capture | MetaHuman Animator with iPhone first; a capture stage for hero cinematics |

**Outsourcing rules (all of them):**
1. A signed contract with IP assignment to OVS, and likeness releases for any scanned person.
2. A written deliverable spec, using §4 and §5 verbatim.
3. Deliverables pass §6 before acceptance.
4. Vendors receive only the identity sheet and this law, never other private production files.
5. Founder approval before any spend.

## 8. Where we are going — gated roadmap

| Gate | Work | Lane | Done when |
|---|---|---|---|
| **CF-0** | Pick the canon THOREAU MetaHuman from the 9 legacy copies (GL-13). Freeze the THOREAU and DRYA identity sheets | HUMAN + PC | Receipt naming the chosen asset, with its hash; the other 8 are archived, not deleted |
| **CF-0b** | Founder decides the capability route per stage (licence vs outsource) and the hardware route (§7) | HUMAN | Decision receipt |
| **CF-1 → CF-4** | THOREAU hero head through identity → topology → sculpt → texture | PC / vendor | Each stage's output plus hashes; the Q1 clay read passes before CF-4 starts |
| **CF-5 → CF-6** | Assemble in the UE 5.8 sandbox (after G06 passes); look-dev; full §6 gate | PC | Q1–Q12 evidence |
| **CF-7** | Performance test: one Room 14 line, captured and played in engine | PC + HUMAN | Q9 + Q11 on motion |
| Then | DRYA through the same gates (DRYA packet route B); supporting cast at a lighter tier, to be defined in V002 | — | — |

Nothing here unblocks the Room 14 vertical-slice finish line (G05) on its own. Character fidelity runs **in parallel** and must not block greybox, inspect or tape work.

## 9. Amendments

This is V001. Changes go through `CHARACTER_FIDELITY_LAW_V002` or an explicit amendment receipt. Silent edits are not allowed. Earlier documents named in §2 stay where they are and are superseded only where this law says so.
