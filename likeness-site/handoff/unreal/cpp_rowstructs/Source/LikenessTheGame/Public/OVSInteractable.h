// OVSInteractable.h — one interaction contract for LIKENESS : THE GAME.
//
// Anything the player can *use* (the Room 14 closet, a door, the red phone, the coffee)
// implements this on the actor or on one of its components. UOVSInteractorComponent
// finds it with its view trace, shows the verb in the inspect widget's TXT_Prompt, and
// calls Interact when the interact input fires. Inspect-only props keep using tags +
// DT_AssetManifest and don't need this.
//
// No story text belongs here: the verb is a UI word ("Hide", "Leave"), set per instance.

#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "OVSInteractable.generated.h"

UINTERFACE(MinimalAPI, BlueprintType)
class UOVSInteractable : public UInterface
{
	GENERATED_BODY()
};

class LIKENESSTHEGAME_API IOVSInteractable
{
	GENERATED_BODY()

public:
	// Do the thing. Interactor is the pawn that pressed interact.
	UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "OVS|Interact")
	void Interact(AActor* Interactor);

	// False hides the prompt and ignores the input (e.g. the closet is already occupied).
	UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "OVS|Interact")
	bool CanInteract(AActor* Interactor) const;

	// The one-word prompt shown after the key label, e.g. "Hide".
	UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "OVS|Interact")
	FText GetInteractVerb(AActor* Interactor) const;
};
