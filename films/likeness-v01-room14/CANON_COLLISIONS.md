# LIKENESS (V01): canon collision ledger

Compared against `claude/dreamy-hawking-VcoBe` @ `c53809b` (2026-11-05) and the recorded
SECOND HAND canon. **2026-11-06 update:** Brandon ruled **same continuity** (R1). Rows C1–C5 and C7 are therefore live
contradictions, and C8 is cleared for DRYA. A new top-priority collision, N1 (this film vs SKIN
OF ANOTHER on the same night), is added. See [`RULINGS_2026-11-06.md`](RULINGS_2026-11-06.md) for
the rulings and the proposed resolutions.

Most rows reduce to one question: **is this film the same continuity as the game and SECOND
HAND, or its own?** If it's its own (an elseworld), most rows become "no conflict, firewall
noted". If it's the same, the rows below are real contradictions.

| # | Area | This film (Bible V01) | What the repo holds now | Severity | Options |
|---|---|---|---|---|---|
| **C1** | Room 14 geometry | A large mid-century **suite**: main room with sofa and curtains left, desk lamp right, an attached kitchen, a bathroom through a door on the right, an interior hallway with a closet and a chain-lock door. No bed is mentioned | **G02 lock (APPROVED 2026-10-26):** interior 5.4864 × 3.81 × 2.5908 m (18 ft × 12 ft 6 in × 8 ft 6 in), bed left, window, entry and bathroom doors, dresser/TV, **mirror on the right wall**. No kitchen and no interior hallway fit that envelope | **High.** Two founder-locked Room 14s can't coexist in one continuity | (a) The film's Room 14 is its own continuity; (b) the film's "Room 14" is a different Dellwood unit (rename it); (c) the film's suite is how the room *presents* to this couple (the bible's Lynch rule: "the layout doesn't match itself"). That is lore, so it needs an explicit ruling |
| **C2** | What the doubles are | The doubles' truth layer is the withheld Director-Eyes-Only twist (source PDF §01) | `handoff/story/STORY_BIBLE.md` ("A Night for Four", a draft pending sign-off, GL-16): the doubles are **likenesses made by the room's device**, and THE OTHER (`CHR_DARK_THOREAU_001`) is the **real** Thoreau. The film's twist explains the doubles differently | **High** if same continuity | Pick one truth layer for Room 14, or rule the film's explanation as specific to its own continuity. The game draft is still unsigned, so this film could inform it |
| **C3** | The mirror rule | The mirror reflects the room at a **half-second delay**; the doubles in the mirror do **not** lag but show the wrong person | `MECH_MIRROR_LAG_001` plus the story bible: *"Mirrors show the original. The likeness moves first and the original's timing arrives late."* | Medium | They're compatible only with an explicit rule about whose timing lags. Write it once and use it in both places |
| **C4** | THOREAU identity lock | Gold **rimless oval** glasses, silver septum ring, left-ear gold hoop, charcoal Kangol driver's cap, ribbed gray-brown knit prayer shawl, gold chain and bracelet; early-to-mid 30s | `CHR_THOREAU_001`: **round gold glasses**, mustache and goatee, early 30s | Medium | A per-film wardrobe/eyewear variant (record it as a variant on the Character Reference Pack), or conform to the registry |
| **C5** | DRYA identity lock | **Deep brown** skin, heart-shaped face, **box braids** (an explicit change from VIGIL/ESTATE curls), teal-edged smoky liner, jeweled brow studs, septum, gold hoops, double gold chain with cross, black mock-neck | `CHR_DRYA_001`: **warm medium-brown** skin, dancer body language, jewelry/piercing detail | **Medium-high:** skin tone is identity geometry, not wardrobe | Rule which skin-tone description is canonical; record braids and makeup as a film variant |
| **C6** | Tool targets | Prompts target **Seedance 2.0** (Shots 1, 2, 10) and **Kling 3.0** (Shots 3–9) | The current OVS pipeline is Blender greybox → **Higgsfield / Seedance 2.5**, with timecoded multi-shot grammar | Low (process) | Port all ten prompts with the OVS timed-prompt standard before any generation; keep the originals as source |
| **C7** | Shared location with SECOND HAND | — | SECOND HAND V008 ends at the Dellwood Motel, pigeonhole 14, 2:11 a.m.; photograph twelve is the interview woman leaving Room 14 | Low to medium | Decide whether the couple's night is part of Room 14's history as SECOND HAND sees it (an easter-egg link) or kept separate |
| **C8** | Rights / provenance | Leads "locked from production stills", Images 1–10 | No intake record, rights record or file for these stills in this repo | **Blocking for generation** of any real-person likeness | Intake the ten stills (private), record who is depicted and the consent status under the Character Reference Pack rights gate |

## Internal inconsistencies in Bible V01 (fix in V02)

| # | Where | Issue |
|---|---|---|
| I1 | §05 skeleton, Shot 08 | Ref still is listed as **Image 9**, but Image 9 is the wall two-shot (Shot 09). Shot 08 is the bathroom mirror, so it should reference Image 3 / the mirror plate |
| I2 | §06 Shot 08 | "This is his version of Drya closing her eyes in Shot 07", but Shot 07's prompt never has Drya close her eyes. Add the beat to Shot 07 or change the note |
| I3 | §02 / §04 vs §07 | "Mirror reflects at a half-second delay" vs "the reflection does not lag". See C3 |
| I4 | Throughout | "Hotel" and "motel" are used interchangeably for the Dellwood. Pick one in the dialogue-facing text (the repo canon says motel) |
| I5 | §06 Shot 07 ref | Skeleton lists Image 5 for Shot 07, but §08's "what you already have" omits a Shot 07 reference (Image 5 is listed only as a DRYA portrait source) |
| I6 | §01 Lynch line | "The hotel is not a hotel" is a good line; keep it. Logged only so I4 doesn't remove it by accident |

## Ruling template (copy into a receipt at G01)

```
| # | Ruling | Status |
| C1 | | |
| C2 | | |
| C3 | | |
| C4 | | |
| C5 | | |
| C6 | | |
| C7 | | |
| C8 | | |
| SKIN OF ANOTHER link | | |
| Twist public / private | | |
```
