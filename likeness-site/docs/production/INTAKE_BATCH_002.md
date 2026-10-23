# Batch 002 reconciliation - 2026-10-23

Baseline: canonical source `0932dbbce73de4ee75a75423083763694df0071d`.
This batch adds ten upload records, not a replacement project. Batch 001 remains
unchanged. The total is now twenty uploaded files; the user has not declared the
upload set complete. No archive scripts, package managers or agent instructions
were executed from the uploads.

## Handoff package comparison

`../../data/production/handoff-comparison-002.json` records the byte comparison
against the existing `handoff/` tree, using the archive member hashes from intake.
Counts exclude directory entries and include repeated PDFs in export folders.

| Uploaded package | Files | Exact existing matches | Changed existing paths | Absent paths |
|---|---:|---:|---:|---:|
| V002 Expansions | 51 | 45 | 6 | 0 |
| V003 Blender MCP | 66 | 62 | 4 | 0 |
| V004 Milestone 01 | 88 | 84 | 4 | 0 |

The 205 file occurrences are cumulative package contents, not 205 new resources.
All paths already exist. Preserve the current versions:

- The uploaded asset CSV has only key, locket and room rows. The repo additionally
  has tape, mirror and black-device rows plus `inspect_text`. Restoring the upload
  would lose those additions.
- Current start/resume files contain newer execution links. V002's task board
  predates the Blender expansion; its expansion CSV lacks the newer Blender row.
- The existing Unreal-guide README includes a later community-reference note.
  Some CSV differences are also line-ending changes; a byte difference alone is
  not evidence of a useful content upgrade.
- V004's Vite scene and registry loader are already historical starter files.
  They are not the live Next.js app and must not be installed as its replacement.

## Other inputs

| File | Observed content | Disposition |
|---|---|---|
| VOL 05 Resource & Gap Bible | 30 PDF pages, gap analysis, sourcing, animation/audio, outsourcing, polish and schedule | Historical resource reference; budget/rights/performance claims require fresh evidence before use |
| Expansion Modules V002 PDF | 14 PDF pages; optional Image-Blaster, splats, Higgsfield and Unreal-reference tracks | Exact SHA-256 match to existing handoff PDF; no duplicate binary committed |
| Room 14 HTML | Saved page headed "Step inside the room"; relative JavaScript companion files absent | UI reference only; cannot recover a functioning 3D scene or Unreal project from this HTML |
| DNA Prompt Library Full | 46 PDF pages; boards, stills, video, campaign and repair prompts | Core reference edition; section index added, current prompt route preserved |
| DNA Prompt Library V002 Regenerated | 139 PDF pages; editorial wrapper and source rebuild | Separate formatted reference edition; not automatic story/identity authority |
| Eden Cut Full Polished | 96 PDF pages; alternate chamber-film treatment | Keep as alternate reference, separate from game canon |
| Eden Cut V002 Regenerated | 103 PDF pages; editorial wrapper plus alternate prompts | Same alternate family; retain both hashes and viewer-page routing |

All exact source hashes and ZIP member hashes are in `intake-batch-002.json`.
The four prompt PDFs have their own `prompt-source-index.json`; see
[prompt routing](PROMPT_SOURCE_ROUTING.md). Document page count is not prompt count.

## Claims not adopted from VOL 05

The source labels several capability gaps as closed, gives percentage estimates,
quotes tool prices and free access, assumes the script is done, and projects a
shipping schedule. These are document claims, not verified current project status.
Do not use them to mark engine milestones done or authorize spending. In particular:

- Blanket free Megascans/Quixel, mocap subscriptions, sound-library rights and
  evaluation software must be checked per current entitlement/license and target.
- A public resource page does not establish permission to redistribute its raw
  assets. Public GLBs and cooked game assets require distinct distribution checks.
- A facial-animation tool does not prove a character's identity, expression or rig.
- A reflection-delay recipe is a prototype proposal until timing, occlusion and
  performance work in the actual editor build.
- The existing total-cost worksheet and asset gates remain the execution policy.
  The source's budgets, percentages and schedule are retained only as historical
  estimates; no new current price or legal conclusion is asserted in this intake.

## Next safe work

Remaining uploads, if any, enter batch 003. Then reconcile the state schemas
already identified in batch 001 and implement one isolated inspect/evidence/recap
proof. These new documents do not resolve the categorical/numeric `PUBLIC_SIGNAL`
conflict or establish a migration between `ROOM_MEMORY`, `ROOM_TRUST` and
`ROOM_ATTENTION`. Do not infer a save adapter from a prompt library.

This milestone changes intake tooling and documentation only. It does not add
site routes, import engine binaries, generate media, purchase assets, migrate
saves or alter character identities. The existing live release remains useful
while the source-only intake work is reviewed.
