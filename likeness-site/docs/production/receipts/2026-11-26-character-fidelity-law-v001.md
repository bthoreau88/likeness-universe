# Receipt — Character Fidelity Law V001 (proposed)

| Field | Value |
|---|---|
| Date | 2026-11-26 |
| Founder direction | AAA skin, texture and realism for LIKENESS : THE GAME characters, on par with Control, The Last of Us, GTA VI, Detroit: Become Human and Hitman. Outsource or use other methods where we lack capability. Record it as law. Be non-destructive: keep where we came from |
| Branch / base | `claude/lkn-char-fidelity-law-v001` from `claude/dreamy-hawking-VcoBe` @ `3a87155` |
| New file | `docs/production/CHARACTER_FIDELITY_LAW_V001.md` |
| Additive pointers (+24 lines, 0 removed) | `AGENTS.md`, `docs/production/README.md`, `GAME_LANE.md` (GL-20, GL-21, GL-22 + one note), `ASSET_FAST_LANES.md` (note), `DRYA_BUILD_PACKET.md` (note) |
| Canon / spend / identity / publish | None / zero / none / none |

## Reference intake — technique only, not committed

The founder supplied four JPEGs of a third-party fan-art portrait study of a film character. The stated workflow is ZBrush sculpt → Mari texture → Maya + Arnold render.

- The files are **not committed**: they are third-party art depicting a film character's likeness.
- They are recorded here by hash only, as a technique reference (law §3).
- The artist was not named in the supplied text. Record their public link if the founder wants attribution kept.

| Sender's name | Size | SHA-256 | Content |
|---|---|---|---|
| IMG_1104.jpeg | 800×600 | `a9efcc86e7c9b78a4d164524f12a2cafbf91fe1a1b9cf21213b9a158c323cad0` | Base-colour head, three views |
| IMG_1105.jpeg | 800×600 | `2ffbad0741f433cf70f5e19ba2ebfdfbd936bf444c79f505d72ad34fce2eb0ba` | Clay sculpt, three views |
| IMG_1106.jpeg | 800×800 | `35dfd3439e87e709ccf3e7b38bb867f023823ee7e26c8b2e2a050e03b2af6635` | Final render, three-quarter |
| IMG_1107.jpeg | 800×800 | `51afe975b809bcdfef7ff6098eec23839c8efc4a4479fe42b95ee932db29bce0` | Final render, frontal |

## Decisions the law records vs decisions still open

**Recorded (proposed):**
- MetaHuman remains the rig and runtime.
- Hero likeness, sculpt and textures are made in an offline-grade pipeline and must pass gate Q1–Q12 under three lighting rigs.
- Real-person likeness requires consent; no actor likeness.

**Open (founder):**
- CF-0: which of the 9 legacy THOREAU MetaHumans is canon.
- CF-0b: licence vs outsource per stage, and the hardware route. The MSI's 15.7 GiB RAM is a known constraint; G06 is still blocked on memory.
