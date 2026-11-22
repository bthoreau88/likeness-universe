# UE narrative-state adapter — specification V001

Gate: **OVS-GAME-BRANCH-G01A.3**, Unreal adapter preflight.
Coordinating handoff: OVS-LKN-COORD-G01 V001.
Status: **design preflight only.**

- No Unreal code has been compiled or executed for this gate.
- No production Unreal asset has been touched.
- Every "UE" statement below is a design requirement, not a verification claim.

The executable reference for this spec is `engine/narrative-engine.mjs`. It is a pure ES module, and its tests run under Node and in headless Chromium. The Unreal implementation must reproduce its behaviour against the same fixtures (§11).

## 0. Sources and what they are allowed to decide

| Authority | Version / location | Used for |
|---|---|---|
| Tape 03 Branching Narrative Bible | V.002, Drive `1OFRqwpvyDXxYMLvVa7pr3bvUTpYbrxhY` | Node anatomy §05, variables §07, data tables §13, JSON template §15, UX §16, QC §17 |
| LIKENESS : THE GAME Production Bible | V001, `handoff/OVS_LIKENESS_THE_GAME_Production_Bible_V001.pdf` | Project frame (no combat, Room 14 vertical slice) |
| LKN-GAME-UNIFY-G01 approved source | OVS-OS `codex/lkn-game-unify-g03a1-reconciliation` | Inherited law: "deterministic events outrank derived snapshots; Game Truth and Witness Projection are separate ledgers; narrative `APP_SYNC` may disagree while engineering sync stays healthy" |
| OVS-GAME-BRANCH-G01A.2 V002 (33 nodes, 7 chapter outcomes, 28 provisional utterances) | **Not available to this gate** | — |

Because G01A.2 V002 was unavailable, the following were **not** done:

- its node IDs were not preserved or remapped;
- its outcomes were not encoded;
- its utterances were not loaded.

The adapter is designed so that a G01A.2 graph loads unchanged once it is supplied in the §2 format. The 33 IDs stay as they are, and the 7 outcomes are just `outcome` nodes.

## 1. Ownership and data flow

```
             authoring (JSON, versioned in git)
                         │  import + validate (editor-time)
                         ▼
   UNarrativeGraphAsset (UPrimaryDataAsset, read-only at runtime)
                         │
                         ▼
 ┌──────────── ULikenessNarrativeSubsystem (UGameInstanceSubsystem) ────────────┐
 │  FNarrativeRunState      game truth for ONE playthrough (commit target)      │
 │  FNarrativeDiscovery     history across playthroughs (never read by gates)   │
 │  Commit(FNarrativeDecision) ── transactional; emits events after commit      │
 └───────────┬──────────────────────────┬──────────────────────────┬───────────┘
             │ OnNodeEntered/OnOutcome  │ SaveGame (slot per run)  │ ExportCompanionProjection()
             ▼                          ▼                          ▼
   Dialogue / Sequencer           ULikenessSaveGame          read-only JSON for the website
```

- The **game owns committed narrative truth.** The website only consumes `ExportCompanionProjection()` output (§9) and has no write path. Bible V.002 §13 Phase 02 browser storage is limited to the web prototype; it is never a source for the game.
- **Run state and discovery are separate ledgers.** Gates read only the run state. Discovery feeds only the flowchart viewer. A replay can never inherit a flag from discovery.

## 2. Node and edge schema

The canonical schema is `schema/narrative-graph.schema.json` (JSON Schema 2020-12).

**Node types**, from Bible §05: `start`, `action`, `dialogue`, `timed`, `evidence`, `gate`, `convergence`, `outcome`, `callback`.

**Edges**:
- `next: [ "ID" | { to, when?, edge_label? } ]`.
- Gates use `pass` and `fail` instead of `next`.

**Fields beyond the bible:**

