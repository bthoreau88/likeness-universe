# Blender preparation and interchange layer

This extends `handoff/docs/16_Blender_MCP_FAL_Asset_Fabrication_Module.md` and the seven workflows already in `handoff/data/blender_asset_workflow_registry.csv`. Blender is the cleanup, adaptation and export layer. MCP and paid generation are optional; direct editor work and reproducible scripts remain valid. No connection or editor run has been verified in this milestone.

## First proof: existing prop or proxy, not a new character

Use `PROP_TAPE_001` (cassette) as the identity of the object; a cassette recorder is a separate asset if introduced later, not a rename of this ID. Start with a proxy or already owned/licensed source. Reuse a generic shell if suitable, then author only story-specific labels, wear and functional parts. Do not spend on meshes before the inspect event works.

1. Intake original into a non-public staging workspace; record provider/listing, acquisition license, SHA-256, source format and Blender version. Keep the original untouched.
2. Duplicate to `<asset_id>_v001_work.blend`. Use metric scene units; record real dimensions and test against a 1m reference. The chosen asset scale comes from measurement/reference, not an imagined default.
3. Set the pivot for interaction (hinge, base or inspect rotation center). Apply scale on the delivery copy. Check normals, missing faces, hidden objects, UVs and material slots. Keep moving parts separate and name them deterministically.
4. Adapt shared materials to worn motel surfaces. Bake procedural effects needed by derivatives; preserve warm-brown skin and identity locks for future characters. Inspect roughness/normal direction under neutral light before the cinematic grade.
5. Create an explicit low-detail/collision plan and texture budget. Proposed first-proof ceilings: 20k triangles per small inspect prop, 2k textures for engine hero view, 1k for web, <=5MB GLB. These are provisional starting budgets; profile on the actual devices and document justified exceptions.
6. Export web `.glb` with only intended objects, baked PBR-compatible materials and approved embedded media. Verify in the existing Three.js staging scene. Browsers expose downloaded GLBs; an asset's web embedding rights must be checked separately from game packaging.
7. Export Unreal FBX + textures using a recorded preset. Validate orientation and scale in the target editor with the same 1m reference. Do not assume one Blender/FBX axis preset works across all importer versions. Match collision names to target mesh (`UCX_<mesh>_01`) where that pipeline is used.
8. Render front, side, material close-up and bounding-box/pivot evidence. Record mesh counts, dimensions, texture sizes, warnings and both export hashes. Stage, review, then promote accepted derivatives and update the existing asset manifest.

## Delivery tree (outside public web assets until approved)

```text
<asset_id>/v001/
  source/        original files; restricted where required
  work/          editable .blend
  web/           .glb plus permitted preview
  unreal/        .fbx and textures
  qc/            screenshots, import notes, delivery.json
```

Public source repositories get only permitted artifacts and metadata, not restricted originals. A Git LFS pointer does not make a public file private. Do not add new binary patterns globally without checking existing web media deployment.

## Exit / repair loop

The same asset ID, measured scale and material intent must survive both imports. Failures stay staged with `NEEDS_REPAIR` and a targeted repair task. For characters, the existing Ideation -> Clean Sheet -> Parts -> Views and human identity review remain mandatory. Do not use a generic purchased face as THOREAU or DRYA.

References: [Blender glTF manual](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html), [Epic FBX static mesh pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-static-mesh-pipeline-in-unreal-engine). Resolve to installed versions before scripting exporter APIs; Epic documents FBX 2020.2 compatibility and collision caveats.

## Fast path (2026-10-25)

Most Room 14 props should arrive sourced, so the usual Blender job is a short adaptation
pass (scale, pivot, material cleanup, a story decal) rather than modeling. See
[ASSET_FAST_LANES.md](ASSET_FAST_LANES.md) for which items are source vs make. A Blender MCP
bridge is an optional accelerator for scene setup and exports; it does not change the
delivery tree or QC evidence above.
