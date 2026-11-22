# Narrative-state reference (OVS-GAME-BRANCH-G01A.3 preflight)

An isolated, versioned narrative-state model for LIKENESS : THE GAME. It shares one schema between the Unreal game, which will own committed state, and the website, which consumes a read-only projection.

| Path | What it is |
|---|---|
| `UE_NARRATIVE_STATE_ADAPTER_SPEC_V001.md` | Unreal adapter specification (design only; nothing compiled in UE) |
| `schema/narrative-graph.schema.json` | Node/edge schema with typed conditions and effects |
| `schema/save.schema.json` | Save envelope v2 (run ledger + discovery ledger) |
| `engine/narrative-engine.mjs` | Reference engine: validation, typed conditions, transactional decisions, replay, discovery, projection, save/migrate |
| `engine/browser-store.mjs` | Browser persistence: compare-and-swap run slots, union-merged discovery, quarantine |
| `fixtures/*.json` | Chapters derived from Tape 03 Bible V.002 §09, §11 and §15, plus golden playthroughs |
| `tests/narrative-engine.test.mjs` | `npm run test:narrative` |
| `browser/` | Real-browser persistence harness (`harness.html` + `persistence.qa.cjs`) |
| `evidence/` | Recorded results |

## Run

Engine tests:

```
npm run test:narrative
```

Browser persistence (Playwright Chromium):

```
cd handoff/game/narrative && python3 -m http.server 8790 &
QA_BASE=http://localhost:8790 QA_OUT=/tmp/persist node browser/persistence.qa.cjs
```

To regenerate the golden snapshots after an intentional engine change:

```
node handoff/game/narrative/fixtures/make-golden.mjs
```

## Limits

- The fixtures come from the bible's sample flowcharts. They are **not** the G01A.2 V002 33-node graph, which was not available to this gate.
- Fixture-local IDs avoid the D41–D49 and W21–W29 ranges so they cannot collide with G01A IDs.
- Nothing here is canon, and nothing here is wired into the site.