| Field | Purpose |
|---|---|
| `requires` | Condition for a node to be offered |
| `acknowledges[]` | Facts the node's line refers to (see W01 rule, §8) |
| `hidden` | Omit the node from the companion until it is adjacent to a discovered node |
| `continuity_patch{incomingId: note}` | Required on `convergence` nodes |
| `accessibility_fallback` | On `timed` nodes |

**UE mapping:**

```cpp
// DESIGN SKETCH — NOT COMPILED. Names are proposals for review.
UENUM() enum class ENarrativeNodeType : uint8 { Start, Action, Dialogue, Timed, Evidence, Gate, Convergence, Outcome, Callback };

USTRUCT() struct FNarrativeEdge     { FName To; FNarrativeCondition When; FText EdgeLabel; };
USTRUCT() struct FNarrativeNode {
  FName Id; ENarrativeNodeType Type; FText Label; FName Speaker;
  TArray<FNarrativeEffect> Effects; FNarrativeCondition Requires;
  TArray<FName> Acknowledges; TArray<FNarrativeEdge> Next;
  FNarrativeCondition GateCondition; FName Pass; FName Fail;            // Type == Gate
  TMap<FName, FText> ContinuityPatch;                                   // Type == Convergence
  bool bHidden = false; FText Hint;
  float TimedDurationSec = 0.f; FName AccessibilityFallback;            // Type == Timed
};
UCLASS() class UNarrativeGraphAsset : public UPrimaryDataAsset {
  UPROPERTY(EditAnywhere) FName ChapterId;
  UPROPERTY(EditAnywhere) TArray<FNarrativeNode> Nodes;
  UPROPERTY(VisibleAnywhere) int32 SourceSchemaVersion = 1;
  UPROPERTY(VisibleAnywhere) FString SourceSha256;                      // of the imported JSON
};
```

Graphs are imported from JSON by an **editor-only** importer that runs the same validation as `validateGraph()`. Any errors block the import; warnings are written to the asset's validation log. The runtime never parses authoring JSON.

## 3. Variables (frozen)

| Name | Kind | Range | Initial |
|---|---|---|---|
| `THOREAU_INTEGRITY` | int | 0–100 | 50 |
| `DRYA_TRUST` | int | 0–100 | 50 |
| `ROOM_MEMORY` | int | 0–100 | 10 |
| `PUBLIC_SIGNAL` | int | 0–100 | 0 |
| `POLICE_HEAT` | int | 0–100 | 0 |
| `EVIDENCE_STACK` | set of evidence ids | — | `[]` |
| `DARK_DRIFT` | int | 0–100 | 0 |
| `APP_SYNC` | int | 0–100 | 50 |

- Initial values come from the Bible §15 template.
- The 0–100 clamp is an adapter decision. The bible gives no range, so this needs founder confirmation (open question Q3).
- In UE, `EVIDENCE_STACK` is a `TSet<FName>` that is serialised sorted.
- Names are `FName` constants generated from one header. No other variable names are legal; the importer and the save loader both reject unknown names.

## 4. Typed condition evaluation

Conditions are a closed AST and are never strings. The Bible §15 template's `"EVIDENCE_STACK.length >= 2"` is converted at import.

```
Cond := { all:[Cond+] } | { any:[Cond+] } | { not:Cond }
      | { var:INT_VAR, op:(<,<=,==,!=,>=,>), value:int }
      | { evidence:ID } | { evidenceCount:{op,value} }
      | { flag:ID, is?:bool } | { visited:NODE_ID } | { fact:FACT_ID }
```

In UE this is an instanced-struct tree, `FNarrativeCondition` holding `TArray<FInstancedStruct>` children. Evaluation is pure: `bool Evaluate(const FNarrativeRunState&)`. Using numeric operators on `EVIDENCE_STACK` is an import error.

## 5. Validated state mutation

Effects are a closed set:
- `var add|set int`, clamped;
- `evidence add|remove`;
- `flag = bool`;
- `fact` (monotonic within a run).

Effects run only inside `Commit()` (§7), never from Blueprint directly. The subsystem exposes no setter for individual variables; tools and debug paths go through `Commit()` with a debug decision id.

