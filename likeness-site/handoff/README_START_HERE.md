# LIKENESS : THE GAME - OVS Agent Handoff Package V001

> Current execution addendum (2026-10-22): read
> `../docs/production/README.md` after `../CODEX_HANDOFF.md` and `../AGENTS.md`.
> It reconciles this historical package with the live Next.js site and adds
> Codex/Claude exchange receipts, asset sourcing, Blender/Unreal proof gates,
> and safe deployment. Existing templates and registries remain reference inputs;
> old Vite/engine-version assumptions do not override the current verified stack.

Start here. This package defines the production workflow, folder structure, registries, prompts, and agent rules for building LIKENESS : THE GAME and the matching interactive Three.js web companion.

## Order of Operations
1. Read `docs/00_OVS_Production_Workflow.md`.
2. Read `agents/AGENTS.md`.
3. Read the relevant agent file: `agents/CLAUDE.md`, `agents/CODEX.md`, or `agents/FABLE_THREEJS_PROMPT.md`.
4. Open the data registries in `data/` before creating assets or code.
5. Use `docs/03_Character_Reference_4Step_Template.md` before generating any 3D character.
6. For Unreal work, implement the vertical slice in milestones. Commit after every stable milestone.
7. For web work, build from the shared JSON schema so the site and game speak the same language.

## Non-Negotiable OVS Rules
- Face is the budget. Room is the antagonist. Camera is a witness. Image must feel playable.
- Do not hardcode story content in Blueprints or UI components.
- Do not rename folders without updating registries.
- Do not import assets directly into final folders. Use staging first.
- Do not generate 3D models from loose AI art. Use Ideation, Clean Sheet, Parts, Views.
- Keep the game, site, film stills, fashion assets, and music archive visually unified.

## Deliverables Included
- Production Bible PDF.
- Full markdown workflow.
- Reusable templates for characters, environments, mechanics, story, QA, and style.
- Agent handoff prompts for Claude Code, Codex, and Fable/Three.js style web building.
- CSV registries for assets, characters, mechanics, levels, prompts, and narrative beats.


## V002 Expansion Addendum

This package now includes optional expansion modules for:
- Image-Blaster image-to-world staging.
- Nano Gaussian Splatting Unreal splat tests.
- Higgsfield / Seedance campaign and reference workflows.
- Unreal Engine Guide learning/checklist support.

Start with `docs/12_Expansion_Source_Matrix.md`, then `docs/12_Expansion_Workflow_Modules.md`. These modules enhance the project; they do not replace the existing LIKENESS pipeline.


## V003 BLENDER MCP + FAL.AI EXPANSION
This package now includes an optional Blender MCP + fal.ai asset fabrication module. Start with `docs/16_Blender_MCP_FAL_Asset_Fabrication_Module.md`, then use `agents/expansion_prompts/BLENDER_MCP_FAL_AGENT_PROMPT.md` and `/expansions/blender_mcp_fal/prompts/`.

Use this module only to enhance asset creation, material lookdev, bake workflows, animation tests, and procedural dressing. Do not let it replace the OVS core pipeline, Unreal vertical slice, or Three.js companion architecture.


---

# V004 - MILESTONE 01 STARTER BUILD

Use this package version when you are ready to begin actual project setup. V004 adds a controlled Milestone 01 layer: repository verification, Unreal skeleton planning, Three.js starter scene, shared registry handoff, QA report template, and agent-ready kickoff prompt.

Start here for build execution:

1. `docs/17_Milestone_01_Build_Kickoff.md`
2. `agents/MILESTONE_01_AGENT_PROMPT.md`
3. `data/milestone_01_task_board.csv`
4. `web/milestone_01_starter/`
5. `unreal/milestone_01/M01_UNREAL_STARTER_PLAN.md`

Do not proceed to Milestone 02 until Milestone 01 passes QA and the user approves the foundation.
