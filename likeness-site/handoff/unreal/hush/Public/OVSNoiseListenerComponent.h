// OVSNoiseListenerComponent.h — noise layer for MECH_HIDE_001 (PROPOSED, not canon).
// Spec: handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md · decision pending GL-19.
//
// STAGED OUTSIDE the compile-checked LikenessTheGame module on purpose. Install per
// INSTALL_NOISE_LISTENER.md only after GL-19 approves it and GL-15 has a PC passback.
//
// One rule set, three sources. Every source reports a noise MARGIN in dB; the component
// tiers it and broadcasts. It never knows (or cares) which source produced the sound.
//
//   Simulated (default, Milestone 2) ── ReportNoise(MarginDb) ──┐
//   Microphone (opt-in, post-G05, OFF) ── submix envelope ──────┼─► tier ─► OnThresholdBreached
//                                                               │           (Minor / Major)
//   Sustain mode (story inversion, if approved) ────────────────┘─► OnSustainedVoice
//
// Mic path, when bUseMicrophone is true:
//   UAudioCaptureComponent ─(base submix)→ AnalysisSubmix → envelope follower (audio thread)
//   → FOnSubmixEnvelopeBP (game thread) → cache → TickComponent → dB margin vs calibrated floor.
// Native Unreal audio mixer only. If Wwise is adopted, the mic path moves to Wwise Audio
// Input + a meter RTPC; the simulated path is unaffected.
//
// Exposure (0–5), the ladder and the rewind are NOT owned here. The hide beat's Level
// Sequence / director listens to OnThresholdBreached and decides. This keeps the
// unresolved ROOM_ATTENTION / ROOM_TRUST / ROOM_MEMORY contract untouched.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "OVSNoiseListenerComponent.generated.h"

class UAudioCaptureComponent;
class USoundSubmix;

UENUM(BlueprintType)
enum class EOVSNoiseTier : uint8
{
	Minor UMETA(DisplayName = "Minor (heard something)"),
	Major UMETA(DisplayName = "Major (seen → rewind)")
};

UENUM(BlueprintType)
enum class EOVSNoiseListenMode : uint8
{
	Spike,   // hide beat: sounds are mistakes
	Sustain  // inversion beat (if approved): speaking is the answer
};

UENUM(BlueprintType)
enum class EOVSNoiseSource : uint8
{
	Simulated,
	Microphone
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_FourParams(FOnOVSNoiseBreached, EOVSNoiseTier, Tier, float, MarginDb, EOVSNoiseSource, Source, FName, Reason);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnOVSNoiseCalibrated, float, FloorDb);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnOVSSustainedVoice);

