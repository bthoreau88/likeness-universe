// OVSRoomStateSubsystem.h — the room's state authority for LIKENESS : THE GAME.
//
// MECH_ROOM_STATE_001. A per-world subsystem that holds the current room state and
// broadcasts changes. Any system (inspect, mirror-lag, lighting, tape, audio) reads or
// drives it from one place — this is the spine the whole room reacts through.
//
// Canonical states come from narrative_beats.resulting_room_state.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "OVSRoomStateSubsystem.generated.h"

// Canonical room states (narrative_beats.csv -> resulting_room_state). Do not invent new
// states here without a beat that produces them.
UENUM(BlueprintType)
enum class EOVSRoomState : uint8
{
	STATE_00_NORMAL             UMETA(DisplayName = "00 Normal"),
	STATE_02_MIRROR_LAG         UMETA(DisplayName = "02 Mirror Lag"),
	STATE_04_TAPE_CONTRADICTION UMETA(DisplayName = "04 Tape Contradiction"),
	// Story pass v001 (handoff/story). Append only: earlier values keep their numbers.
	STATE_01_RESIDUE            UMETA(DisplayName = "01 Residue"),
	STATE_05_DOUBLE_OCCUPANCY   UMETA(DisplayName = "05 Double Occupancy"),
	STATE_06_MEMORY_LOCK        UMETA(DisplayName = "06 Memory Lock")
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnOVSRoomStateChanged, EOVSRoomState, OldState, EOVSRoomState, NewState);

UCLASS()
class LIKENESSTHEGAME_API UOVSRoomStateSubsystem : public UWorldSubsystem
{
	GENERATED_BODY()

public:
	// Subscribe (inspect, mirror-lag, lighting, audio) to react to state changes.
	UPROPERTY(BlueprintAssignable, Category = "OVS|RoomState")
	FOnOVSRoomStateChanged OnRoomStateChanged;

	// Drive the room state (e.g. inspecting the mirror -> STATE_02_MIRROR_LAG).
	UFUNCTION(BlueprintCallable, Category = "OVS|RoomState")
	void SetRoomState(EOVSRoomState NewState);

	UFUNCTION(BlueprintPure, Category = "OVS|RoomState")
	EOVSRoomState GetRoomState() const { return CurrentState; }

	// Convenience accessor from any UObject with a world.
	UFUNCTION(BlueprintCallable, Category = "OVS|RoomState", meta = (WorldContext = "WorldContextObject"))
	static UOVSRoomStateSubsystem* Get(const UObject* WorldContextObject);

private:
	UPROPERTY(Transient)
	EOVSRoomState CurrentState = EOVSRoomState::STATE_00_NORMAL;
};
