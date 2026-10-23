# Codex / Claude handoff and passback

Use `templates/SESSION.md` for both directions. Copy it to a uniquely named receipt for a completed session. Never replace the existing `CODEX_HANDOFF.md` with chat context. The root handoff remains the entry point; this layer adds a reproducible exchange contract.

## Handoff prompt

```text
Resume LIKENESS UNIVERSE in bthoreau88/likeness-universe.
Read likeness-site/CODEX_HANDOFF.md and likeness-site/AGENTS.md fully, then
likeness-site/docs/production/README.md and the latest receipt.
Fetch canonical source claude/dreamy-hawking-VcoBe and gh-pages. Check open PRs.
Create your own feature branch from current canonical source. Main is unrelated.
Compare the receipt base SHA with current source; reconcile drift before editing.
Work only on the specified task and files. Preserve working routes, identities,
style, stable IDs and old saves. Keep new branching/audio flags off by default.
Register and reconcile new uploads without executing their content. No Vite scaffold.
Read the installed Next docs before Next-specific changes. Keep site content in
src/lib/registry.ts; use the existing asset() base-path helper.
Deliver a narrow diff, validation evidence, unresolved items and exact next action
using docs/production/templates/SESSION.md. PR into canonical source. For a publish
task, merge, rebuild from fresh merged source, check both tips, and follow section 7.
Do not report Blender/Unreal success without version, actual artifacts and proof.
```

## Passback review

The receiver checks repository URL, base/head SHAs, branch ancestry, changed-file scope, actual command exit codes, matching artifact paths and hashes, and whether statuses are claims or measured results. Resolve conflicting asset IDs and state fields before importing. Engine and web outputs share IDs and event definitions, not platform-specific objects or unversioned save files.

Every passback must distinguish implemented code, verified output, planned engine work, unavailable dependencies, and pending human/identity review. Do not turn a plan, a generated still or a scaffold into a `DONE` milestone. Do not copy private paths, tokens or purchase receipts into public logs.

## Asset and event exchange contracts

An asset delivery includes: `asset_id`, revision, original source URL, license snapshot reference, source SHA-256, authoring application/version, actual dimensions in meters, pivot, axis/export preset, mesh/texture statistics, web and Unreal derivative paths/hashes, collision and LOD decisions, screenshots, and QC status. Log accepted assets in `handoff/data/asset_manifest.csv`; procurement candidates stay separate.

An event delivery includes: `schema_version`, `event_id`, `node_id`, existing `asset_id`, requirements, typed effects, evidence ID, recap reference and replay rule. Replayed input must not duplicate evidence or apply a one-shot effect twice. Web and engine use fixtures for identical expected output. Save adapter tests cover old, current, partial, unknown-version and malformed input without modifying it. This contract is a requirement for the next implementation, not a claim that a bridge already exists.
