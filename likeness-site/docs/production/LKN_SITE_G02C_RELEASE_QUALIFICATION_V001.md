# LKN-SITE-G02C — Consolidated Acceptance & Production Release Qualification V001

**Date:** 2026-11-28 · **Studio:** Omnia Vanitas Studios · **Product:** LIKENESS UNIVERSE / LIKENESS : THE GAME  
**Disposition:** **HOLD — candidate not approved or published**  
**Scope:** evidence reconciliation and release-preflight packet only. No application, registry, character, canon, media, deployment or other PR changes in this milestone.

## 1. Release baseline and authority

| Item | Observed ref / status |
|---|---|
| Repository | `bthoreau88/likeness-universe` |
| Canonical **source** | `claude/dreamy-hawking-VcoBe` @ `3a87155dfeaff4401275c24e53b30f4c06cac086` |
| Generated **Pages** branch | `gh-pages` @ `00353a9066566febcd16f421f64cf46ef5813c0b` |
| Published `production-release.json` | `source_sha=1c929ec2376d4b832dae69e68823c85b23816e4e`, `previous_pages_sha=05fce99bc9ade66efefbe4ae842796f3f4fe797e`, `base_path=/likeness-universe` |
| Source-vs-published difference | 56 commits ahead, zero behind as observed (compare the two source SHAs). This is **not** a quality or release approval metric. |
| Site | https://bthoreau88.github.io/likeness-universe/ |
| Read-first rules | `likeness-site/CODEX_HANDOFF.md`, `AGENTS.md`, `docs/production/WORKFLOW.md` |
| Source CI | `.github/workflows/likeness-site-validate.yml` is **validation only**, not Pages publication |
| Runtime / host | Next.js 16.2.7 static export, Node ≥22, `NEXT_PUBLIC_BASE_PATH=/likeness-universe` |

The development workstation (MSI) was **offline** at this session's check. A clean checkout could not reach GitHub from this execution container. Therefore `publish.py --check` and local build/browser/real-device testing were **not executed here**. The latest workflow and repository records below are evidence from completed earlier runs, not fresh local execution. Public web retrieval of the live home returned an older crawl; other route fetches were inconclusive. No claim of complete live-route verification is made.

The current code and project are not equivalent to the stale live Pages export. Do not compare screenshots from old Pages against new source and call them accepted.

## 2. Reconciliation of completed and outstanding work

| Ref | Disposition | Impact on this release |
|---|---|---|
| PR #25 | **MERGED**; original-character scroll bridge, Works index, four work pages, three dossiers | Present in canonical via #35. Superhero demo frame directories retired from source; provisional stills are **not identity-locked motion** |
| PR #26 | **MERGED**; mobile menu, Room 14 keyboard/WebGL fallback, reduced motion | Present in canonical. Real screen-reader and Safari checks still needed |
| PR #33 | **CLOSED, not merged as PR** | D2 invisible-focus fix and all-`src` media regression were integrated by PR #35; do not reapply the old image choices |
| PR #34 | **MERGED**; Journey weapon HUD remediation and marketing roadmap | Journey Stage I uses `/stills/thoreau-stealth.png`, not the weapon-HUD screenshot |
| PR #35 | **MERGED**; integrated #25/#33 with conflict resolution | Canonical HEAD `3a87155`; source-validation workflow for PR #35 head completed **success** (run `44676085806`). This is not Pages verification |
| PR #24 | **OPEN DRAFT**; G01 audit document only | Historical review; no need to cherry-pick app files |
| PR #36 | **OPEN DRAFT**; coordination + FD-003 prompt links + mobile-menu trap + unrelated game-lane reference engine | **Do not merge wholesale** into a website release. Requires selective disposition and independent review |
| PR #37 | **OPEN DRAFT**; narrower website FD-001/FD-002/FD-003 corrections | Founder choices required: title hierarchy, Journey interim art, and meaning of “internal” prompt library. Overlaps #36 |
| PR #38 | **OPEN DRAFT**; editorial controls and 44 WebP derivative files | Native-scale visual QC and approval to switch references pending. Original PNG production refs remain active in this PR |
| PR #39 | **OPEN DRAFT**; proposed character fidelity production law | Separate game/identity acceptance. **Do not conflate with site release** |

PR heads #36, #37 and #38 each have successful PR source-validation runs (`44965659796`, `44990852584`, `45714517013` respectively). **Three independent green runs do not validate a combined tree or authorize merges.** #36 and #37 overlap in Navbar, Sitemap, Prompts route and Universe components; reconcile their intent and changed lines once, never land both blindly.

## 3. Verified source properties (not live-browser claims)