UCLASS(ClassGroup = (OVS), meta = (BlueprintSpawnableComponent), DisplayName = "OVS Noise Listener")
class LIKENESSTHEGAME_API UOVSNoiseListenerComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UOVSNoiseListenerComponent();

	// ═════════════ SOURCE ═════════════

	/** OFF by default (GAME_LANE §5: no microphone in the first slice). When false, no
	 *  audio device is opened and only ReportNoise() can produce events. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "OVS|Noise|Microphone")
	bool bUseMicrophone = false;

	/** Mic only. Dedicated analysis submix; Envelope Follower Attack ≈ 5 ms, Release ≈ 80 ms. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "OVS|Noise|Microphone", meta = (EditCondition = "bUseMicrophone"))
	TObjectPtr<USoundSubmix> AnalysisSubmix;

	/** Mic only. Found on the owner or created at BeginPlay if empty. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "OVS|Noise|Microphone", meta = (EditCondition = "bUseMicrophone"))
	TObjectPtr<UAudioCaptureComponent> CaptureComponent;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Noise|Microphone", meta = (ClampMin = "0.5", Units = "s"))
	float CalibrationSeconds = 3.0f;

	// ═════════════ THRESHOLDS (shared by every source) ═════════════

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Noise", meta = (ClampMin = "1.0"))
	float MinorThresholdDb = 8.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Noise", meta = (ClampMin = "1.0"))
	float MajorThresholdDb = 20.0f;

	/** Mic only: level must stay over threshold this long. Rejects single clicks. */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Noise", meta = (ClampMin = "0.0", Units = "s"))
	float AttackSeconds = 0.033f;

	/** Dead time after any event so one sound counts once. Applies to every source. */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Noise", meta = (ClampMin = "0.0", Units = "s"))
	float RefractorySeconds = 1.2f;

	/** Mic sustain mode: continuous time over MinorThresholdDb that counts as speaking. */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Noise", meta = (ClampMin = "0.1", Units = "s"))
	float SustainSeconds = 0.6f;

	// ═════════════ EVENTS ═════════════

	UPROPERTY(BlueprintAssignable, Category = "OVS|Noise")
	FOnOVSNoiseBreached OnThresholdBreached;

	UPROPERTY(BlueprintAssignable, Category = "OVS|Noise")
	FOnOVSNoiseCalibrated OnCalibrated;

	UPROPERTY(BlueprintAssignable, Category = "OVS|Noise")
	FOnOVSSustainedVoice OnSustainedVoice;

	// ═════════════ CONTROL ═════════════

	/** Start listening (bind to UOVSHideSpotComponent::OnHideChanged → true). */
	UFUNCTION(BlueprintCallable, Category = "OVS|Noise")
	void Arm(EOVSNoiseListenMode Mode = EOVSNoiseListenMode::Spike);

	/** Stop listening (hide exit, rewind, any stinger). */
	UFUNCTION(BlueprintCallable, Category = "OVS|Noise")
	void Disarm();

	/** Ignore all sources for N seconds (game audio tail, transitions). */
	UFUNCTION(BlueprintCallable, Category = "OVS|Noise")
	void Deafen(float Seconds);

	/** SIMULATED SOURCE. Report a sound as a margin in dB (e.g. early exhale = 10,
	 *  hanger knock = 12, gasp when breath runs out = 25). Same tiers and refractory as the mic.
	 *  Reason is logged and passed through (e.g. "Exhale", "Hanger", "Gasp"). */
	UFUNCTION(BlueprintCallable, Category = "OVS|Noise")
	void ReportNoise(float MarginDb, FName Reason);

	/** SIMULATED SOURCE for sustain mode (e.g. a "speak" input if the inversion beat is approved). */
	UFUNCTION(BlueprintCallable, Category = "OVS|Noise")
	void ReportSustainedVoice();

	/** Mic only. Average the room floor; disarms for the duration. */
	UFUNCTION(BlueprintCallable, Category = "OVS|Noise|Microphone")
	void StartCalibration();

	UFUNCTION(BlueprintPure, Category = "OVS|Noise")
	bool IsArmed() const { return bArmed; }

	UFUNCTION(BlueprintPure, Category = "OVS|Noise|Microphone")
	bool IsMicCalibrated() const { return bCalibrated; }

	UFUNCTION(BlueprintPure, Category = "OVS|Noise|Microphone")
	float GetFloorDb() const { return FloorDb; }

	/** Mic margin above floor right now (meters / debug). 0 when the mic is off. */
	UFUNCTION(BlueprintPure, Category = "OVS|Noise|Microphone")
	float GetMicMarginDb() const { return CurrentMarginDb; }

protected:
	virtual void BeginPlay() override;
	virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

private:
	UFUNCTION()
	void HandleSubmixEnvelope(const TArray<float>& Envelope);

	void StartMicrophone();
	void StopMicrophone();
	void EnsureCaptureComponent();
	void FinishCalibration();
	void ProcessMicSpike(float DeltaTime, float Now);
	void ProcessMicSustain(float DeltaTime);

	/** Shared gate + tier + broadcast for every source. Returns true if an event fired. */
	bool Classify(float MarginDb, EOVSNoiseSource Source, FName Reason, float Now);

	float NowSeconds() const;
	static float AmplitudeToDb(float Amplitude);

	// mic signal (written by envelope callback on the game thread, read in Tick)
	float LatestAmplitude = 0.0f;
	bool bHasEnvelope = false;
	float CurrentMarginDb = 0.0f;
	bool bMicRunning = false;
	bool bCreatedCapture = false;

	// calibration
	bool bCalibrating = false;
	bool bCalibrated = false;
	float CalibrationElapsed = 0.0f;
	TArray<float> CalibrationPower;
	float FloorDb = -200.0f;

	// gating
	bool bArmed = false;
	EOVSNoiseListenMode ListenMode = EOVSNoiseListenMode::Spike;
	float OverThresholdTime = 0.0f;
	float RefractoryUntil = 0.0f;
	float DeafUntil = 0.0f;
	float SustainTime = 0.0f;
	bool bSustainFired = false;
};
