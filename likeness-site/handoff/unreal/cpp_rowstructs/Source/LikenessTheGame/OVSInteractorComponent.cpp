// OVSInteractorComponent.cpp
#include "OVSInteractorComponent.h"
#include "LikenessRows.h"
#include "OVSInteractable.h"

#include "Blueprint/UserWidget.h"
#include "Components/TextBlock.h"
#include "Engine/DataTable.h"
#include "Engine/LocalPlayer.h"
#include "Engine/World.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "GameFramework/Pawn.h"
#include "GameFramework/PlayerController.h"
#include "TimerManager.h"
#include "CollisionQueryParams.h"

UOVSInteractorComponent::UOVSInteractorComponent()
{
	PrimaryComponentTick.bCanEverTick = false;
	PromptKeyLabel = NSLOCTEXT("OVS", "InteractKey", "E");
}

void UOVSInteractorComponent::BeginPlay()
{
	Super::BeginPlay();

	TryInitialize();

	if (UWorld* W = GetWorld())
	{
		W->GetTimerManager().SetTimer(InspectTimer, this, &UOVSInteractorComponent::DoInspect, InspectInterval, true);
	}
}

void UOVSInteractorComponent::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
	if (UWorld* W = GetWorld())
	{
		W->GetTimerManager().ClearTimer(InspectTimer);
	}
	if (UEnhancedInputComponent* EIC = BoundInputComponent.Get())
	{
		EIC->RemoveBindingByHandle(InteractBindingHandle);
	}
	BoundInputComponent.Reset();
	if (InteractMappingContext)
	{
		APawn* OwnerPawn = Cast<APawn>(GetOwner());
		APlayerController* PC = OwnerPawn ? Cast<APlayerController>(OwnerPawn->GetController()) : nullptr;
		ULocalPlayer* LP = PC ? PC->GetLocalPlayer() : nullptr;
		if (UEnhancedInputLocalPlayerSubsystem* Input = LP ? LP->GetSubsystem<UEnhancedInputLocalPlayerSubsystem>() : nullptr)
		{
			Input->RemoveMappingContext(InteractMappingContext);
		}
	}
	if (InspectWidget)
	{
		InspectWidget->RemoveFromParent();
		InspectWidget = nullptr;
	}
	Super::EndPlay(EndPlayReason);
}

void UOVSInteractorComponent::TryInitialize()
{
	APawn* OwnerPawn = Cast<APawn>(GetOwner());
	APlayerController* PC = OwnerPawn ? Cast<APlayerController>(OwnerPawn->GetController()) : nullptr;
	if (!PC)
	{
		return;
	}

	if (!InspectWidget && InspectWidgetClass)
	{
		InspectWidget = CreateWidget<UUserWidget>(PC, InspectWidgetClass);
		if (InspectWidget)
		{
			InspectWidget->AddToViewport();
			ShowInspect(false);
		}
	}

	if (InteractAction && !BoundInputComponent.IsValid())
	{
		if (UEnhancedInputComponent* EIC = Cast<UEnhancedInputComponent>(PC->InputComponent))
		{
			if (InteractMappingContext)
			{
				ULocalPlayer* LP = PC->GetLocalPlayer();
				if (UEnhancedInputLocalPlayerSubsystem* Input = LP ? LP->GetSubsystem<UEnhancedInputLocalPlayerSubsystem>() : nullptr)
				{
					Input->AddMappingContext(InteractMappingContext, InteractMappingPriority);
				}
			}
			InteractBindingHandle = EIC->BindAction(InteractAction, ETriggerEvent::Started, this, &UOVSInteractorComponent::Interact).GetHandle();
			BoundInputComponent = EIC;
		}
	}
}

void UOVSInteractorComponent::SetLockedTarget(UObject* Target)
{
	LockedTarget = Target;
}

void UOVSInteractorComponent::ClearLockedTarget(UObject* Target)
{
	if (LockedTarget.Get() == Target)
	{
		LockedTarget.Reset();
	}
}

void UOVSInteractorComponent::Interact()
{
	UObject* Target = LockedTarget.IsValid() ? LockedTarget.Get() : FocusedTarget.Get();
	if (!Target || !Target->Implements<UOVSInteractable>())
	{
		return;
	}
	if (!IOVSInteractable::Execute_CanInteract(Target, GetOwner()))
	{
		return;
	}

	IOVSInteractable::Execute_Interact(Target, GetOwner());
	DoInspect(); // refresh the prompt now ("Hide" -> "Leave"), not on the next interval
}

