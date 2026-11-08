#pragma once
// GL-19R.1 host-only Unreal shim. DO NOT include in a production Unreal module.
#include <cmath>
#include <cstdint>
#include <functional>
#include <string>
#include <vector>
#include <algorithm>
using uint8 = std::uint8_t;
#define UENUM(...)
#define UMETA(...)
#define UCLASS(...)
#define UPROPERTY(...)
#define UFUNCTION(...)
#define GENERATED_BODY() using Super = UActorComponent;
#define LIKENESSTHEGAME_API
#define DECLARE_DYNAMIC_MULTICAST_DELEGATE_FourParams(Name, T1, N1, T2, N2, T3, N3, T4, N4) struct Name { int count = 0; std::function<void(T1,T2,T3,T4)> callback; void Broadcast(T1 a,T2 b,T3 c,T4 d){ count++; if(callback) callback(a,b,c,d); } };
#define DEFINE_LOG_CATEGORY_STATIC(...)
#define UE_LOG(...)
#define TEXT(x) x
struct FString { std::string s; const char* operator*() const { return s.c_str(); } };
struct FName { std::string n; FName(const char *p="") : n(p) {} FString ToString() const { return {n}; } };
class AActor {};
inline FString GetNameSafe(AActor*) {return {"MockActor"};}
class UWorld {public: float time=0; float GetTimeSeconds() const {return time;} };
extern UWorld gWorld;
namespace EEndPlayReason{enum Type {Quit=0};}
struct FMath { static bool IsFinite(float v){return std::isfinite(v);} template<class T> static T Max(T a,T b){return std::max(a,b);} };
struct FTickFunction { bool bCanEverTick=true; };
class UActorComponent { public: FTickFunction PrimaryComponentTick; virtual ~UActorComponent()=default; virtual void BeginPlay(){}; virtual void EndPlay(EEndPlayReason::Type){}; UWorld* GetWorld() const {return &gWorld;} AActor* GetOwner()const {return nullptr;} };
