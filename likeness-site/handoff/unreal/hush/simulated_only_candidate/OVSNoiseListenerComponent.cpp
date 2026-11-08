// OVSNoiseListenerComponent.cpp
// GL-19R.1: isolated simulated-only candidate, not compiled or installed.
// No AudioCapture, AudioMixer, sound submix, microphone, engine input-device access,
// state registry, level sequence, actor performance, or rewind logic in this component.

#include "OVSNoiseListenerComponent.h"
#include "Engine/World.h"
#include "GameFramework/Actor.h"

DEFINE_LOG_CATEGORY_STATIC(LogOVSNoise, Log, All);

UOVSNoiseListenerComponent::UOVSNoiseListenerComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
}

void UOVSNoiseListenerComponent::BeginPlay()
{
    Super::BeginPlay();
    UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: microphone OFF (simulated source only) on %s"),
           *GetNameSafe(GetOwner()));
}

void UOVSNoiseListenerComponent::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    Disarm();
    Super::EndPlay(EndPlayReason);
}

float UOVSNoiseListenerComponent::NowSeconds() const
{
    // All temporal logic uses the same game-world clock.
    const UWorld* World = GetWorld();
    return World ? World->GetTimeSeconds() : 0.0f;
}

void UOVSNoiseListenerComponent::Arm()
{
    if (bArmed)
    {
        return; // cannot bypass refractory by rearming the same hide session
    }
    bArmed = true;
    RefractoryUntil = 0.0f;
    // Intentionally preserve DeafUntil, so no replay/stinger tail leaks through
    // an immediate hide re-entry.
    UE_LOG(LogOVSNoise, Verbose, TEXT("OVSNoise: armed (simulated only)"));
}

void UOVSNoiseListenerComponent::Disarm()
{
    bArmed = false;
    RefractoryUntil = 0.0f;
}

void UOVSNoiseListenerComponent::Deafen(float Seconds)
{
    if (!FMath::IsFinite(Seconds) || Seconds <= 0.0f)
    {
        return;
    }

    DeafUntil = FMath::Max(DeafUntil, NowSeconds() + Seconds);
}

void UOVSNoiseListenerComponent::ReportNoise(float MarginDb, FName Reason)
{
    if (!bArmed || bBroadcasting || !FMath::IsFinite(MarginDb))
    {
        return;
    }

    const float Now = NowSeconds();
    if (Now < DeafUntil || Now < RefractoryUntil)
    {
        return;
    }

    // Enforce sane ordering even if later edited in a Blueprint default.
    const float Minor = FMath::Max(0.0f, MinorThresholdDb);
    const float Major = FMath::Max(Minor, MajorThresholdDb);
    if (MarginDb < Minor)
    {
        return;
    }

    const EOVSNoiseTier Tier = (MarginDb >= Major)
        ? EOVSNoiseTier::Major
        : EOVSNoiseTier::Minor;

    // Set refractory before broadcast to suppress immediate reentrant events.
    RefractoryUntil = Now + FMath::Max(0.0f, RefractorySeconds);
    bBroadcasting = true;
    UE_LOG(LogOVSNoise, Log, TEXT("OVSNoise: %s +%.1f dB (simulated, %s)"),
           Tier == EOVSNoiseTier::Major ? TEXT("MAJOR") : TEXT("minor"),
           MarginDb, *Reason.ToString());

    OnThresholdBreached.Broadcast(Tier, MarginDb, EOVSNoiseSource::Simulated, Reason);
    bBroadcasting = false;
}
