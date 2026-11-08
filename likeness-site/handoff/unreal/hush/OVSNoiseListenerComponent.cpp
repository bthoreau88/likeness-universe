// OVSNoiseListenerComponent.cpp — noise layer for MECH_HIDE_001 (PROPOSED, not canon).
// Spec: handoff/mechanics/MECH_HIDE_NOISE_PROPOSAL.md

#include "OVSNoiseListenerComponent.h"

#include "AudioCaptureComponent.h"
#include "Sound/SoundSubmix.h"
#include "GameFramework/Actor.h"
#include "Engine/World.h"

DEFINE_LOG_CATEGORY_STATIC(LogOVSNoise, Log, All);

UOVSNoiseListenerComponent::UOVSNoiseListenerComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
	PrimaryComponentTick.bStartWithTickEnabled = false; // only ticks when the mic is running
	PrimaryComponentTick.TickGroup = TG_PrePhysics;
}

// ═════════════════════════════════════════════════════════════════════════════
//  LIFECYCLE
// ═════════════════════════════════════════════════════════════════════════════

void UOVSNoiseListenerComponent::BeginPlay()
{
	Super::BeginPlay();

	if (bUseMicrophone)
	{
		StartMicrophone();
	}
	else
	{
		// Proof line for passbacks: the slice must never open an audio device.
		UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: microphone OFF (simulated source only) on %s"), *GetNameSafe(GetOwner()));
	}
}

void UOVSNoiseListenerComponent::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
	bArmed = false;
	StopMicrophone();
	Super::EndPlay(EndPlayReason);
}

void UOVSNoiseListenerComponent::StartMicrophone()
{
	if (!AnalysisSubmix)
	{
		UE_LOG(LogOVSNoise, Error, TEXT("OVSNoise: bUseMicrophone is on but AnalysisSubmix is empty — mic disabled."));
		return;
	}

	EnsureCaptureComponent();
	if (!CaptureComponent)
	{
		return;
	}

	// Route the mic into the analysis submix BEFORE Start() — routing is read on start.
	CaptureComponent->SoundSubmix = AnalysisSubmix;

	// Envelope follower runs on the audio render thread; the BP delegate is dispatched to
	// the game thread, so HandleSubmixEnvelope only caches and never decides.
	AnalysisSubmix->StartEnvelopeFollowing(this);
	FOnSubmixEnvelopeBP EnvelopeDelegate;
	EnvelopeDelegate.BindUFunction(this, GET_FUNCTION_NAME_CHECKED(UOVSNoiseListenerComponent, HandleSubmixEnvelope));
	AnalysisSubmix->AddEnvelopeFollowerDelegate(this, EnvelopeDelegate);

	CaptureComponent->Start();
	bMicRunning = true;
	SetComponentTickEnabled(true);

	UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: microphone ON (opt-in) — calibrate before arming"));
}

void UOVSNoiseListenerComponent::StopMicrophone()
{
	if (!bMicRunning)
	{
		return;
	}
	bMicRunning = false;
	SetComponentTickEnabled(false);

	if (CaptureComponent)
	{
		CaptureComponent->Stop();
	}
	if (AnalysisSubmix)
	{
		AnalysisSubmix->StopEnvelopeFollowing(this);
	}
	if (bCreatedCapture && CaptureComponent)
	{
		CaptureComponent->DestroyComponent();
		CaptureComponent = nullptr;
		bCreatedCapture = false;
	}
}

void UOVSNoiseListenerComponent::EnsureCaptureComponent()
{
	if (CaptureComponent)
	{
		return;
	}
	AActor* Owner = GetOwner();
	if (!Owner)
	{
		return;
	}

	CaptureComponent = Owner->FindComponentByClass<UAudioCaptureComponent>();
	if (CaptureComponent)
	{
		CaptureComponent->bAutoActivate = false;
		return;
	}

	UAudioCaptureComponent* NewCapture = NewObject<UAudioCaptureComponent>(Owner, TEXT("OVSNoiseMicCapture"));
	NewCapture->bAutoActivate = false;
	NewCapture->bAllowSpatialization = false; // the mic is not "in" the world
	NewCapture->RegisterComponent();
	if (USceneComponent* Root = Owner->GetRootComponent())
	{
		NewCapture->AttachToComponent(Root, FAttachmentTransformRules::KeepRelativeTransform);
	}
	CaptureComponent = NewCapture;
	bCreatedCapture = true;
}

