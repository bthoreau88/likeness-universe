# LIKENESS production pipeline V001

Session: 2026-10-22 (Los Angeles). Scope: companion-site development and game-production handoffs. This is an additive execution layer, not a new game bible or an engine build.

## Start here

1. Read `../../CODEX_HANDOFF.md` and `../../AGENTS.md` in full.
2. Read [current audit and upload disposition](AUDIT_AND_INTAKE.md).
   Then read [batch 002 reconciliation](INTAKE_BATCH_002.md) and
   [prompt-source routing](PROMPT_SOURCE_ROUTING.md).
   Continue with [batches 003 and 004](INTAKE_BATCHES_003_004.md), the
   [recovered source audit](GAME_FULL_SOURCE_AUDIT.md),
   [Glass Room reference](GLASS_ROOM_REFERENCE.md), and
   [audio/training layer](AUDIO_AND_TRAINING.md).
3. Follow [gates and authority](WORKFLOW.md).
4. Use [Codex / Claude handoff and passback](AGENT_EXCHANGE.md).
5. Follow [Blender delivery](BLENDER.md), [Unreal integration](UNREAL.md), and [source / buy / make decisions](ASSET_SOURCING.md) as needed.

## Current boundary

The live product remains the Next.js static companion. Production plans live in this directory; machine-readable sourcing and intake metadata live in `../../data/production/`. Audience-facing progress lives in `../../src/lib/registry.ts`. Existing handoff CSVs retain their game IDs and roles. New procurement records do not replace the asset manifest or imply that a candidate is engine-ready.

More uploads may follow. Batches 001 through 004 contain 36 upload records in total;
this is not a completeness claim. Run intake into a NEW batch filename for each
subsequent upload. Preserve previous batches. Reused upload folders are supported:
only unchanged name/hash pairs in the supplied prior batches are skipped; a changed
file with the same name is inventoried as a new revision.

One further Drive asset archive is pending content access because it exceeds the
connector's download limit; see `data/production/external-assets-source.json`
(relative to `likeness-site/`). Its metadata does not establish verified contents
and is not counted as a completed intake batch.

```bash
# From likeness-site; scans metadata only, never extracts or executes uploads.
python3 scripts/production/intake.py /path/to/uploads data/production/intake-batch-005.json \
  --previous-batch data/production/intake-batch-001.json \
  --previous-batch data/production/intake-batch-002.json \
  --previous-batch data/production/intake-batch-003.json \
  --previous-batch data/production/intake-batch-004.json
npm run validate:production
npm run test:production
npm run lint
NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build
```

No new branching runtime, microphone, paid service, plugin installation, Blender file, or Unreal map is delivered by this milestone. Those require their respective evidence gates. The existing game handoff already contains Blender and Unreal plans; this layer connects and verifies their deliveries rather than creating another parallel scaffold.
