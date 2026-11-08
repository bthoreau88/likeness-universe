# GL-19R.3 — HUSH Scene-Grounded Performance Cold Read V001

**Project:** LIKENESS : THE GAME · Room 14 · `MECH_HIDE_001` / `BEAT_DOUBLE_OCCUPANCY_001` / `STATE_05_DOUBLE_OCCUPANCY`  
**Founder direction:** Advance to GL-19R.3 after GL-19R.2 director contract PR #29.  
**Authority:** `handoff/story/A_NIGHT_FOR_FOUR.fountain` scene 3.3 (screenplay **draft**, GL-16 story sign-off pending), `SCREENPLAY_TO_GAME.md`, founder-provisional GL-19R design, GL-19R.2 director contract.  
**Status:** **DESK COLD READ / CONDITIONAL REVISION REQUIRED**. Not an acted performance, story approval, UE proof, gameplay pass, or canon change.

## Source-custody anchors (read before interpreting performance)

From actual screenplay in `A_NIGHT_FOR_FOUR.fountain` (Git blob `023d1ebbd0baf1f0e59421a0b86f8dc07f484981`):

- DRYA puts THOREAU into the slatted closet, which locks his viewpoint to its slats; `MECH_HIDE_001` establishes **seen → room rewinds**, **never death**.
- THE OTHER **enters with the camcorder against his chest**, sets it on a **small tripod on the dresser**, and adjusts the flip-out screen and framing. He is not alarmed by the half-room/half-apartment environment.
- THE OTHER talks to DRYA with a deliberate **one-beat lag**, then **sits in the desk chair**. He wants DRYA to follow an account he dictates; he responds to her resistance before the existing diegetic rewind.
- Later, in the draft, DRYA rejects his line. THE OTHER **stands, returns to the camcorder and presses REWIND**; this is an **existing story-motivated room rewind** independent of HUSH detection.
- After further DRYA refusal, THE OTHER **turns his head toward the closet and takes steps toward it**, already scripted, independently of any new HUSH `exposure` event.

**Important constraint:** The screenplay is **draft**, not a license to invent new dialogue or alter its causal engine. The HUSH design adds a conditional interactive disturbance to the same sequence but must not silently overwrite DRYA's agency or the original rewind/approach blocking.

## Source-grounded desk read: one actor, one primary and one secondary beat

The performance standard is **observable behavior**, not a UI reaction or jump-scare animation. Each triggered cue should have exactly one primary action and at most one secondary physical beat. Avoid a different facial expression/whip-look for each exposure point. THE OTHER behaves like a man trying to make a recording **as he intended**, with controlled annoyance at disruptions—not an omniscient guard hunting the player.

| Threshold | Primary physical behavior (cold-read candidate) | Secondary consequence | Actor/location condition | Authority |
|---|---|---|---|---|
| 0 / silent | Continues the script's camera setup / work with DRYA | None; slat POV static | Standard scene blocking | Existing draft scene |
| 1 / PAUSE start | Stops the **current task** for a brief, involuntary interruption | Holds listening attention without turning to the closet | During a live, interruptible task | GL-19R design; acting candidate |
| 2 / PAUSE extend | Resumes, then hesitates before finishing **the same action** | No duplicated jump or false repeated glance; the delay is different from threshold 1 | Must have a task to hesitate in | GL-19R three-family mapping, **not** new fourth family |
| 3 / CAMCORDER | Angles the **existing** flip-out screen toward the closet while checking framing | Lets the glance originate from the screen rather than an impossible sightline | **Only while at the tripod**; if seated, **hold/reblock**; no teleport | GL-19R family, blocking still provisional |
| 4 / APPROACH | Makes **one deliberate move toward the slats** while keeping his attention measured | If he is already standing at the tripod, do **not** play another stand-up; if seated, the stand must be motivated and staged first | Requires safe actor path, camera continuity and no scripted-beat conflict | GL-19R family, blocking still provisional |
| Major / exposure 5 | Invoke the existing seen → rewind pathway **once** | No death, no combat, no monster alert | Must win arbitration with draft's **scripted** rewind | GL-19R + existing mechanic |

### Cold-read blocking conflict A — camcorder proximity

If the player produces a minor noise after THE OTHER has sat at the desk, turning a screen on a dresser instantly is impossible. A simple threshold → montage mapping would snap his position or teleport the prop. **Reject unrestricted threshold playback.**