// ═════════════════════════════════════════════════════════════════════════════
//  SIMULATED SOURCE — the Milestone 2 path
// ═════════════════════════════════════════════════════════════════════════════

void UOVSNoiseListenerComponent::ReportNoise(float MarginDb, FName Reason)
{
	if (ListenMode != EOVSNoiseListenMode::Spike)
	{
		return;
	}
	Classify(MarginDb, EOVSNoiseSource::Simulated, Reason, NowSeconds());
}

void UOVSNoiseListenerComponent::ReportSustainedVoice()
{
	if (!bArmed || ListenMode != EOVSNoiseListenMode::Sustain || bSustainFired || NowSeconds() < DeafUntil)
	{
		return;
	}
	bSustainFired = true;
	UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: sustained voice (simulated)"));
	OnSustainedVoice.Broadcast();
}

// ═════════════════════════════════════════════════════════════════════════════
//  SHARED TIER LOGIC — every source goes through here
// ═════════════════════════════════════════════════════════════════════════════

bool UOVSNoiseListenerComponent::Classify(float MarginDb, EOVSNoiseSource Source, FName Reason, float Now)
{
	if (!bArmed || Now < DeafUntil || Now < RefractoryUntil)
	{
		return false;
	}
	if (MarginDb < MinorThresholdDb)
	{
		return false; // below the room's notice: shallow breathing, cloth
	}

	const EOVSNoiseTier Tier = (MarginDb >= MajorThresholdDb) ? EOVSNoiseTier::Major : EOVSNoiseTier::Minor;
	RefractoryUntil = Now + RefractorySeconds;

	UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: %s +%.1f dB (%s, %s)"),
		Tier == EOVSNoiseTier::Major ? TEXT("MAJOR") : TEXT("minor"),
		MarginDb,
		Source == EOVSNoiseSource::Microphone ? TEXT("mic") : TEXT("simulated"),
		*Reason.ToString());

	// The hide beat's director owns exposure, the ladder and the rewind.
	OnThresholdBreached.Broadcast(Tier, MarginDb, Source, Reason);
	return true;
}

// ═════════════════════════════════════════════════════════════════════════════
//  MICROPHONE SOURCE — opt-in, post-G05
// ═════════════════════════════════════════════════════════════════════════════

void UOVSNoiseListenerComponent::HandleSubmixEnvelope(const TArray<float>& Envelope)
{
	float Peak = 0.0f;
	for (const float Value : Envelope)
	{
		Peak = FMath::Max(Peak, FMath::Abs(Value)); // loudest channel counts
	}
	LatestAmplitude = Peak;
	bHasEnvelope = true;
}

void UOVSNoiseListenerComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	if (!bMicRunning || !bHasEnvelope)
	{
		return;
	}

	const float Now = NowSeconds();
	const float LevelDb = AmplitudeToDb(LatestAmplitude);

	if (bCalibrating)
	{
		CalibrationPower.Add(LatestAmplitude * LatestAmplitude);
		CalibrationElapsed += DeltaTime;
		if (CalibrationElapsed >= CalibrationSeconds)
		{
			FinishCalibration();
		}
		return;
	}
	if (!bCalibrated)
	{
		return;
	}

	CurrentMarginDb = LevelDb - FloorDb;

	if (!bArmed || Now < DeafUntil)
	{
		OverThresholdTime = 0.0f;
		return;
	}

	if (ListenMode == EOVSNoiseListenMode::Sustain)
	{
		ProcessMicSustain(DeltaTime);
	}
	else
	{
		ProcessMicSpike(DeltaTime, Now);
	}
}

