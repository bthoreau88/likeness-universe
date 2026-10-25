// OVSHideSpotComponent.h — MECH_HIDE_001 for LIKENESS : THE GAME.
//
// Put this on the Room 14 closet actor (or any hide spot) together with a Camera
// component placed behind the slats. Interacting hides the player: the view blends to
// the closet camera, move and look input freeze, the pawn is hidden with collision off
// and tagged OVS_Hidden. Interacting again (the prompt becomes "Leave") restores
// everything.
//
// It hides the player, never a body: LIKENESS has no combat. What happens while the
// player is hidden (THE OTHER's scripted entrance, the rewind if he is seen) belongs to
// the beat's Level Sequence, which listens to OnHideChanged or calls IsPawnHidden.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Engine/EngineTypes.h"
#include "OVSInteractable.h"
#include "OVSHideSpotComponent.generated.h"

class APawn;

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnOVSHideChanged, APawn*, Pawn, bool, bHidden);

UCLASS(ClassGroup = (OVS), meta = (BlueprintSpawnableComponent))
class LIKENESSTHEGAME_API UOVSHideSpotComponent : public UActorComponent, public IOVSInteractable
{
	GENERATED_BODY()

public:
	UOVSHideSpotComponent();

	// Tag added to the pawn while it is hidden. Anything can test it with ActorHasTag.
	static const FName HiddenTag;

	// Blend time (seconds) into and out of the hide camera.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Hide")
	float ViewBlendTime = 0.5f;

	// Prompt verb while the spot is free.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Hide")
	FText EnterVerb;

	// Prompt verb while the player is inside.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Hide")
	FText ExitVerb;

	// Fires on enter (true) and exit (false).
	UPROPERTY(BlueprintAssignable, Category = "OVS|Hide")
	FOnOVSHideChanged OnHideChanged;

	UFUNCTION(BlueprintCallable, Category = "OVS|Hide")
	bool EnterHide(APawn* Pawn);

	// Also safe to call from a sequence (e.g. the room rewinds and pulls the player out).
	UFUNCTION(BlueprintCallable, Category = "OVS|Hide")
	void ExitHide();

	UFUNCTION(BlueprintPure, Category = "OVS|Hide")
	bool IsOccupied() const { return Occupant.IsValid(); }

	UFUNCTION(BlueprintPure, Category = "OVS|Hide")
	APawn* GetOccupant() const { return Occupant.Get(); }

	UFUNCTION(BlueprintPure, Category = "OVS|Hide")
	static bool IsPawnHidden(const APawn* Pawn);

	// IOVSInteractable
	virtual void Interact_Implementation(AActor* Interactor) override;
	virtual bool CanInteract_Implementation(AActor* Interactor) const override;
	virtual FText GetInteractVerb_Implementation(AActor* Interactor) const override;

protected:
	virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;

private:
	TWeakObjectPtr<APawn> Occupant;

	// Character movement mode to restore on exit (DisableMovement sets MOVE_None).
	TEnumAsByte<EMovementMode> SavedMovementMode = MOVE_None;
	bool bRestoreMovementMode = false;
};
