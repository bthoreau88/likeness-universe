// OVSWardrobeComponent.h — modular outfit swaps on one rig for LIKENESS : THE GAME.
//
// THOREAU and THE OTHER share one identity and one rig (canon: no new mesh for the
// double), so the wardrobe is the tell: the camcorder strap, the chain worn outside the
// tee, the "pre-camera" jacket. Each outfit names which skeletal mesh component (slot)
// gets which mesh. ApplyOutfit swaps the mesh with SetSkeletalMeshAsset and re-attaches
// it to the leader with SetLeaderPoseComponent, so the clothes follow the body's
// animation exactly instead of lagging or clipping.
//
// MetaHuman note: the leader is the "Body" component. Leave bFollowLeader off for the
// face, which keeps its own animation and copy-pose setup.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "OVSWardrobeComponent.generated.h"

class USkeletalMesh;
class USkeletalMeshComponent;

USTRUCT(BlueprintType)
struct FOVSWardrobePiece
{
	GENERATED_BODY()

	// Name of the skeletal mesh component on the owner, e.g. Torso, Legs, Feet.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	FName Slot;

	// Mesh for that slot. Empty clears it.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	USkeletalMesh* Mesh = nullptr;

	// Drive this slot from the leader's pose (clothing: yes; MetaHuman face: no).
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	bool bFollowLeader = true;
};

USTRUCT(BlueprintType)
struct FOVSOutfit
{
	GENERATED_BODY()

	// e.g. THOREAU_PRECAMERA, THE_OTHER_CAMCORDER.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	FName OutfitId;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	TArray<FOVSWardrobePiece> Pieces;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnOVSOutfitChanged, FName, OutfitId);

UCLASS(ClassGroup = (OVS), meta = (BlueprintSpawnableComponent))
class LIKENESSTHEGAME_API UOVSWardrobeComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UOVSWardrobeComponent();

	// The skeletal mesh component the pieces follow. Falls back to ACharacter::GetMesh().
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	FName LeaderComponentName = TEXT("Body");

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	TArray<FOVSOutfit> Outfits;

	// Applied at BeginPlay when set.
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "OVS|Wardrobe")
	FName InitialOutfit;

	UPROPERTY(BlueprintAssignable, Category = "OVS|Wardrobe")
	FOnOVSOutfitChanged OnOutfitChanged;

	// Returns false if the outfit isn't defined; logs any slot it can't find.
	UFUNCTION(BlueprintCallable, Category = "OVS|Wardrobe")
	bool ApplyOutfit(FName OutfitId);

	UFUNCTION(BlueprintPure, Category = "OVS|Wardrobe")
	FName GetCurrentOutfit() const { return CurrentOutfit; }

protected:
	virtual void BeginPlay() override;

private:
	UPROPERTY(Transient)
	FName CurrentOutfit;

	USkeletalMeshComponent* FindSlot(FName SlotName) const;
};