void UOVSNoiseListenerComponent::ProcessMicSpike(float DeltaTime, float Now)
{
	if (Now < RefractoryUntil)
	{
		return;
	}
	// Attack: the level must STAY over the minor line before it counts.
	if (CurrentMarginDb >= MinorThresholdDb)
	{
		OverThresholdTime += DeltaTime;
	}
	else
	{
		OverThresholdTime = 0.0f;
		return;
	}
	if (OverThresholdTime < AttackSeconds)
	{
		return;
	}
	OverThresholdTime = 0.0f;
	Classify(CurrentMarginDb, EOVSNoiseSource::Microphone, TEXT("Mic"), Now);
}

void UOVSNoiseListenerComponent::ProcessMicSustain(float DeltaTime)
{
	if (bSustainFired)
	{
		return;
	}
	if (CurrentMarginDb >= MinorThresholdDb)
	{
		SustainTime += DeltaTime;
		if (SustainTime >= SustainSeconds)
		{
			bSustainFired = true;
			UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: sustained voice (mic, %.2f s)"), SustainTime);
			OnSustainedVoice.Broadcast();
		}
	}
	else
	{
		SustainTime = 0.0f; // any gap resets — a cough is not an answer
	}
}

void UOVSNoiseListenerComponent::StartCalibration()
{
	if (!bMicRunning)
	{
		UE_LOG(LogOVSNoise, Warning, TEXT("OVSNoise: StartCalibration() with the mic off — ignored."));
		return;
	}
	bArmed = false;
	bCalibrating = true;
	CalibrationElapsed = 0.0f;
	CalibrationPower.Reset();
	CalibrationPower.Reserve(FMath::CeilToInt(CalibrationSeconds * 120.0f));
}

void UOVSNoiseListenerComponent::FinishCalibration()
{
	bCalibrating = false;
	if (CalibrationPower.Num() == 0)
	{
		UE_LOG(LogOVSNoise, Warning, TEXT("OVSNoise: calibration got no samples — is the mic open?"));
		return;
	}

	// Trimmed mean of POWER (drop loudest 20%) so a cough can't make the game deaf.
	CalibrationPower.Sort();
	const int32 Keep = FMath::Max(1, FMath::FloorToInt(CalibrationPower.Num() * 0.8f));
	double Sum = 0.0;
	for (int32 i = 0; i < Keep; ++i)
	{
		Sum += CalibrationPower[i];
	}
	const float MeanPower = static_cast<float>(Sum / Keep);
	FloorDb = (MeanPower > 1e-20f) ? 10.0f * FMath::LogX(10.0f, MeanPower) : -200.0f;
	bCalibrated = true;

	UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: floor locked at %.1f dB (%d samples)"), FloorDb, CalibrationPower.Num());
	OnCalibrated.Broadcast(FloorDb);
}

// ═════════════════════════════════════════════════════════════════════════════
//  CONTROL
// ═════════════════════════════════════════════════════════════════════════════

void UOVSNoiseListenerComponent::Arm(EOVSNoiseListenMode Mode)
{
	if (bUseMicrophone && bMicRunning && !bCalibrated)
	{
		UE_LOG(LogOVSNoise, Warning, TEXT("OVSNoise: Arm() before mic calibration — simulated source only until calibrated."));
	}
	ListenMode = Mode;
	bArmed = true;
	OverThresholdTime = 0.0f;
	SustainTime = 0.0f;
	bSustainFired = false;
}

void UOVSNoiseListenerComponent::Disarm()
{
	bArmed = false;
	OverThresholdTime = 0.0f;
}

void UOVSNoiseListenerComponent::Deafen(float Seconds)
{
	DeafUntil = FMath::Max(DeafUntil, NowSeconds() + FMath::Max(0.0f, Seconds));
	OverThresholdTime = 0.0f;
}

float UOVSNoiseListenerComponent::NowSeconds() const
{
	// Real time: audio ignores time dilation, and slow-mo must not stretch the gates.
	const UWorld* World = GetWorld();
	return World ? World->GetRealTimeSeconds() : 0.0f;
}

float UOVSNoiseListenerComponent::AmplitudeToDb(float Amplitude)
{
	return (Amplitude > 1e-10f) ? 20.0f * FMath::LogX(10.0f, Amplitude) : -200.0f;
}