void UOVSInteractorComponent::DoInspect()
{
	TryInitialize();

	// Locked in (hiding): that target owns the prompt and no trace runs.
	if (UObject* Locked = LockedTarget.Get())
	{
		FocusedTarget = Locked;
		SetInspectText(FText::GetEmpty(), FText::GetEmpty());
		SetPromptText(PromptFor(Locked));
		ShowInspect(true);
		return;
	}

	APawn* OwnerPawn = Cast<APawn>(GetOwner());
	APlayerController* PC = OwnerPawn ? Cast<APlayerController>(OwnerPawn->GetController()) : nullptr;
	if (!PC || !GetWorld())
	{
		FocusedTarget.Reset();
		ShowInspect(false);
		return;
	}

	FVector ViewLoc;
	FRotator ViewRot;
	PC->GetPlayerViewPoint(ViewLoc, ViewRot);
	const FVector End = ViewLoc + ViewRot.Vector() * TraceDistance;

	FCollisionQueryParams Params(SCENE_QUERY_STAT(OVSInspect), /*bTraceComplex=*/false, GetOwner());
	FHitResult Hit;
	const bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, ViewLoc, End, ECC_Visibility, Params);

	AActor* HitActor = bHit ? Hit.GetActor() : nullptr;
	UObject* Usable = HitActor ? FindInteractable(HitActor) : nullptr;
	FocusedTarget = Usable;

	// Inspect row: the asset_id is the tag that isn't the interactable marker.
	const FAssetManifestRow* Row = nullptr;
	if (HitActor && HitActor->ActorHasTag(InteractableTag) && AssetManifest)
	{
		FName AssetId = NAME_None;
		for (const FName& Tag : HitActor->Tags)
		{
			if (Tag != InteractableTag)
			{
				AssetId = Tag;
				break;
			}
		}
		if (!AssetId.IsNone())
		{
			Row = AssetManifest->FindRow<FAssetManifestRow>(AssetId, TEXT("OVSInspect"));
		}
	}

	if (!Row && !Usable)
	{
		ShowInspect(false);
		return;
	}

	SetInspectText(Row ? FText::FromString(Row->name) : FText::GetEmpty(),
		Row ? FText::FromString(Row->inspect_text) : FText::GetEmpty());
	SetPromptText(Usable ? PromptFor(Usable) : FText::GetEmpty());
	ShowInspect(true);
}

UObject* UOVSInteractorComponent::FindInteractable(AActor* Actor) const
{
	if (Actor->Implements<UOVSInteractable>())
	{
		return IOVSInteractable::Execute_CanInteract(Actor, GetOwner()) ? Actor : nullptr;
	}

	TInlineComponentArray<UActorComponent*> Components(Actor);
	for (UActorComponent* Component : Components)
	{
		if (Component && Component->Implements<UOVSInteractable>() && IOVSInteractable::Execute_CanInteract(Component, GetOwner()))
		{
			return Component;
		}
	}
	return nullptr;
}

FText UOVSInteractorComponent::PromptFor(UObject* Target) const
{
	const FText Verb = IOVSInteractable::Execute_GetInteractVerb(Target, GetOwner());
	return FText::Format(NSLOCTEXT("OVS", "InteractPrompt", "{0}  {1}"), PromptKeyLabel, Verb);
}

void UOVSInteractorComponent::SetInspectText(const FText& NameText, const FText& LineText)
{
	if (!InspectWidget)
	{
		return;
	}

	// Primary: drive the named TextBlocks directly (no UMG variable binding needed).
	if (UTextBlock* TBName = Cast<UTextBlock>(InspectWidget->GetWidgetFromName(TEXT("TXT_Name"))))
	{
		TBName->SetText(NameText);
	}
	if (UTextBlock* TBLine = Cast<UTextBlock>(InspectWidget->GetWidgetFromName(TEXT("TXT_Line"))))
	{
		TBLine->SetText(LineText);
	}

	// Fallback: also set FText variables InspectName / InspectLine if the WBP uses bindings.
	if (FTextProperty* PName = FindFProperty<FTextProperty>(InspectWidget->GetClass(), TEXT("InspectName")))
	{
		PName->SetPropertyValue_InContainer(InspectWidget, NameText);
	}
	if (FTextProperty* PLine = FindFProperty<FTextProperty>(InspectWidget->GetClass(), TEXT("InspectLine")))
	{
		PLine->SetPropertyValue_InContainer(InspectWidget, LineText);
	}
}

void UOVSInteractorComponent::SetPromptText(const FText& PromptText)
{
	if (!InspectWidget)
	{
		return;
	}

	// Optional TextBlock: absent in older layouts, which keep their static prompt.
	if (UTextBlock* TBPrompt = Cast<UTextBlock>(InspectWidget->GetWidgetFromName(TEXT("TXT_Prompt"))))
	{
		TBPrompt->SetText(PromptText);
		TBPrompt->SetVisibility(PromptText.IsEmpty() ? ESlateVisibility::Collapsed : ESlateVisibility::HitTestInvisible);
	}
}

void UOVSInteractorComponent::ShowInspect(bool bVisible)
{
	if (InspectWidget)
	{
		InspectWidget->SetVisibility(bVisible ? ESlateVisibility::HitTestInvisible : ESlateVisibility::Hidden);
	}
}
