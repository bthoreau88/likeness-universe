// OVSNoiseListenerComponent.h
// GL-19R.1 · PROVISIONAL FOUNDER-APPROVED DESIGN · SIMULATED-ONLY SOURCE CANDIDATE.
// NOT COMPILED, NOT INSTALLED, NOT CANON PROMOTED.
// Do not place this file alongside the legacy mic-capable version in a compiled module.
// Source contract: ../GL-19R1_SIMULATED_ONLY_PREPARATION_V001.md

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "OVSNoiseListenerComponent.generated.h"

// Keep the legacy delegate shape for downstream review.
// Only Simulated exists in this Milestone 2 candidate.
UENUM(BlueprintType)
enum class EOVSNoiseTier : uint8
{
    Minor UMETA(DisplayName = "Minor"),
    Major UMETA(DisplayName = "Major (seen -> rewind)")
};

UENUM(BlueprintType)
enum class EOVSNoiseSource : uint8
{
    Simulated UMETA(DisplayName = "Simulated")
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_FourParams(
    FOnOVSNoiseBreached,
    EOVSNoiseTier, Tier,
    float, MarginDb,
    EOVSNoiseSource, Source,
    FName, Reason);

UCLASS(ClassGroup=(OVS), meta=(BlueprintSpawnableComponent), DisplayName="OVS Noise Listener (Simulated)")
class LIKENESSTHEGAME_API UOVSNoiseListenerComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UOVSNoiseListenerComponent();

    // A simulated rule magnitude, NOT a measurement of real sound.
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="OVS|Noise|Simulated", meta=(ClampMin="0.0"))
    float MinorThresholdDb = 8.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="OVS|Noise|Simulated", meta=(ClampMin="0.0"))
    float MajorThresholdDb = 20.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="OVS|Noise|Simulated", meta=(ClampMin="0.0"))
    float RefractorySeconds = 1.2f;

    UPROPERTY(BlueprintAssignable, Category="OVS|Noise|Simulated")
    FOnOVSNoiseBreached OnThresholdBreached;

    UFUNCTION(BlueprintCallable, Category="OVS|Noise|Simulated")
    void Arm();

    UFUNCTION(BlueprintCallable, Category="OVS|Noise|Simulated")
    void Disarm();

    UFUNCTION(BlueprintCallable, Category="OVS|Noise|Simulated")
    void Deafen(float Seconds);

    UFUNCTION(BlueprintCallable, Category="OVS|Noise|Simulated")
    void ReportNoise(float MarginDb, FName Reason);

    UFUNCTION(BlueprintPure, Category="OVS|Noise|Simulated")
    bool IsArmed() const { return bArmed; }

protected:
    virtual void BeginPlay() override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;

private:
    float NowSeconds() const;

    bool bArmed = false;
    bool bBroadcasting = false;
    float RefractoryUntil = 0.0f;
    float DeafUntil = 0.0f;
};
