# FD-001 — Journey Stage I "Found": Dellwood exterior concept brief, framing plan and visual QC sheet

- **Gate:** OVS-LKN-COORD-G01 V001, website workstream items 1 and 2.
- **Status:** concept and QC only.
  - No image generated, purchased or commissioned.
  - No site image changed.
  - No canon effect.
- **Audited source:** `claude/dreamy-hawking-VcoBe` @ `3a87155`.

## 1. Audit: current Journey Stage I image

| Check | Result | Evidence |
|---|---|---|
| Which image is used | `/stills/thoreau-stealth.png` (1672×941). PR #34 (`8b12322`) replaced `/stills/open-world-city.png` | `src/components/companion/Journey.tsx` STAGES[0]; regression check `journeyStageI.bg` |
| Combat HUD (ammo, reticle, health or infection meter) | **None visible.** The HUD was in the retired `open-world-city.png` | Visual inspection of the 1672×941 source; `evidence/2026-11-21-coord-g01/shots/journey_stage-I__desktop.jpg` |
| Weapons, bodies or guards | **None visible.** | Same |
| Retired image still served anywhere | `open-world-city.png` renders only on `/alt/`, which is labelled non-canon ("the abandoned open-world expansion…"). It is kept deliberately per `registry.ts:535` | `candidate-regression-summary.json` → `retiredMedia` |
| Fit to the stage copy | **Fails.** The copy reads `EXT · THE STREET — "A cassette on the pavement outside Room 14."` The image is an **interior** (kitchen counter and towel rail) at night, with Thoreau in a dark hooded garment with **armour-like shoulder and chest plating** and no cassette, street, motel or Room 14 door | Visual inspection |
| Tone risk | The armoured costume and stealth posture read as action or tactical gear. That is not a HUD violation, but it pulls against the "no combat" house rule and the "Found" beat | Founder to rule (§5, Q-E1) |

**Conclusion.** The combat-HUD contamination is gone. Stage I still lacks a purpose-made exterior, which is the reason for FD-001. The current image should stay as an interim placeholder until an approved exterior exists. Swapping in another existing still would not fix this: none of the 39 stills in `public/stills/` shows the Dellwood exterior with the cassette.

## 2. Concept brief — "Found"

**Beat.** The tape is found before anyone is. A cassette lies on the wet pavement outside Room 14. The exterior camera has logged it twice: at 03:14, and a minute earlier, which the timestamp cannot explain.

**One-line intent.** A quiet, ordinary motel exterior at 03:14 where the only wrong thing is a cassette that should not be there yet.

| Element | Requirement | Source |
|---|---|---|
| Location | The Dellwood: a two-storey 1960s motor lodge "gone soft at the edges". Ground-floor exterior walkway with the **Room 14 door** legible (brass or painted "14") | `A_NIGHT_FOR_FOUR.fountain` L144–146 (draft, GL-16 unsigned); Journey copy |
| Time and weather | Night, about 03:14. Rain has just stopped; the pavement is still wet and reflective | Bible V.002 §09 D01 ("Arrive at Dellwood in rain"); Journey copy |
| Hero object | One cassette on the pavement, face up, **no case**, label unreadable or blurred. It sits in the lower third, sharp, about 3–5% of frame width | Journey copy; GL-18 cassette proxy is the shape reference (100.4 × 63.8 × 12 mm) |
| Secondary signals | Neon "VACANCY" with a flickering "NO"; one exterior security camera on the eave with its tally light on; a sodium or teal practical lamp over the door | Screenplay L146; Journey copy (exterior cameras) |
| Figures | **None**, or at most a silhouette far behind a window. No faces, so identity locks are not triggered | OVS identity lock; "Found" is pre-character |
| Must not contain | Weapons, bodies, guards, police, blood, any HUD or UI overlay, game reticles, readable brand logos, readable licence plates, text other than "14" and the neon sign | House rules; FD-001; website acceptance |
| Palette | Graphite night (`#0a0b0d` base), cold teal practicals (`#6fc6d6`), one warm accent (`#e0531f`) from the neon or door lamp. Matches site tokens | `globals.css` |
| Format | 16:9 master at ≥ 2400×1350, delivered also as 1672×941 to match the current slot. Safe area: centre 60% for the cassette and door at the mobile crop | Journey section crops `object-cover` at 390 px wide |

