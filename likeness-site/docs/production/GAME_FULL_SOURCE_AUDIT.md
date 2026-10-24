# Recovered game source audit

Input: batch 003's `05-LIKENESS-THE-GAME-FULL.zip`; exact archive/member hashes
are in `../../data/production/intake-batch-003.json`. Review type: static source
inspection only. No Unreal compiler, editor, map or executable was run.

## What exists

The archive has 17 files. `Source/Loop/` contains `LoopDirector.h/.cpp`,
`LoopTypes.h`, and `LoopIterationData.h`. `Source/Stealth_PARKED/` contains five
stealth source/header files. Five Markdown files and three PDFs describe the
handoff and progress. The source's README identifies the hallway-loop track as
active and stealth as parked, with no completed build evidence in the trackers.

There is no Unreal project descriptor, build module, target, Content tree,
playable map, Data Asset instance, packaged build or capture. The correct status
is **source candidate awaiting project integration**, not playable or engine-ready.
Do not create a new project around it or replace existing controller/state code
without inspecting the actual workstation project.

## Findings before integration

| Finding in supplied source | Consequence | Required proof or repair |
|---|---|---|
| Loop classes use `LIKENESS_API`; stealth uses `HITMANPROJECT_API` | Module ownership is unresolved | Identify actual `.Build.cs`/module and API macro before compiling |
| `bPreserveRelativeRotation` sets control yaw directly to entry yaw | It does not preserve a relative look offset despite the name/comment | Define entry/exit frame relationship; preserve intended yaw/pitch offset; test backward/sideways traversal |
| `RequestAdvance` increments the index before `TeleportToEntry` validates entry | Missing entry can advance narrative state without moving the player | Validate transition prerequisites before changing index; log failure and keep state unchanged |
| Exit-rule completion broadcasts on every call | Repeated overlaps can repeatedly complete the slice | Add an explicit completion/transition rule and test repeated input |
| Spawn iterates over actors matched by `TargetTag` | With no matched anchor, no spawn occurs; the missing-target warning is suppressed for spawn | Define required spawn anchor or explicit transform and handle no-anchor cases |
| Delayed lambda captures `this`; no `EndPlay` cleanup appears in the class | Teardown/lifetime behavior is unproven | Use lifetime-safe dispatch/cleanup appropriate to the installed engine and test level unload during delay |
| Door deltas broadcast generic names without the matched actor/tag payload | A Blueprint receiver lacks target-specific context | Pass stable target identity or call an existing interactable interface; test multiple tagged doors |
| Actor lookup comment says cached; implementation calls `GetAllActorsWithTag` | The advertised cache is not implemented | Measure lookup cost before adding caching; remove misleading claim or implement verified cache invalidation |

These findings describe the supplied code's control flow. They are not claims of
an observed engine crash or a successful fix. The omitted surrounding engine
project may contain additional guards, but it is not included in this archive.

## Bounded integration proof if selected

Record project path, engine build, module name and existing player pawn. Work in
an isolated source branch and sandbox map. First test empty iteration data and
the traversal seam, then repeated overlap, missing entry, invalid/null iteration,
end-state idempotency, backward/sideways traversal and delayed-event teardown.
Do not add scares, final art, AI, chase, inventory or save/load to repair the seam.

The archive suggests eight iterations; that remains a source proposal until this
track is selected. A green website build cannot validate Unreal source, and an
AI-generated gameplay-looking video cannot validate the traversal implementation.

Promote only after a real compile, continuous gameplay capture, input/replay
checks and measured frame-time evidence. Keep the current Room 14/C++ handoff
untouched while comparing component responsibilities and stable registry IDs.
