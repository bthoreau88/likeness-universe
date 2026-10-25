// OVSWardrobeComponent.cpp
#include "OVSWardrobeComponent.h"

#include "Components/SkeletalMeshComponent.h"
#include "Engine/SkeletalMesh.h"
#include "GameFramework/Character.h"

UOVSWardrobeComponent::UOVSWardrobeComponent()
{
	PrimaryComponentTick.bCanEverTick = false;
}

void UOVSWardrobeComponent::BeginPlay()
{
	Super::BeginPlay();
	if (!InitialOutfit.IsNone())
	{
		ApplyOutfit(InitialOutfit);
	}
}

bool UOVSWardrobeComponent::ApplyOutfit(FName OutfitId)
{
	const FOVSOutfit* Outfit = Outfits.FindByPredicate([OutfitId](const FOVSOutfit& Candidate)
	{
		return Candidate.OutfitId == OutfitId;
	});
	if (!Outfit)
	{
		UE_LOG(LogTemp, Warning, TEXT("OVSWardrobe: no outfit %s on %s"), *OutfitId.ToString(), *GetNameSafe(GetOwner()));
		return false;
	}

	USkeletalMeshComponent* Leader = FindSlot(LeaderComponentName);
	if (!Leader)
	{
		if (ACharacter* Character = Cast<ACharacter>(GetOwner()))
		{
			Leader = Character->GetMesh();
		}
	}

	for (const FOVSWardrobePiece& Piece : Outfit->Pieces)
	{
		USkeletalMeshComponent* SlotComponent = FindSlot(Piece.Slot);
		if (!SlotComponent)
		{
			UE_LOG(LogTemp, Warning, TEXT("OVSWardrobe: %s has no skeletal mesh component named %s"), *GetNameSafe(GetOwner()), *Piece.Slot.ToString());
			continue;
		}

		SlotComponent->SetSkeletalMeshAsset(Piece.Mesh);
		if (Piece.bFollowLeader && Leader && SlotComponent != Leader)
		{
			SlotComponent->SetLeaderPoseComponent(Leader, /*bForceUpdate=*/true);
		}
	}

	CurrentOutfit = OutfitId;
	UE_LOG(LogTemp, Log, TEXT("OVSWardrobe: %s -> %s"), *GetNameSafe(GetOwner()), *OutfitId.ToString());
	OnOutfitChanged.Broadcast(OutfitId);
	return true;
}

USkeletalMeshComponent* UOVSWardrobeComponent::FindSlot(FName SlotName) const
{
	if (SlotName.IsNone() || !GetOwner())
	{
		return nullptr;
	}

	TInlineComponentArray<USkeletalMeshComponent*> Components(GetOwner());
	for (USkeletalMeshComponent* Component : Components)
	{
		if (Component && Component->GetFName() == SlotName)
		{
			return Component;
		}
	}
	return nullptr;
}
