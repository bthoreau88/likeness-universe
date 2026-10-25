// OVSInteractorComponent.h — data-driven inspect + interact for LIKENESS : THE GAME.
//
// Drop this component on the player pawn. Each tick-interval it line-traces from
// the player's view, and if it hits an actor tagged OVS_Interactable it reads that
// actor's other tag as an asset_id, looks the row up in the AssetManifest DataTable,
// and shows the inspect widget with the row's `name` + `inspect_text`.
//
// If the hit actor (or one of its components) implements IOVSInteractable, the widget's
// optional TXT_Prompt shows "<key>  <verb>" and the interact input calls it: the Room 14
// closet, a door, the phone. Set InteractAction (+ InteractMappingContext) to bind the
// input in C++, or call Interact() from your own input.
//
// No Blueprint graph wiring required — set InspectWidgetClass + AssetManifest in the
// component's Details panel and it runs itself.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "OVSInteractorComponent.generated.h"

class UUserWidget;
class UDataTable;
class UInputAction;
class UInputMappingContext;
class UEnhancedInputComponent;

UCLASS(ClassGroup = (OVS), meta = (BlueprintSpawnableComponent))
class LIKENESSTHEGAME_API UOVSInteractorComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UOVSInteractorComponent();

	// The inspect widget to show. Set to WBP_OVS_InspectUI.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Inspect")
	TSubclassOf<UUserWidget> InspectWidgetClass;

	// The registry DataTable to read names/inspect lines from. Set to DT_AssetManifest.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Inspect")
	UDataTable* AssetManifest = nullptr;

	// Reach of the inspect trace, in cm.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Inspect")
	float TraceDistance = 250.f;

	// How often (seconds) the inspect trace runs.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Inspect")
	float InspectInterval = 0.1f;

	// The tag that marks an actor as inspectable. The actor's OTHER tag is the asset_id.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Inspect")
	FName InteractableTag = TEXT("OVS_Interactable");

	// Optional: Enhanced Input action that fires Interact (e.g. IA_OVS_Interact).
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Interact")
	UInputAction* InteractAction = nullptr;

	// Optional: mapping context that maps InteractAction to a key (e.g. IMC_OVS_Interact: E).
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Interact")
	UInputMappingContext* InteractMappingContext = nullptr;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Interact")
	int32 InteractMappingPriority = 1;

	// Shown before the verb in TXT_Prompt, e.g. "E  Hide".
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Interact")
	FText PromptKeyLabel;

	// Use whatever the player is focused on (or locked into, e.g. a hide spot).
	UFUNCTION(BlueprintCallable, Category = "OVS|Interact")
	void Interact();

	// The actor or component that would receive Interact right now, if any.
	UFUNCTION(BlueprintPure, Category = "OVS|Interact")
	UObject* GetFocusedTarget() const { return FocusedTarget.Get(); }

	// A target that keeps focus regardless of the trace (the hide spot while inside it).
	void SetLockedTarget(UObject* Target);
	void ClearLockedTarget(UObject* Target);

protected:
	virtual void BeginPlay() override;
	virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;

private:
	UPROPERTY(Transient)
	UUserWidget* InspectWidget = nullptr;

	FTimerHandle InspectTimer;

	TWeakObjectPtr<UObject> FocusedTarget;
	TWeakObjectPtr<UObject> LockedTarget;

	TWeakObjectPtr<UEnhancedInputComponent> BoundInputComponent;
	uint32 InteractBindingHandle = 0;

	// Widget + input need the player controller, which may not exist yet at BeginPlay.
	void TryInitialize();

	void DoInspect();
	UObject* FindInteractable(AActor* Actor) const;
	FText PromptFor(UObject* Target) const;
	void SetInspectText(const FText& NameText, const FText& LineText);
	void SetPromptText(const FText& PromptText);
	void ShowInspect(bool bVisible);
};
