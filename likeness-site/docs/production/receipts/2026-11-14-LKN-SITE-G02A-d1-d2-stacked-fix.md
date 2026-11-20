# Session exchange receipt

- Session ID / local date / sender / receiver: LKN-SITE-G02A (D1/D2 stacked fix) / 2026-11-14 (Los Angeles) / Claude / Codex + founder
- Repository / task / allowed paths: `bthoreau88/likeness-universe` / fix PR #25 blockers D1 + D2 as a PR **stacked on** Codex's branch (founder-approved 2026-11-11) / `Threads.tsx`, `Journey.tsx`, `useScrollCanvas.ts`, `CinematicReveal.tsx`, `Street.tsx`, `scripts/production/original-media.test.mjs`, docs
- Canonical source baseline SHA / observed Pages SHA: `1e8d2ab` (moved from `c53809b` via PR #32, docs only) / `00353a9`
- Feature branch / implementation head SHA / PR URL: `claude/lkn-site-g02-d1-d2-fixes` / `fc2ca7f` (+ this docs commit) / PR into `codex/lkn-site-g02-originals-editorial-v001` (link in PR #25 comment)
- Merged source SHA / published Pages SHA / Pages run URL (or pending): pending — no merge, no publish. Codex's branch is not modified; this PR merges into it only on review.
- Input batches read / further uploads pending: none
- Decisions superseded (explicitly) / preserved authorities: none. Image choices are founder picks from existing site stills; no new art; canon/registry untouched.

## Delivered

| Path | Change and reason | Evidence |
|---|---|---|
| `src/components/sections/Threads.tsx:29` | "The Street" card: `/frames/frame_0044.jpg` (deleted) → `/stills/thoreau-stealth.png` (founder pick) | slots contact sheet |
| `src/components/companion/Journey.tsx:35` | Stage I "Found": `/frames/frame_0012.jpg` (deleted) → `/stills/open-world-city.png` (founder pick) | slots contact sheet |
| `src/components/atmos/useScrollCanvas.ts:88–89` | Outro toggles `inert` with visibility: hidden CTA leaves the Tab order and the a11y tree (D2) | focus scans |
| `CinematicReveal.tsx`, `Street.tsx` outro containers | Start `inert`, so the static HTML is safe before hydration | focus scans |
| `scripts/production/original-media.test.mjs` | +2 tests scanning **all** of `src/`: no `/frames(2)/` refs; every `/stills`, `/subjects`, `/video` path exists. The old test only read `frames.ts`, which is why D1 slipped through. | red on `d9e152b` (names Journey.tsx + Threads.tsx), green here |

## Verification — combined tree (this PR + PR #25 + PR #26 + canonical `1e8d2ab`, local trial merge, not pushed)

| Check | Outcome |
|---|---|
| Git merge | auto-merged (`Journey.tsx`, `Navbar.tsx`); no conflict markers |
| npm ci / lint / validate:production / test:production (19/19) / tsc | pass (exit 0) |
| `NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build` | pass, 30 pages, with the uncommitted local-font swap (sandbox blocks Google Fonts); CI must build unmodified source |
| Browser, 12 routes × 390/768/1440 (Chrome) | **0 of 36** with HTTP errors, broken images, overflow, console errors or axe WCAG 2.2 AA violations |
| Internal links | 23/23 return 200 |
| Hidden focus (D2) | none on desktop or mobile once fade-ins settle (the "Meet the two" and mobile-nav regressions are gone) |
| Reduced motion (PR #26) | wheel native (800 px at 30 ms), reveals `none`, `/journey` static; normal mode unchanged |
| Smoke: 25 routes × both motion modes | 0 errors, 0 failed responses |
| Safari / VoiceOver / NVDA / real device | **not_run** |

## Founder flag (not a code defect)

`open-world-city.png` in `/journey` Stage I: under Journey's grade (grayscale, brightness 0.7, gradients) the scene is nearly black, and the most legible elements are the burned-in game HUD: a **pistol icon, ammo "10", "…37%"**. Story law (AGENTS.md) states "No combat, no bodies, no guards." Recommend re-picking (e.g. `three-tapes`, `thoreau-watching`) or approving a purpose-made exterior still. One-line change at `Journey.tsx:35`.

## Gate status / boundaries

- D1, D2: fixed in this PR (pending review). PR #25 remains draft; G02B still not ready (identity sign-off, motion source, device QA).
- Not touched: registry, canon, Codex's branch tip, gh-pages. No assets added or generated.
- Rollback: close this PR (Codex's branch is unaffected) or revert `fc2ca7f`.
