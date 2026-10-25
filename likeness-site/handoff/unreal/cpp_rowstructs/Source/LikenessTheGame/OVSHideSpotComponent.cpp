// OVSHideSpotComponent.cpp
#include "OVSHideSpotComponent.h"
#include "OVSInteractorComponent.h"

#include "GameFramework/Character.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/Pawn.h"
#include "GameFramework/PlayerController.h"

const FName UOVSHideSpotComponent::HiddenTag(TEXT("OVS_Hidden"));

UOVSHideSpotComponent::UOVSHideSpotComponent()
{
	PrimaryComponentTick.bCanEverTick = false;
	EnterVerb = NSLOCTEXT("OVS", "HideVerb", "Hide");
	ExitVerb = NSLOCTEXT("OVS", "LeaveVerb", "Leave");
}

bool UOVSHideSpotComponent::EnterHide(APawn* Pawn)
{
	if (!Pawn || Occupant.IsValid())
	{
		return false;
	}

	APlayerController* PC = Cast<APlayerController>(Pawn->GetController());
	if (!PC)
	{
		return false;
	}

	Occupant = Pawn;

	// Freeze the body; the closet camera is the only view while hidden.
	PC->SetIgnoreMoveInput(true);
	PC->SetIgnoreLookInput(true);
	if (ACharacter* Character = Cast<ACharacter>(Pawn))
	{
		if (UCharacterMovementComponent* Move = Character->GetCharacterMovement())
		{
			SavedMovementMode = Move->MovementMode;
			bRestoreMovementMode = true;
			Move->StopMovementImmediately();
			Move->DisableMovement();
		}
	}
	Pawn->SetActorEnableCollision(false);
	Pawn->SetActorHiddenInGame(true);
	Pawn->Tags.AddUnique(HiddenTag);

	// The owner's Camera component (behind the slats) becomes the view.
	PC->SetViewTargetWithBlend(GetOwner(), ViewBlendTime);

	// Keep the prompt on this spot ("Leave") even though the trace now starts inside it.
	if (UOVSInteractorComponent* Interactor = Pawn->FindComponentByClass<UOVSInteractorComponent>())
	{
		Interactor->SetLockedTarget(this);
	}

	UE_LOG(LogTemp, Log, TEXT("OVSHide: %s entered %s"), *Pawn->GetName(), *GetNameSafe(GetOwner()));
	OnHideChanged.Broadcast(Pawn, true);
	return true;
}

void UOVSHideSpotComponent::ExitHide()
{
	APawn* Pawn = Occupant.Get();
	Occupant.Reset();
	if (!Pawn)
	{
		return;
	}

	Pawn->Tags.Remove(HiddenTag);
	Pawn->SetActorHiddenInGame(false);
	Pawn->SetActorEnableCollision(true);
	if (bRestoreMovementMode)
	{
		if (ACharacter* Character = Cast<ACharacter>(Pawn))
		{
			if (UCharacterMovementComponent* Move = Character->GetCharacterMovement())
			{
				Move->SetMovementMode(SavedMovementMode);
			}
		}
		bRestoreMovementMode = false;
	}

	if (APlayerController* PC = Cast<APlayerController>(Pawn->GetController()))
	{
		// These are counters in APlayerController; false undoes the true from EnterHide.
		PC->SetIgnoreMoveInput(false);
		PC->SetIgnoreLookInput(false);
		PC->SetViewTargetWithBlend(Pawn, ViewBlendTime);
	}

	if (UOVSInteractorComponent* Interactor = Pawn->FindComponentByClass<UOVSInteractorComponent>())
	{
		Interactor->ClearLockedTarget(this);
	}

	UE_LOG(LogTemp, Log, TEXT("OVSHide: %s left %s"), *Pawn->GetName(), *GetNameSafe(GetOwner()));
	OnHideChanged.Broadcast(Pawn, false);
}

bool UOVSHideSpotComponent::IsPawnHidden(const APawn* Pawn)
{
	return Pawn && Pawn->ActorHasTag(HiddenTag);
}

void UOVSHideSpotComponent::Interact_Implementation(AActor* Interactor)
{
	APawn* Pawn = Cast<APawn>(Interactor);
	if (!Pawn)
	{
		return;
	}
	if (Occupant.Get() == Pawn)
	{
		ExitHide();
	}
	else
	{
		EnterHide(Pawn);
	}
}

bool UOVSHideSpotComponent::CanInteract_Implementation(AActor* Interactor) const
{
	return !Occupant.IsValid() || Occupant.Get() == Interactor;
}

FText UOVSHideSpotComponent::GetInteractVerb_Implementation(AActor* Interactor) const
{
	return Occupant.Get() == Interactor ? ExitVerb : EnterVerb;
}

void UOVSHideSpotComponent::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
	if (Occupant.IsValid())
	{
		ExitHide();
	}
	Super::EndPlay(EndPlayReason);
}
