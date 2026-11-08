# MECH_HIDE_001 · noise layer: proposal ("HUSH")

**Status: PROPOSED. Not canon.** No canon ID, CSV row, room state, or state alias is
added by this document. It answers [INSPIRATION_INTAKE_006.md](../../docs/production/INSPIRATION_INTAKE_006.md)
§4 candidates 1 (room attention) and 3 (hiding hold) for one scene only, and waits for
a HUMAN decision (GAME_LANE GL-19).

**Microphone status: OFF.** GAME_LANE §5 keeps microphone input out of the first slice,
and UNREAL.md says simulated noise supplies the sound input. This proposal keeps both rules.
The microphone path is staged as an opt-in for a later milestone, never as a default.

---

## 1 · The scene it serves

`A_NIGHT_FOR_FOUR.fountain`, scene 3.3 → `BEAT_DOUBLE_OCCUPANCY_001` ·
`STATE_05_DOUBLE_OCCUPANCY` · `MECH_HIDE_001` (Milestone 2 in `SCREENPLAY_TO_GAME.md`).

> DRYA (whisper): Whatever you see, don't come out. He can't see you if you don't move.

The hide spot already freezes movement and look, so "don't move" is already true. This
layer adds the other half of her line: **he can't find you if you don't make a sound.**
The player watches THE OTHER set up the camcorder through the slats, and the only thing
they can do wrong is be heard.

The existing rule stays exactly as written in `mechanics_registry.csv`: *seen = the room
rewinds, never death.* No combat, no bodies, no guards, no jump-scare kill.

---

## 2 · Inputs (one logic, three sources)

Every source produces the same thing, a **noise margin in dB**, which goes through the
same tier rules (§3). The logic never knows which source produced the noise.

| Source | Milestone | How it makes noise | Default |
|---|---|---|---|
| **Simulated: breath hold** | Milestone 2 (with GL-15) | A held input = holding breath. A strain meter fills while held. Releasing early = a quiet exhale (minor). Running out = a gasp (major). Not holding = shallow breathing, which the room ignores | **ON** |
| **Simulated: the closet** | Milestone 2 | Hangers. Any look input attempted while hidden (look is frozen) knocks a hanger: minor | ON |
| **Microphone** | After G05, opt-in only | Real mic, calibrated against the player's room. Same tiers | **OFF**: settings toggle, never forced |

The breath hold is the slice version. It needs no permissions or calibration, raises no
streamer problems, and is fully testable in PIE. The mic is the premium layer on top.

---

## 3 · Tier rules

Detection is a margin in dB above a calibrated floor (mic) or a fixed value per event
(simulated), so both feed the same thresholds.

| Tier | Margin | Effect while hidden |
|---|---|---|
| Ignore | < 8 dB | Nothing |
| Minor | 8–20 dB | Hide-local **exposure** +1 (0–5). 1.2 s refractory so one sound counts once. THE OTHER pauses, and his head turns a few degrees toward the closet |
| Major | ≥ 20 dB | Seen → the room rewinds (existing `MECH_HIDE_001` rule) |
| Exposure reaches 5 | — | Seen → rewind |

12 s of silence lowers exposure by 1. A rewind restores exposure to 2: the room remembers
you were there.

**Naming is deliberately local.** `exposure` is scoped to one hide session. Per
AUDIT_AND_INTAKE, `ROOM_ATTENTION` / `ROOM_TRUST` / `ROOM_MEMORY` stay distinct and
unaliased until a reviewed state-contract decision. If that decision adopts room
attention, exposure becomes one of its inputs; nothing here pre-empts it.

---

## 4 · Presentation (no new room states)

Exposure changes presentation inside `STATE_05_DOUBLE_OCCUPANCY`. It never creates a
state of its own:

| Exposure | What THE OTHER / the room does |
|---|---|
| 0 | Sets up the camcorder. Talks to DRYA, a beat late on every line |
| 1 | Pauses mid-line; finishes it a beat later than his usual lag |
| 2 | Lamp flickers once. He looks at the lamp, not at you |
| 3 | He turns the camcorder screen to face the closet, then turns it back |
| 4 | He stands. One step toward the slats. DRYA says something to pull him back |
| 5 / major | He opens the closet → the room rewinds |

Clip-free in Unreal: these are Level Sequence branches or animation montages driven by
`OnThresholdBreached`. On the web, they are the 8-second loop variants from the HUSH
package.

---

## 5 · Engine fit

- **Unreal:** `handoff/unreal/hush/`, `UOVSNoiseListenerComponent`. Staged **outside**
  the compile-checked `cpp_rowstructs` module, so GL-15 is untouched. Install doc lists the
  Build.cs dependencies it would add. Native audio mixer (submix envelope follower); the
  game has no Wwise yet (RESOURCE_ATLAS puts Wwise in polish weeks 17–26). **If Wwise is
  adopted later, the mic path must move to Wwise Audio Input + a meter RTPC.** The
  simulated path is engine-audio independent.
- **Web:** `handoff/web/hush/`. A vanilla ES module tuning rig (mic monitor + director)
  for measuring real rooms before anyone commits to mic thresholds. Not part of the Next.js
  site; no route or registry change.

---

## 6 · HUMAN decisions (GL-19)

1. Adopt the noise layer for `MECH_HIDE_001` at all? (If yes, it becomes a `qa_notes`
   addition to the existing row, not a new mechanic.)
2. Breath hold as the Milestone 2 input: yes / no / different input.
3. Exposure presentation ladder (§4): approve, edit, or cut to three steps.
4. Microphone as a post-G05 opt-in: yes / never.
5. DRYA "inversion" beat from the HUSH package: after the rewind or in a later scene,
   she asks whether he's still there, and silence becomes the wrong answer. Story-lane
   call; it touches `STORY_BIBLE.md`, so it is listed, not designed, here.

## 7 · Acceptance (once approved)

- PIE: hold breath through THE OTHER's camcorder setup with exposure 0 → no rewind.
- Release early twice → log `OVSNoise: minor` ×2, exposure 2, ladder steps 1–2 visible.
- Run out of breath → log `OVSNoise: MAJOR`, closet opens, rewind fires once (replay-safe).
- Mic toggle OFF by default in a fresh save; with it off, no audio device is opened.