## 6. Persistent callback flags and facts

- **Flags** (`FName → bool`) are the bible's "delayed callback" memory. Examples: `witness_callback_armed`, `route_public_cut_unlocked`. They persist for the run and are saved.
- **Facts** are what the player character currently knows. They exist so that dialogue can be conditioned on knowledge rather than on node visits (§8).
- Flags and facts are run state. Neither carries over to a new playthrough.

## 7. Transactional decision processing

```
Commit(Decision{ DecisionId, To }):
  if DecisionId already in Run.Decisions: return Unchanged        // duplicate-event prevention
  if Run.Ended: fail E_ENDED
  if To not in AvailableChoices(Run): fail E_CHOICE
  Working = copy(Run)
  loop: enter node (check Requires, apply Effects, mark visited);
        if node is Gate: follow Pass/Fail by evaluating against Working; continue
  Working.Decisions += DecisionId; Working.Revision += 1; Working.Log += entry
  Run = Working                                                    // single assignment = commit
  broadcast events for every entered node, in order                // only after commit
```

- **Decision ids** are generated once per player input, for example `"{RunId}:{Revision}:{ChoiceIndex}"`. Retries, double-clicks and network replays therefore reuse the same id.
- **No partial application.** An error leaves the run unchanged.
- **Events fire only after commit.** Listeners (Dialogue, Sequencer, UI) can never observe a half-applied state, and cannot re-enter `Commit()` during a broadcast; such calls are queued.

## 8. Replay, discovery separation, and dialogue conditioning

- **`FNarrativeDiscovery`** holds per chapter: discovered nodes, outcomes seen, completed, and run ids. It is updated only from a committed run. Merging is a set union, so it is order-independent and never loses data.
- **Replay** (new playthrough): creates a fresh `FNarrativeRunState` from the graph's initial values. Discovery is retained. Gates never read discovery.
- **Determinism**: `Replay(graph, runId, decisions)` must give a byte-identical serialised state. The save loader uses this to prove a save is consistent with its own decision log (§10).
- **W01 rule** (dialogue conditioning): a node's `acknowledges[]` facts must be known on every route that reaches it. The validator computes known facts as an intersection over paths and flags violations. At runtime, a line is offered only if `Requires` passes, and authoring adds `{fact: X}` to `Requires` for any line that mentions X. The reference tests show:
  - W01 may not acknowledge `app_shows_unplayed_node`;
  - D60 may not mention the monitor, because D60 is reachable via ledger + bell without the monitor.

## 9. Read-only web companion export

`ExportCompanionProjection(ChapterId) → JSON` mirrors `projectForCompanion()`:

| Node state | What the companion shows |
|---|---|
| Discovered | Full label |
| Locked | `"???"`; a hint only after the chapter has been completed once |
| Hidden | Omitted until adjacent to a discovered node |

- Variable values are never exported (Bible Rule 07). Only coarse bands (`low`, `mid`, `high`) for a small set of variables are exported, and only for the current run.
- The output has `readOnly: true` and a schema version.
- The website must treat it as a projection and must never post it back. There is no import path from web to game in this gate.

## 10. SaveGame serialisation, versioning and migration

- **Envelope** (`schema/save.schema.json`): `{ kind:"likeness.save", schemaVersion:2, savedAt, checksum, run, discovery }`.
- **Checksum**: FNV-1a over canonical JSON. This is an integrity check against truncation and hand-edits, not a security measure.
- **UE implementation**:
  - `ULikenessSaveGame : USaveGame` stores `SchemaVersion` and the envelope fields as UPROPERTYs.
  - It is also serialised to the canonical JSON so that the cross-implementation checksum matches the reference engine.
  - Slots: one per playthrough (`Run_<RunId>`), plus one discovery slot per profile.
