# handoff/web/hush: noise-layer tuning rig (PROPOSED)

Spec: [MECH_HIDE_NOISE_PROPOSAL.md](../../mechanics/MECH_HIDE_NOISE_PROPOSAL.md) · decision GL-19.

Not part of the Next.js site. No route, registry or canon change. This is a measuring tool:
before anyone commits to microphone thresholds, find out where breathing, a whisper, a
cough and a gasp land in a real room.

| File | Role |
|---|---|
| `HorrorAudioMonitor.js` | Mic → 120 Hz high-pass → AnalyserNode → RMS at a fixed 60 Hz → dB margin above a 3 s calibrated floor → `onThresholdBreached({ tier })`. AGC and noise suppression off |
| `HideNoiseDirector.js` | Pure state machine for the 5-node HUSH matrix. Local names only: `EXPOSURE` 0–5, `STRAIN` 0–100. Spec for the Unreal hide-beat director |
| `index.html` | Tuning rig: meter, MINOR/MAJOR marks, exposure pips, event log |
| `hideNoiseDirector.test.mjs` | State-machine checks (slip ladder, quiet decay, seam-only swaps, rewind at 2, 3-fail convergence, strain tightening, survival, inversion) |

## Run

ES modules and `getUserMedia` need `localhost` or HTTPS. From `likeness-site/`:

```powershell
npx serve handoff/web/hush
# open the printed http://localhost:... URL, click "Open mic + calibrate", stay silent 3 s
node --test handoff/web/hush/hideNoiseDirector.test.mjs
```

The mic is processed locally in the browser. Nothing is recorded, stored or sent.

## Verified / not verified

- Verified in the CLOUD lane: state-machine checks pass in Node 22. In a 2026-10-28 run,
  headless Chromium with a synthetic mic calibrated at 60 Hz (180 ticks in 3 s) and routed
  N2 → N3 → rewind → N2 with no page errors.
- **Not verified:** any real microphone in any real room. The 8 / 20 dB thresholds are
  starting values.
