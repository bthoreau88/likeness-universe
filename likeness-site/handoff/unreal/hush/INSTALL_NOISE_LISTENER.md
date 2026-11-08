# Install: UOVSNoiseListenerComponent (MECH_HIDE_001 noise layer)

**Do not install yet.** Blocked on GL-19 (HUMAN approves the proposal) and GL-15 (hide
spot installed and verified on the PC). Spec: [MECH_HIDE_NOISE_PROPOSAL.md](../../mechanics/MECH_HIDE_NOISE_PROPOSAL.md).

Status: authored in the CLOUD lane, **not compiled**. Written against UE 5.x audio APIs
(`USoundSubmix::StartEnvelopeFollowing`, `AddEnvelopeFollowerDelegate`,
`USynthComponent::SoundSubmix`). Expect small signature drift on 5.8; a PC passback is
the proof.

## Files

| Staged here | Copy to (game project) |
|---|---|
| `Public/OVSNoiseListenerComponent.h` | `Source/LikenessTheGame/Public/` |
| `OVSNoiseListenerComponent.cpp` | `Source/LikenessTheGame/` |

Once approved, the CLOUD lane moves these into `cpp_rowstructs/Source/LikenessTheGame/`
so the staged module stays the single source (GAME_LANE trap 6: never re-derive on the PC).

## Build.cs (only when the file moves into the module)

Add to `PrivateDependencyModuleNames` in `LikenessTheGame.Build.cs`:

```csharp
"AudioMixer",    // USoundSubmix envelope following
"AudioCapture"   // UAudioCaptureComponent
```

Enable the **Audio Capture** plugin in the `.uproject`. Both are needed to compile even
though the microphone is off at runtime. If you'd rather not pull the plugin into the slice
at all, the simulated path can be split into its own component; ask the CLOUD lane.

## Build

New `UCLASS` → Live Coding will not pick it up (GAME_LANE trap 1). Close the editor, then:

```text
"C:\Program Files\Epic Games\UE_5.8\Engine\Build\BatchFiles\Build.bat" LikenessTheGameEditor Win64 Development -project="C:\OVS\LIKENESS_THE_GAME\LikenessTheGame\LikenessTheGame.uproject" -waitmutex
```

Must end with `Build succeeded`. Close browsers first (trap 2).

## Wire-up (closet actor, alongside UOVSHideSpotComponent)

1. Add **OVS Noise Listener** to the closet actor. Leave `bUseMicrophone` **off**.
2. `OnHideChanged(Pawn, true)` → `Arm(Spike)`. `OnHideChanged(Pawn, false)` → `Disarm()`.
3. Breath hold (simulated source), in the hide beat's director:
   - early release → `ReportNoise(10, "Exhale")`
   - look input while hidden → `ReportNoise(12, "Hanger")`
   - breath runs out → `ReportNoise(25, "Gasp")`
4. `OnThresholdBreached` → the director owns exposure (0–5), the presentation ladder and
   the rewind. Major or exposure 5 → existing rewind path, then `Deafen(1.5)`.
5. Any stinger or rewind audio → `Deafen(<tail seconds> + 1.5)`.

## Acceptance (PC passback)

- Log `OVSNoise: microphone OFF (simulated source only)` at BeginPlay.
- Hide, release early twice → `OVSNoise: minor +10.0 dB (simulated, Exhale)` ×2.
- Run out of breath → `OVSNoise: MAJOR +25.0 dB (simulated, Gasp)`, closet opens, rewind fires once.
- Leave the closet → further `ReportNoise` calls log nothing (disarmed).
- Windows privacy panel shows no app using the microphone during the session.

## Microphone (post-G05, opt-in only)

Create Sound Submix `SM_OVSNoiseAnalysis` (Envelope Follower Attack ≈ 5 ms, Release ≈ 80 ms),
assign it, set `bUseMicrophone` from a settings toggle (default off), and call
`StartCalibration()` on a silent 3 s beat before `Arm()`. Turn the submix output down
(≈ −80 dB) so the player never hears themselves. The margin is gain-invariant, but verify
`GetMicMarginDb()` moves when you speak; if it doesn't, measure at unity gain and parent the
submix to a muted one. Native audio mixer only: if Wwise is adopted, this path moves to
Wwise Audio Input + a meter RTPC.