- `src/lib/frames.ts` points scroll sequences to `SCROLL_SEQUENCES` in `src/lib/registry.ts`: **six** home stills and **eight** street stills. Crossfades are provisional, not new 169-frame character motion.
- `src/components/companion/Journey.tsx` Stage I uses `/stills/thoreau-stealth.png`. `src/components/sections/Threads.tsx` Street card uses `/stills/thoreau-watching.png`. This matches the #35 conflict resolution.
- `src/components/atmos/useScrollCanvas.ts` sets the outro `inert` flag, avoiding the invisible-but-focusable CTA regression.
- Eight additional static page route entrypoints exist in the merged source; PR #35's validation cites a 30-entry static export. **Fresh deploy checks still required**.
- `src/components/ui/Navbar.tsx` still presents a prominent `/prompts` CTA and `// TAPE-03` context; `src/app/sitemap.ts` includes `/prompts`; the route exists publicly.
- `src/lib/registry.ts` `INTAKE.steam`, `discord`, and `newsletterAction` are empty; GitHub development-follow URL is configured. Never invent store or email destinations.
- The registered flagship game cover is `/stills/poster-room14.png`, flagged in the roadmap because its artwork reads “TAPE 003.” Treat title/art work as founder-gated, not an automatic code refactor.

## 4. Blockers and release acceptance matrix

| Gate | Evidence now | Required before publishing | Status |
|---|---|---|---|
| **A1 exact source** | Canonical and Pages SHAs reconciled | Freeze a **new** final merged source SHA after any approved PRs | **PENDING** |
| **A2 site PR disposition** | #36/#37 overlap and #38 is pending review | Founder selects accepted changes; independent code review and separate approved merges; no duplicate cherry-picks | **BLOCKED — approval** |
| **A3 public/internal boundary (FD-003)** | Public `/prompts` route and content remain in source; proposed noindex/link removal is not access control | Decide public vs truly private. If internal, remove the prompt content from **public output and public source**, with approved preservation in a private system; verify from a clean public browser | **BLOCKED — decision** |
| **A4 game vs TAPE 03 distinction (D7/FD-002)** | TAPE 03 context remains prominent; game cover conflicts with title | Founder approves interim companion release, or an exact title/logo/cover correction; no unapproved creative change | **BLOCKED — visual authority** |
| **A5 character / media rights** | Demo superhero images retired from source; existing identity stills are bridge assets | Founder reviews public use, face fidelity, and hero/gallery covers; do not imply G02B motion approved | **BLOCKED — human QC** |
| **A6 accessibility** | Automated Chromium QA and keyboard checks reported on earlier candidate PRs; mobile-nav trap and two moderate axe findings documented in #36 | Test final combined build with keyboard, mobile menu focus, 44px targets, 390/768/1440px layouts, reduced motion; **real Safari + VoiceOver/NVDA** evidence (or explicit documented risk disposition), fix critical blockers | **PENDING** |
| **A7 performance** | Previous measured PNG-vs-WebP encodes; #38 keeps masters and derivatives but no production swap | Check real mobile network waterfall/LCP/INP; founder approves dark-grade derivatives before switching refs. Do not confuse repository asset totals with page transfer metrics | **PENDING** |
| **A8 builds & tests** | PR #35 and #36–#38 individual CI runs succeeded | On **final combined exact commit**: `npm ci`, `npm run validate:production`, `npm run test:production`, `npm run lint`, base-path `npm run build` and any required newer suite; attach logs | **PENDING** |
| **A9 approved publishing** | Safe publisher in `scripts/production/publish.py` and `WORKFLOW.md` | Explicit founder release authorization; clean checkout; `--check`; read fresh source and Pages SHAs; use guarded `--publish` | **NOT AUTHORIZED YET** |
| **A10 live release** | Old Pages release marker and old home available; other live routes not verified | New Pages SHA, green **pages build and deployment** run, manifest matches final source, live route and asset smoke test | **NOT EXECUTED** |

**Security-sensitive note:** A page marked `noindex` and removed from menus is *still public* on GitHub Pages; the underlying public repo/JS bundle may expose the prompts. Never claim FD-003 is solved by noindex alone. If a private library is the actual requirement, it is a **separate hosting/content migration**, not a hidden-link patch.

**Known outstanding UX/content issues:** Journey Stage I interior visual under exterior labeling; D7 “TAPE 003” game cover; cropped portrait covers; pending work on focus/touch targets and filter-result announcements; three `animate-pulse` elements under reduced motion reported in #37; pre-existing axe `link-in-text-block` findings on `/devlog` and `/alt` reported in #36. Check each against the **chosen release candidate**; do not call them fixed merely because another draft proposes a patch.

