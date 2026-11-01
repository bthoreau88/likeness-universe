# G01C.1 — ORIGINAL WITNESS AUDIO CAPTURE & BLIND-TEST EXECUTION
**OVS OS / LIKENESS : THE OBSERVERS / ELSEWORLD V001**
**State: CAPTURE PACKET ISSUED / RECORDINGS NOT RECEIVED / TEST NOT EXECUTED / HUMAN REVIEW HOLD**

## Hard boundary
The previous G01C track used nonverbal tones, NOT two witness performances. No valid listener test may use that version to claim the witness-count audio proof has passed. No casting, recording, participant recruitment, or comprehension responses have been performed by this gate.

## Capture design: original, non-expository
**Scene:** Fictional municipal records annex. Two original offscreen witnesses. One records clerk. The third person is absent. No V008 cast, props, dates, phone numbers, or Recorder A/B.

| Source | Take | Spoken line / action | Timing target | Mic perspective |
|---|---|---|---|---|
| W1 | A01 | "They told us to wait here." | 00:54.0 | close, natural, seated left |
| W2 | B01 | "How long?" | 00:56.6 | close, natural, seated right |
| W1 | A02 | "I don't know." | 00:58.5 | close, natural, seated left |
| ROOM | R01 | 60 s of continuous room tone, no dialogue | independent | fixed room mic |
| POCKET | P01 | Re-record W1/W2 playback acoustically through a real small speaker into separate device, leaving an unvoiced gap where third witness is alleged | 00:52–01:06 | phone/portable recorder, not a digital EQ-only duplicate |
| FOLEY | F01 | Paper feed, stamp, chair, cup placement as separately labeled sources | picture-dependent | isolated close mic |

**Crucial temporal repair:** In G01B the 00:52–01:06 section is the playback of earlier testimony, not the original moment of capture. The original event can be represented in 00:00–00:25 via two intelligible, minimal utterances; the pocket playback in 00:52–01:06 repeats the same lines. The transcript must falsely report a third witness without inventing a third voice. Edit the paper animatic accordingly before testing.

## Recording specification
- Record at 48 kHz / 24-bit PCM mono per isolated microphone, with 5 s handles; no clipped peaks, no destructive denoise, no baked-in reverb.
- Peak target around -12 dBFS during tracking; log actual peaks and noise floor. No need to normalize raw masters.
- Keep original raw WAVs immutable; compute SHA-256 for each; label performer consent and recording location separately, without committing private information.
- Suggested filenames: `OBS_G01C1_W1_A01_RAW.wav`, `OBS_G01C1_W2_B01_RAW.wav`, `OBS_G01C1_ROOM_R01_RAW.wav`, `OBS_G01C1_POCKET_P01_RAW.wav`.
- Audio ownership: obtain consent from every performer; no cloning of a recognizable voice; no uploading unconsented recordings to third-party generators.
- Audio editing: separate room, dialogue, Foley, pocket playback, music (empty), and printmaster stems. Playback must have a real device-space perspective, not simply filtering the master.
- Mix intelligibility before adding atmospheric pressure; keep no score and no scare stinger. Deliver 48 kHz 24-bit WAV printmaster and viewing MP4.

## Two evidence invariants
1. **Witness count:** Two physically present, two distinct voices, exactly two on original attendance slip; CCTV chair remains empty. Certified transcript says THREE. Never allow an extra human vocalization in room tone.
2. **Causal agency:** The clerk *chooses* to certify the contradictory record and then puts down a third cup. The audience should understand institutional compliance, not infer a visible supernatural occupant.

## Blind comprehension: preregistered protocol
- Recruit **five independent, consenting adults**, unfamiliar with the pilot, its plot, and the intended twist. Do not recruit anyone who helped write, mix, edit, or storyboard it.
- Provide same locked cut once, on a phone or laptop with functioning headphones at comfortable level; record device and whether they used captions. Do not pause, replay, or explain before the form.
- Immediately collect individual, uncoached answers to:
  1. How many witnesses were physically present?
  2. Which pieces of evidence disagreed?
  3. Who decided which account became official?
  4. Why was a third cup placed by the empty chair?
  5. What, if anything, was confusing?
- Score Q1–Q4 independently, 0 or 1 each. Q1=two; Q2=certified transcript THREE versus slip TWO/CCTV empty/audio two; Q3=clerk verifies; Q4=clerk follows institutional record despite contradictory evidence. Accept equivalent wording. Preserve verbatim free text; do not reinterpret after seeing totals.
- **Acceptance threshold:** >=4/5 participants achieve >=3/4, AND >=4/5 identify the clerk's agency in Q3 or Q4 (at least one correct agency response). Any incorrect Q1 from >=2 people is an automatic spatial clarity failure.
- No claim of statistical generalizability from n=5. This is a formative usability check, not population research.

## Response register template
| Participant ID | Cut SHA-256 | Device / captions | Q1 | Q2 | Q3 | Q4 | Total /4 | Agency yes/no | Confusion (verbatim) |
|---|---|---|---|---|---|---|---|---|---|
| P01 | PENDING | PENDING | — | — | — | — | — | — | — |
| P02 | PENDING | PENDING | — | — | — | — | — | — | — |
| P03 | PENDING | PENDING | — | — | — | — | — | — | — |
| P04 | PENDING | PENDING | — | — | — | — | — | — | — |
| P05 | PENDING | PENDING | — | — | — | — | — | — | — |

## QC and decision ladder
- A: Capture files received and verified, consent/provenance logged.
- B: Edit with original voices, export stems and checksum-locked viewing cut.
- C: Internal audio/visual QC: audible distinct voices, no hidden third speaker, spatial chair continuity, readable slip/transcript, agency action visible.
- D: Five unbriefed viewer sessions; preserve anonymized responses.
- E: Score preregistered thresholds and report failures.
- F: Human review. Only then classify G01C.1 PASS or REVISE. No automatic G01D authorization.

**CURRENT VERDICT: PREPRODUCTION PACKET COMPLETE; GATE ON HOLD FOR ORIGINAL AUDIO AND REAL PARTICIPANTS.**
No paid generation. No canon promotion. No merge. Existing SECOND HAND V008 remains unchanged.