## 3. Framing plan

| Shot | Lens / height | Composition | Use |
|---|---|---|---|
| **F1 (primary)** | 35 mm equivalent, camera at about 40 cm (low, pavement level) | Cassette sharp in the lower-left third. Room 14 door soft at the upper-right third. The walkway's leading line runs to the door. The neon reflects in the wet concrete between them | Journey Stage I background |
| F2 (alternate) | 24 mm, eave-mounted CCTV angle, high and wide, slight barrel distortion | The whole walkway with the cassette small, centre-left. Burned-in CCTV timestamp **only** as `03:14` / `03:13`, no other overlay | Alternate if the founder wants the "camera is a witness" read; note that it is an overlay, so §4 check V6 applies |
| F3 (insert) | 85 mm macro-ish, 15 cm off the ground | Cassette fills 40% of the frame; door number out of focus behind it | Home street-card or social crop; not required for Stage I |

**Mobile crop rule.** At 390×844 the Journey section uses a centre crop. F1 must keep both the cassette and the "14" inside the centre 60% of the frame width. Otherwise the 390 px view loses the story.

## 4. Visual QC sheet

The reviewer completes this per candidate image. Every item must be PASS before founder review.

| # | Check | Pass standard | Result |
|---|---|---|---|
| V1 | Exterior | Unmistakably outdoors at the Dellwood; no interior surfaces | ☐ |
| V2 | Room 14 | The door number "14" is legible at desktop and at the 390 px crop | ☐ |
| V3 | Cassette | Present, on the pavement, caseless, label unreadable, shape consistent with the GL-18 proxy | ☐ |
| V4 | Night 03:14 / wet | Night lighting; wet reflective ground; no daylight spill | ☐ |
| V5 | No combat | No weapon, body, guard, police, blood, injury or tactical gear | ☐ |
| V6 | No HUD | No game UI, reticle, ammo, meter, minimap or subtitles. A CCTV timestamp only for F2, and only "03:14"/"03:13" | ☐ |
| V7 | No identity risk | No recognisable face; no real person's likeness; no readable plates or brands | ☐ |
| V8 | Palette | Practicals in site teal and one burnt-orange accent; graphite blacks not crushed | ☐ |
| V9 | Technical | ≥ 2400×1350 master and a 1672×941 delivery; no AI artefacts (melted text, extra doors, warped railings); no compression banding | ☐ |
| V10 | Responsive | Screenshot review at 1440×900, 768×1024 and 390×844 in the Journey section, with the copy overlay readable (WCAG AA contrast on the overlay text) | ☐ |
| V11 | Provenance | Source, tool, settings and spend recorded in an intake receipt; zero paid generation unless separately authorised | ☐ |
| V12 | Retired media | The candidate does not reuse or derive from `open-world-city.png` or retired frames 013/022 | ☐ |

## 5. Decisions needed

- **Q-E1.** Does the armoured costume in `thoreau-stealth.png` conflict with the no-combat rule as an interim image? Options:
  - keep it until the exterior exists;
  - swap to a neutral existing still now. `hallway-door14.png` shows Room 14 but is an interior; it is already used by Stage II.
- **Q-E2.** Which production route for F1, all at zero spend:
  - an in-engine capture from the UE greybox once G06 clears;
  - a Blender scene like the GL-18 proxy;
  - an owned photograph.
- **Q-E3.** Should the screenplay's "neon VACANCY with flickering NO" become locked exterior canon? The screenplay is a GL-16 draft.