## 5. Proposed one-release candidate strategy

1. **Freeze to the canonical HEAD** and issue a founder-facing decision sheet for FD-001 (exterior art), FD-002 (title hierarchy), FD-003 (public/internal prompts), D7 (flagship cover), and G02B provisional character stills. Give the founder one consolidated film/site-level review, not serial micro-approvals.
2. **Choose one source of truth** for overlapping #36 and #37 website changes; keep #36's unrelated game narrative reference engine out of the Pages-release patch. #38 editorial controls and visual derivatives are separately reviewable; do not add all WebPs merely to imply a production optimization already shipped.
3. Create a small, reviewable **release candidate PR** from fresh canonical for the approved site-only fixes and any accepted source tests. No new canon, story IDs, Unreal changes, paid generation or large design overhaul.
4. Fresh CI, local static preview and device QA on that exact release candidate. Record either PASS or a named exception accepted by the founder. No inferred Safari/screen-reader results.
5. Merge approved release PR only after human acceptance. Re-read both branch tips and publish from the merged exact source using the guarded script. Verify Pages and public content before declaring the gate complete.

**Do not publish source `3a87155` simply because it is newer than Pages.** Its outstanding public/internal and identity decisions still exist.

## 6. Publication operator checklist (only *after* approvals)

From a **clean checkout of the merged canonical source**, not from this docs-only feature branch:

```bash
git fetch origin claude/dreamy-hawking-VcoBe gh-pages
git switch claude/dreamy-hawking-VcoBe
git pull --ff-only origin claude/dreamy-hawking-VcoBe
git status --porcelain
cd likeness-site
npm ci
npm run validate:production
npm run test:production
npm run lint
NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build
python3 scripts/production/publish.py --check
# Record the FRESH source/pages SHAs printed by --check after the above tests.
# Run only with explicit founder publication approval:
python3 scripts/production/publish.py --publish \
  --expected-source "FRESH_REVIEWED_SOURCE_SHA" \
  --expected-pages "FRESH_REVIEWED_PAGES_SHA"
```

The publisher itself reinstalls locked dependencies, validates/tests/lints/builds, checks that all routes export, writes `.nojekyll` and `production-release.json`, and rechecks both remote tips before an ordinary non-force push. **Do not** substitute the snapshot SHAs in §1 without running `--check` again. If another agent updates either branch, **STOP**, fetch, review and rebuild.

Then verify the GitHub `pages build and deployment` workflow is green for the **new Pages SHA**, inspect live `/`, `/devlog/`, `/room-14/`, `/works/`, `/characters/thoreau/`, `/street/`, and actual `/likeness-universe/_next/` and image asset URLs. Check public `production-release.json` references the exact merged source commit and validate both the intended inclusion/exclusion of `/prompts/` and the absence of Iron Man media. Capture mobile/desktop screenshots from the **live** build.

If publication fails, do not force-push or reset Pages. Inspect the Pages run logs; perform a reviewed source revert by new PR if needed, then publish from the resulting current canonical source with the guard.

## 7. Final disposition

**G02C preparation and repository reconciliation: PASS.**  
**G02C acceptance: HOLD / founder decisions and cross-browser QA outstanding.**  
**G02C publication: NOT STARTED / NOT AUTHORIZED.**

This record does not merge #24/#36/#37/#38/#39, change any production files, release new art, spend credits, or modify `gh-pages`. The next actionable deliverable is **a single approved site-release candidate**, not another broad initiative.

## 8. Evidence and links

- [Source handoff](../../CODEX_HANDOFF.md), [AGENTS](../../AGENTS.md), [WORKFLOW](WORKFLOW.md)
- [Marketing roadmap](LKN_SITE_MARKETING_ROADMAP_V001.md)
- [PR #25](https://github.com/bthoreau88/likeness-universe/pull/25) · [PR #26](https://github.com/bthoreau88/likeness-universe/pull/26) · [PR #33](https://github.com/bthoreau88/likeness-universe/pull/33) · [PR #34](https://github.com/bthoreau88/likeness-universe/pull/34) · [PR #35](https://github.com/bthoreau88/likeness-universe/pull/35)
- [PR #36](https://github.com/bthoreau88/likeness-universe/pull/36) · [PR #37](https://github.com/bthoreau88/likeness-universe/pull/37) · [PR #38](https://github.com/bthoreau88/likeness-universe/pull/38)
- [Published release marker](https://github.com/bthoreau88/likeness-universe/blob/gh-pages/production-release.json)
- [PR #35 validation](https://github.com/bthoreau88/likeness-universe/actions/runs/44676085806)
