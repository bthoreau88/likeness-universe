// LikenessTheGame.Build.cs — primary game module for LIKENESS : THE GAME.
// Compiles the DataTable row structs (Public/LikenessRows.h) and the data-driven
// inspect/interact component (OVSInteractorComponent), the hide spot and the wardrobe.
// UMG/Slate are needed for the widget; EnhancedInput for the interact binding.

using UnrealBuildTool;

public class LikenessTheGame : ModuleRules
{
	public LikenessTheGame(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[]
		{
			"Core",
			"CoreUObject",
			"Engine",
			"UMG",
			"Slate",
			"SlateCore"
		});

		PrivateDependencyModuleNames.AddRange(new string[] { "EnhancedInput" });
	}
}
