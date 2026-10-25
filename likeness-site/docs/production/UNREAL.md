# Unreal integration and proof layer

Extend the existing `handoff/unreal/`, `handoff/MILESTONE_02_ROOM14_GREYBOX.md`, `handoff/mechanics/MECH_MIRROR_LAG_SPEC.md` and `handoff/UE58_PACKAGE_ADOPTION_MAP.md`. Do not create another engine skeleton in this website repo. The actual `.uproject`, installed editor, plugins and current engine build are not mounted/verified here.

## Preflight

Record exact `.uproject` location, engine version/build, platform, target hardware, source branch/head, plugin versions and a launch/build log. Existing docs mention both 5.7 and 5.8 and disagree about completion. Keep those as historical claims until screenshots and runnable build evidence establish current status. Pin one working version for the slice; do not upgrade an engine or install an MCP plugin during an asset import task.

## One event before room expansion

1. Duplicate the current verified Room 14 map into a sandbox using the project's established `L_` naming. Reuse the current interaction interface/subsystem if present; inspect the included C++ starters before introducing alternatives.
2. Import approved FBX/textures under the established `Content/OVS_LIKENESS/Art_Staging` flow, not into production folders. Record import settings and any Interchange vs legacy FBX differences in that editor.
3. Verify 1m scale, pivot, normals, material appearance, simple collision and inspect-camera readability. Test collision as the player, not just in viewport. LOD/Nanite decisions are per asset and measured; reflective surfaces still need their own tests.
4. Bind the prop to its stable registry ID. Data assets/tables hold descriptive content and event definitions; no new lore strings in Blueprint graphs. Do not assume existing starter row structs already support the new branch state.
5. On inspect, emit a versioned event with node/evidence IDs, typed deltas and one-shot replay behavior. Log the same expected result as the web fixture. Keep microphone off; simulated noise supplies the sound input.
6. Export a sanitized JSON proof containing schema version, fixture ID, event ID, asset ID, before/after values and source build. No engine object references, private paths, tokens or automatic game-save upload to the public website.
7. Validate replay/reload does not duplicate effects. Test new session and existing save through the planned read adapter. Invalid/unknown versions need an explicit error or reviewed fallback, not silent destructive conversion.
8. Package a playable development build. Capture a continuous entry -> inspect -> evidence -> recap sequence, screenshot of collision/material check, frame time, machine specification and build hash. An editor viewport still alone is insufficient.

The static Pages site cannot receive live game state without an explicitly designed service. First bridge is manual file export/import in a local development tool. Do not introduce a backend, telemetry, cloud account or database just to prove one event.

## Exit and rollback

Deliver map/build revision, source SHA, accepted asset hashes, event fixture, QA log and screenshot/video proof. Record packaged-build performance; initial proposed target is 1080p/60fps on the chosen workstation, with a lower-effects comparison, not an advertised hardware promise. Keep imported content staged until measured acceptance. Roll back the sandbox changes by a new source-control revert; do not replace the live map or delete existing assets.

Reference: [Epic FBX pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-static-mesh-pipeline-in-unreal-engine). Other engine APIs must be verified against documentation for the installed engine before implementation.

## Current state and known traps (2026-10-25)

What has actually happened on the workstation, the build traps learned the hard way (Live
Coding vs new classes, compile memory, API macro, DataTable key column, MCP node limits),
and the session ritual are in [GAME_LANE.md](GAME_LANE.md) §2–§4. Read them before any PC
session.
