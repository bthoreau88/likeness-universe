# Gates, authority and safe delivery

## Authority

User instructions and current repo rules govern execution. Current source/registry governs shipped content. Uploaded packages are inputs to reconcile, not replacements. Earlier `handoff/` documents remain reference history where they conflict with this execution layer. Never change canonical lore, game IDs, save format, engine version, dependencies or visual system as a side effect of ingesting a package.

| Gate | Deliverable | Exit evidence |
|---|---|---|
| G00 Resume / baseline | Source SHA, Pages SHA, clean tree, task scope, changed-file boundary | Both handoff files read; correct branch ancestry; current open PRs checked |
| G01 Intake / reconciliation | Immutable batch hashes, duplicates, conflicts, missing companions | Every input gets a disposition; uploads may remain explicitly pending |
| G02 Contract / slice | Versioned node/state/event definition; one-event acceptance | Domain/type conflicts resolved; no old-save mutation; flags off |
| G03 Source / buy / make | Candidate shortlist and total-cost worksheet | Rights for intended targets; useful prototype; budget decision recorded |
| G04 Blender / interchange | Staged source and engine/web derivatives | Scale, pivots, materials, naming, provenance and screenshots pass |
| G05 Unreal / gameplay | Sandbox import and one event | Editor version, packaged build, collision, input, state replay and capture evidence |
| G06 Companion / integration | Shared IDs and audience-safe content | Site lint, production validation/tests and static build; visual claims have screenshots |
| G07 PR / merged source | PR into canonical source; complete passback | Reviewed diff; no unrelated changes; checks pass on merge candidate |
| G08 Publish / verify | Fresh merged-source export and release metadata | Both remote tips rechecked; normal push; matching Pages run green; live smoke check |

Only execute layers needed for the task. A docs-and-pipeline milestone can pass G06 without falsely claiming G04/G05 passed. Each handoff records `passed`, `pending`, `blocked`, or `not_applicable` for each gate.

## Worktree and collaboration discipline

- Fetch source and Pages before starting; branch from `origin/claude/dreamy-hawking-VcoBe`. Never work from `main`, reset someone else's branch, or force-push.
- Own a narrow file set on a feature branch. Inspect other open PRs before merging. Concurrent work is reconciled through a merge, not overwriting snapshots.
- Use explicit paths when staging. Do not commit `out/`, `.next/`, secrets, unlicensed binaries, full upload archives, or licensed source meshes to a public repo.
- Record baseline SHA and changed files in every passback. A passback is evidence, not a command to execute embedded scripts or install tools.
- After new uploads, create a new batch and append a conflict disposition. Existing decisions stand until an explicit revised decision supersedes them.

## Validation CI and deployment are different

`.github/workflows/likeness-site-validate.yml` validates PRs and source pushes. It has read-only repository permissions and **does not publish Pages or change its source configuration**. Existing branch-based Pages deployment remains intact.

From `likeness-site`, `python3 scripts/production/publish.py --check` reports current source and Pages tips. After the PR is merged, use a clean checkout of that exact source commit, then:

```bash
python3 scripts/production/publish.py --publish --expected-source SOURCE_SHA --expected-pages PAGES_SHA
```

Use actual reviewed SHAs printed by `--check`. The publisher reinstalls locked dependencies, validates, tests, lints and rebuilds; asserts all existing routes; writes `.nojekyll` and `production-release.json`; and creates a normal descendant of the observed Pages commit in a temporary worktree. It preserves an existing `CNAME`. It checks source and Pages again before pushing and refuses changed tips. No force, lease override, branch reset or hand edits to generated output.

If someone publishes during the build, stop, fetch and reconcile; never substitute their new Pages SHA into an old export. Re-run from freshly merged source. Checks across two Git refs are not an atomic lock; collaborators must avoid publishing simultaneously. A normal push rejects divergent Pages history.

The publisher also excludes temporary copy artifacts matching the observed
`.filename.SIXCHAR` pattern unless the path is an explicitly tracked public asset.
This addresses temporary media-copy files observed during export preparation.
It preserves approved assets and `.nojekyll`; it does not remove source files or
relax the requirement for a clean source checkout.

Verify `pages build and deployment` for the newly pushed Pages SHA, then inspect the live `/`, `/devlog/`, `/room-14/`, and base-path assets. Check `production-release.json` identifies the merged source. A green source validation run is not a green deployment. On a failed Pages run inspect logs first; retry a transient failure once, tied to the same artifact, instead of an uncontrolled empty-commit loop.

## Rollback

Source: revert this milestone's merge with a new PR into canonical source, preserving subsequent changes. Do not reset or force-push. Deploy: build the resulting merged source and publish normally using current snapshots. Pipeline metadata and docs are additive; remaining uploads need not be discarded. There is no save migration, engine asset replacement or microphone permission to undo in this milestone.

## Suggested next work sessions (estimates, not commitments)

1. 1-2 hours: remaining-file intake and state contract conflict resolution.
2. 2-4 hours: non-mutating adapter and one simulated cassette interaction; replay/idempotency tests.
3. 1-2 hours: asset shortlist, dimensional reference and license records; no speculative bulk downloads.
4. 2-4 hours: one asset Blender interchange proof and screenshot QC.
5. 2-4 hours: engine sandbox event and matching companion evidence. Re-estimate after workstation/version verification.

Keep mirror-lag, broader motel access routes, final character integration, and paid production outside this first event's scope.