- **Load order**, rejecting with a code at the first failure and never partially loading:
  1. parse;
  2. `kind`;
  3. version not in the future;
  4. checksum;
  5. migrate stepwise (`MIGRATIONS[v] : v → v+1`, pure functions);
  6. variable range and name checks;
  7. graph compatibility (chapter, node ids);
  8. decision-log replay equality (skipped only for migrated v1 saves that have no log, and reported as `replayVerified:false`).
- **Codes**: `E_SAVE_JSON`, `E_SAVE_KIND`, `E_SAVE_FUTURE`, `E_SAVE_CHECKSUM`, `E_SAVE_MIGRATION`, `E_SAVE_VAR`, `E_SAVE_GRAPH`, `E_SAVE_REPLAY`.
- **Corrupt saves are quarantined, never deleted.**
- **Graph edits after ship** need a migration that remaps node ids. Node ids are otherwise immutable, in line with the "preserve the 33 node IDs unless a migration is approved" rule.

## 11. Dialogue and Sequencer interfaces

| Interface | Direction | Contract |
|---|---|---|
| `FOnNarrativeNodeEntered(ChapterId, NodeId, NodeType)` | subsystem → listeners | After commit, once per entered node, in order, gates included |
| `FOnNarrativeOutcome(ChapterId, OutcomeId, Tags)` | subsystem → listeners | Once per run per chapter end |
| `GetAvailableChoices()` | UI → subsystem | Labels plus ids only; never exposes gate math |
| `INarrativeDialogueSource::GetLineFor(NodeId)` | subsystem → dialogue system | Returns the line asset or row; the subsystem refuses if `Requires` fails (W01) |
| `UNarrativeSequencerBridge` | Level Sequence event track → subsystem | Sequencer may call `Commit()` only with authored decision ids bound to event keys; scrubbing in the editor uses a sandbox run state |
| `ExportCompanionProjection()` | subsystem → web | §9 |

## 12. Test fixtures and acceptance for the UE implementation

The fixtures live in `fixtures/`:

| File | Content |
|---|---|
| `T03_01_dellwood_checkin.bible-v002.json` | Bible §09 |
| `T03_02_room14_remembers.bible-v002-template.json` | Bible §15, verbatim |
| `T03_05_website_mirror.bible-v002.json` | Bible §11, with labelled assumptions |
| `playthroughs.golden.json` | 11 scripted routes with expected end state and checksum |

The UE implementation passes when **all** of the following hold:

1. **Graph import** gives the same errors and warnings as `validateGraph()` for the three fixtures. In particular, T03_02 must report `N060` as unreachable.
2. **Golden playthroughs**: every route ends at the same outcome with identical `vars`, `flags`, `facts` and canonical checksum.
3. **Duplicate decisions**: a repeated decision id is a no-op, and an invalid choice leaves state byte-identical.
4. **Save round trip**: the serialised envelope is byte-identical to the reference engine's for the same run, and every malformed case in `tests/narrative-engine.test.mjs` is rejected with the same code.
5. **Companion projection**: the JSON matches the reference projection for the same discovery state.

None of these have been run in Unreal. Running them needs the UE 5.8 sandbox, which is currently resource-blocked; see the G06 status.

## 13. Open questions for the founder

| # | Question | Blocks |
|---|---|---|
| Q1 | Supply the G01A.2 V002 package (33-node graph, 7 outcomes, 28 utterances) | Node-ID preservation, D42/R13/R22/R23/W22 rulings, cold-read script assembly |
| Q2 | Bible §15 template: N060 is unreachable (max evidence on any route is 1; the gate needs 2). Fix the gate (≥ 1), add an evidence route before N040, or accept it as intentional | T03_02 fixture lock |
| Q3 | Variable ranges: is 0–100 with clamping the intended scale? | Balance pass |
| Q4 | D50 "Enough lobby evidence?" threshold: the fixture uses ≥ 2 as an assumption | T03_01 lock |
| Q5 | D50 routes on evidence, but its outcomes describe social temperature ("calm" / "suspicion"), which D10/D20/D30 decide. A player who lied (D20) and searched the lobby ends "clean / calm". Intended? | Causality sign-off |
