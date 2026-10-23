# Audit and intake disposition

## Repository baseline

- Repo: `bthoreau88/likeness-universe`; correct origin already configured.
- Canonical source inspected: `claude/dreamy-hawking-VcoBe` at `426712ce075abd93143386c04c3016589fbe5f21`.
- Published branch observed: `gh-pages` at `59e60677c25d2a26b2acaa57faf45617a44537c7`. This is a snapshot, not permission to overwrite later changes.
- Static Next 16.2.7 / React 19.2.4 / TypeScript / Tailwind v4; npm lockfile; Node >=22.
- 17 page routes plus sitemap, robots, and 404. Data in `src/lib/registry.ts`; additional existing story/reference data in `tape03.ts`, `roomTestifies.ts`, and `prompts.ts` remains intact.
- Existing `handoff/` includes production bible, Blender lab, Unreal C++ starter components, bridge notes, registry CSVs, milestone plans, and reference atlas. Presence of a file is not proof of a successful editor run.
- Build: `npm ci`, `npm run lint`, `NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build`.

## Upload batch 001 (10 files; more pending)

Exact names, byte sizes, SHA-256 hashes, archive member hashes, and duplicate relationships are recorded in `../../data/production/intake-batch-001.json`. Originals remain in the upload source; this repo commits metadata and derived decisions, not duplicate binaries. Re-upload originals when resuming elsewhere if not otherwise available.

| Material | Disposition | Reason / next action |
|---|---|---|
| V0023 clean starter ZIP | Reference; selected requirements | Existing repo wins over its `main`, Vite, new-repo and dependency-install instructions. No scaffold imported. |
| V002 base branching bible | Narrative systems reference | Local branches, convergence and fail-forward are design proposals; do not rewrite live lore. |
| V002 project integration PDF | Integration reference | Map requirements to existing companion routes and stable IDs. |
| V002.2 sound expansion PDF | Sound reference | Simulated sound first; no microphone or remote voice processing in this pass. |
| Two TAPE-03 HTML files | Duplicate archival alternate | Byte-identical; biomech / overwrite framing is already retired to `/alt`. Missing sibling script assets mean these are not a runnable source project. Do not restore to home. |
| V002.2 Markdown handoff | Non-destructive rules adopted selectively | Preserve existing behavior; add docs/data before runtime. Current branch/deploy instructions take precedence. |
| V0022 bundle ZIP | Overlapping archive | Its Markdown and JSON match the loose uploads by hash; the bundled PDF differs and remains a separate revision candidate. Preserve provenance, avoid importing twice. |
| V0022 branching JSON | Quarantined design fixture | Not a JSON Schema despite its `stateSchema` label; not runtime save data. |
| V002 expanded bible | Broader reference | Larger lobby/service-corridor and ending scope is later work, outside the next single-event proof. |

## Conflicts requiring an explicit migration design later

| Older material | Current handling |
|---|---|
| Branch from `main`; build React/Vite | Use canonical source branch and current Next.js app. |
| Cream document UI vs live graphite/amber site | Cream remains a document convention; preserve the working site palette. |
| V0022 `variables`/`audio`/`discoveredNodeIds` vs V0023 `playerState`/`branchNodes` | Versioned read adapter later; never spread one object over the other. Keep raw input, map fields explicitly, report unmapped fields. |
| `PUBLIC_SIGNAL` is both categorical and numeric across examples | No automatic cast. Resolve its domain before executable branch rules. |
| `ROOM_MEMORY` vs `ROOM_TRUST`/`ROOM_ATTENTION` | Distinct concepts until a reviewed migration defines meaning; do not alias based on names. |
| Old blanket claims of free Quixel/Megascans, BBC SFX, and a $0 shippable stack | Historical reference only. Check each current listing, license, entitlement and intended distribution. |
| UE 5.7, 5.8 and unverified milestone completion claims | Record installed editor and project build evidence before choosing APIs or marking engine work complete. |
| Game DRYA vs film BENI | Keep existing game identity and project boundary; film changes do not silently rename game characters. |

## Next bounded implementation

After remaining inputs are reconciled, define a versioned state contract and a non-mutating adapter, then one development-only cassette interaction: one branch node, one evidence record, one simulated sound update, one recap. Keep proposed flags false by default. A static-export development route is public if emitted, even if absent from navigation: exclude it at build time unless explicitly intended for public distribution. Do not use a feature flag as a confidentiality boundary.