**Preferred preliminary rehearsal choice A:** Restrict the initial playable HUSH disturbance/proof to a clearly measured camera-setup opportunity in which THE OTHER is within reach of the tripod. This preserves the script's physical starting pose and allows PAUSE → CAMCORDER → APPROACH to remain actor-motivated. The opportunity's **length is not established by the screenplay**; it must be measured in animatic/blocking and checked against breath-hold timing, actor reach, and 1.2 s event cooldown. If the player can trigger exposure 3 after the actor sits, the proof **fails** unless a separately reviewed alternate blocking route exists.

**Deferred choice B:** If the hide beat must stay fully interactive after he sits, add an explicitly staged chair → dresser return to make stage 3 reachable; this is a genuine **reblocking change** requiring a separate story/directing review. Do not improvise it inside the HUSH director.

### Cold-read blocking conflict B — two legitimate rewind causes

The draft scene already rewinds DRYA's performance when she refuses THE OTHER's line. HUSH adds another rewind cause if the player is heard. The game cannot call two independent rewind handlers or run the diegetic tape again during a scripted rewind.

**Required owner contract:** The existing Room 14 rewind service accepts **at most one** committed rewind intent in the current decision interval. When SCRIPT and HUSH arrive **before commitment**, the story-owned scripted rewind takes precedence; once committed, a later request must not issue a second call. Reject uncommitted HUSH presentation cues upon rewind. Upon completion, confirm the chosen reset frame and pose from the actual source rather than assuming a one-size-fits-all restart.

### Cold-read blocking conflict C — approach already exists in source

THE OTHER's later turn toward the closet and steps toward it are motivated by his confrontation with DRYA. A HUSH-triggered approach cannot simply play the same steps twice. Reconcile shot/actor ownership and skip or defer optional HUSH approach when the existing dramatic beat owns movement. Do **not** reassign DRYA's role in making him turn.

## Eight required desk/performed cold-read scenarios

| ID | Performance test | Accept if | Reject if |
|---|---|---|---|
| P01 | No noise, camera setup through DRYA exchange | Original business and one-beat lag remain intact | Visible idle reset/pursuit without player input |
| P02 | Early exhale at camera setup | A brief hesitation with clear cause, no eye-line reveal | Immediate horror stare, generic attack cue |
| P03 | Second accepted exhale (>1.2 s) | Distinct extension of the **same** pause family | Identical repeated pause animation |
| P04 | Screen turn while camera is in reach | Screen motion physically motivated, screen continuity retained | Camera/prop teleports from dresser/chair |
| P05 | Threshold 3 while THE OTHER is seated | Cue visibly defers or is rejected with a documented alternate | Unmotivated stand/instant screen turn |
| P06 | Threshold 4 after camera turn | One clear approach without repeated stand-up | Duplicate source approach or sliding body |
| P07 | HUSH and SCRIPT rewind same moment | One committed rewind, correct owner, no new death | Two time jumps or double rewind playback |
| P08 | Return after rewind at exposure 2, then silence/another slip | Coherent reset pose, delayed next action; no replay of prior physical beats | Inconsistent tripod/seat/prop positions |

Performance tape/actor playback **has not been recorded or watched** in this review. All P01–P08 are **pending** real performance and blocking validation; do not mark them passed.

## Director performance notes — human review required

- Primary emotion: **territorial control of a recording**, not supernatural omniscience.
- Secondary defense: **maintain the facade of recording normally** until physical evidence makes that impossible.
- Read the pause from hands and tempo first; keep large head turns for a motivated camera/closet action.
- Avoid editor-invented breath dialogue, additional DRYA inversion, a new camera angle, or the five-node web prototype.
- Existing lamp tungsten / teal slat contrast, camcorder/tripod geometry, THE OTHER's starting position, DRYA's interruption and all approved character authorities remain unchanged.
- **No generation or paid motion** is needed at this gate. A later human acted/table read and zero-credit blocking proof determine whether family cues are physically/causally sound.

## Decision requested from human reviewer

**Recommendation:** Mark GL-19R.3 **REVISE / CONDITIONAL**, select rehearsal choice A as the limited initial test window, and do **not** authorize full-scene integration until P01–P08 can be performed and the rewind owner is identified.

This is an advisory selection, not an implicit modification of `STORY_BIBLE.md`, screenplay, `mechanics_registry.csv`, original game source, HUSH PR #27/#28/#29, or OVS-OS G06.
