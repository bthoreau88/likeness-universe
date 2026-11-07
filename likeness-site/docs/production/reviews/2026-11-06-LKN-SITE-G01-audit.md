# LKN-SITE-G01 — Production Website Audit & Experience Qualification

**Version:** V001 · **Date:** 2026-11-06 · **Status:** SOURCE AUDIT COMPLETE / PRODUCTION QUALIFICATION NOT PASSED  
**Site:** https://bthoreau88.github.io/likeness-universe/  
**Repo:** https://github.com/bthoreau88/likeness-universe  
**Canonical source branch:** claude/dreamy-hawking-VcoBe  
**Reviewed source SHA:** c53809b2e68b6d1dce66f60a8879a8645d8a743d  
**Observed gh-pages SHA:** 00353a9066566febcd16f421f64cf46ef5813c0b  
**Release marker source SHA:** 1c929ec2376d4b832dae69e68823c85b23816e4e  
**Change boundary:** audit documentation only; no changes to site behavior, game canon, registered IDs, build settings, published pages, or assets.

## 1. Executive decision

Do **not** republish or expand the website as a side effect of this audit. The site has recognizable cinematic art direction and working source architecture, but it is not production-qualified. The highest-value corrective work is to control eager image traffic, add non-motion and non-WebGL access paths, fix keyboard navigation, and make the flagship game and nested TAPE 03 distinction intelligible to a first-time visitor. Those repairs should be delivered through a separate tightly scoped PR, validated, visually checked, merged, and then republished with the guarded publisher.

This is a **source-backed technical and heuristic UX audit**, not a claim of complete browser certification. The public home HTML was available for inspection; fetches of other live routes did not yield reliable runtime evidence. No direct browser screenshot, computed rendering measurement, screen-reader test, mobile interaction test, Lighthouse report, local npm ci/lint/build, or game/runtime playtest was available in this execution environment. The MSI remote device was offline. All items requiring those methods are marked unverified.

## 2. Baseline and release state

- Repository and source branch were verified; the repo default branch is main, which is unrelated to the companion site. Work must continue from claude/dreamy-hawking-VcoBe. Never change main or hand-edit gh-pages.
- Both required handoffs, likeness-site/CODEX_HANDOFF.md and likeness-site/AGENTS.md, were read fully. Also reviewed likeness-site/docs/production/README.md, WORKFLOW.md, and the 2026-10-26 story receipt.
- Source comparison: **the canonical source is 14 commits ahead of the last deployed source marker**. Those commits are largely documentation, staged production and gameplay materials, but include changes to registry.ts and package.json. This difference is a release-reconciliation gate, **not proof that the live site is broken**.
- Source validation workflow at .github/workflows/likeness-site-validate.yml installs with Node 22 and runs production checks, tests, lint and the base-path build on PRs targeting the canonical branch. It is not a Pages publisher.
- The 17-route site inventory appears in src/app and sitemap.ts; URLs other than the homepage remain **runtime smoke-test pending**.
- Release must follow scripts/production/publish.py --check and guarded --publish with newly observed source and pages SHAs **only after merge**, from a clean source checkout.

## 3. Findings, ranked

### G01-F01 · P1 · Eager sequence preloading / mobile byte pressure — VERIFIED SOURCE

**Evidence:** src/components/sections/CinematicReveal.tsx creates Image objects and assigns a URL for every one of CINE.count (169) inside the initial effect, not on viewport entry; src/components/companion/Street.tsx does the same for HERO.count (169). src/lib/frames.ts declares both counts.

**Measured repository inventory:** frames2 = 169 JPEGs, **10,400,429 bytes (9.92 MiB)**; frames = 169 JPEGs, **11,186,808 bytes (10.67 MiB)**; both together **21,587,237 bytes (20.59 MiB)**. These are asset sums, **not measured wire-transfer bytes**. The home client effect requests the frames2 sequence without waiting for the user to reach that section. The /street client effect requests the frames sequence when that route mounts.

**Risk:** avoidable early network contention with hero and static art, memory pressure on mobile Safari, and poor initial responsiveness. The preload gate waits for all 169 load/error completions before initializing the canvas. A failed image still counts as loaded, but rendering does not check naturalWidth and naturalHeight before calculating geometry and calling drawImage.

**Correction gate:** lazy/viewport-gated start; only an initial poster plus a limited frame window should load immediately; progressive on-demand prefetch and bounded cache; a visible still fallback and corrupt-frame guards. Measure total requests/bytes, LCP and INP with real mobile throttling. Preserve the source sequence and visual story; no new art generation.

### G01-F02 · P1 · Missing reduced-motion experience — VERIFIED SOURCE

**Evidence:** src/components/sections/CinematicReveal.tsx and src/components/companion/Street.tsx use scroll animation/canvas without checking prefers-reduced-motion. src/components/providers/SmoothScrollProvider.tsx always mounts Lenis. src/app/globals.css has a reduction rule for .eq-bar, **not** the .animate-marquee / .animate-marquee-rev classes or pinned-scroll sequences. The Room14 WebGL component animates continuously; Journey uses parallax transforms without a visible reduction branch in the reviewed source.

**Risk:** users requesting reduced motion still receive long pinned sections, animation and smooth scrolling.

**Correction gate:** matchMedia / useReducedMotion as appropriate; a meaningful still/step-through version of the scroll sequence; stop unnecessary parallax, marquee and continuous orbit for reduced-motion users. Validate on actual mobile and desktop reduced-motion settings.

### G01-F03 · P1 · Room 14 is pointer-only for core inspect actions — VERIFIED SOURCE

**Evidence:** src/components/companion/Room14.tsx selects evidence exclusively through pointerdown/move/up and raycasting against a WebGL canvas. An inspect overlay appears after pointer selection, but there is no keyboard-focusable list of inspectable evidence, keyboard selection model or 2D fallback alongside the canvas.

**Risk:** keyboard-only, screen-reader and WebGL-incompatible visitors cannot perform the advertised object-inspection experience. A working rendered canvas does not satisfy access parity.

**Correction gate:** provide a semantically labeled and keyboard-operable evidence list using existing EVIDENCE records in registry.ts, synchronized with the WebGL selection; focus/close behavior; clear no-WebGL fallback. Test Tab, Enter, Escape, focus return and VoiceOver/NVDA.

### G01-F04 · P1 · Closed mobile menu remains keyboard focusable — VERIFIED SOURCE

**Evidence:** src/components/ui/Navbar.tsx renders the overlay menu permanently and closes it using opacity-0 and pointer-events-none. Those CSS classes do **not** remove its Link elements from sequential keyboard focus. The toggle has aria-expanded but no corresponding aria-controls. Escape-to-close and initial/final focus handling are absent in reviewed source.

**Risk:** keyboard focus can enter invisible menu links; mobile navigation can become disorienting even when pointer interaction appears correct.

**Correction gate:** hide the closed menu from both accessibility tree and tab sequence (inert or equivalent verified strategy); add aria-controls, Escape handling, logical focus restoration, focus-visible states and menu announcement. Test desktop keyboard and mobile screen readers.

### G01-F05 · P1 · First-screen flagship positioning is ambiguous — VERIFIED CONTENT / EDITORIAL APPROVAL REQUIRED

**Evidence:** the publicly readable homepage leads with “OVS // LIKENESS · TAPE 03,” an apartment-waking premise, and the 3:14 AM evidence mechanics. The registry's NORTH_STAR and WORKS distinguish the flagship **LIKENESS : THE GAME** (Dellwood motel / Room 14) from **TAPE 03** (apartment / 3:14 AM). The home hero, art sections and technical pitch are currently much closer to TAPE 03 than to the game's umbrella product. The site's registry states the flagship separately.

**Risk:** new visitors may misunderstand whether they are browsing a game, a narrative film, a tape archive, or an art bible, reducing conversion and misleading expectations.

**Correction gate:** human-approved above-fold information architecture: LIKENESS : THE GAME as flagship; TAPE 03 explicitly a connected story artifact; one clear visitor action (explore game / follow development). Keep artwork and approved canon, and do not independently rewrite story. Avoid promising finished features where the registry flags IDEA / PROOF PENDING.

### G01-F06 · P2 · Intake has no player acquisition path — VERIFIED SOURCE

**Evidence:** registry.ts INTAKE has blank steam, discord and newsletterAction values. FollowCTA.tsx therefore hides those channels, leaving GitHub “Follow development.” The handoff identifies these channels as unconfigured.

**Risk:** the site has no direct in-site opt-in or wishlist conversion path. **Do not invent a Steam page, Discord invite or email endpoint.**

**Correction gate:** add only real, authorized destination URLs when they exist; verify live form submission and privacy disclosures before enabling newsletter.

### G01-F07 · P2 · Large static art inventory; actual network cost NOT MEASURED

**Evidence:** 39 PNG stills total **98,063,522 bytes (93.52 MiB)**; five subject PNGs total **14,450,079 bytes (13.78 MiB)**; public/video (three MP4s and two posters) totals **9,354,896 bytes (8.92 MiB)**. These are summed repository file sizes and **are not page-weight measurements**. Images are unoptimized in next.config.ts, as static export requires.

**Risk:** on any route presenting many source PNGs, responsive display sizing alone may not reduce transfer size. Converting approved stills into optimized derivative formats can reduce the cost without modifying artistic source authority.

**Correction gate:** capture route-by-route network waterfall; create optimized derivatives with retained originals and provenance, and update references only after visual and identity QC; verify mobile image quality.

### G01-F08 · P2 · Route metadata has multiple source lists — VERIFIED SOURCE

**Evidence:** registry.ts contains a ROUTES array, while src/app/sitemap.ts has another hardcoded list of 17 routes and src/components/ui/Navbar.tsx has an independently hardcoded set of nine navigation destinations. This deviates from the desired registry-first discipline even though the navigation can deliberately show a subset.

**Risk:** future routes can silently diverge across metadata, registry and UI.

**Correction gate:** define route metadata once in registry.ts with explicit nav and sitemap visibility, preserve expected URLs and order, and add parity checks. This is not permission to expose every route in the navbar.

### G01-F09 · P2 · No confirmed browser/assistive-tech QA evidence — VERIFICATION HOLD

The public home content was fetched, but no screenshot or responsive capture could be obtained, and the separate live routes could not be reliably fetched in this session. Site-wide claims about spacing, contrast, image fidelity, touch hit-targets, layout overflow, 404s, audio controls and WebGL availability therefore **remain unverified**, not “passed.” No runtime security vulnerability or broken URL is asserted without evidence.

## 4. Experience qualification matrix

| Test | Result | Exit evidence required |
|---|---|---|
| Handoff + branch/provenance | PASS | Correct canonical branch and both instructions read |
| Source/Pages release parity | HOLD | New release from merged and validated source |
| Registry/schema parity | NOT RUN THIS SESSION | npm run validate:production success |
| Production unit tests | NOT RUN THIS SESSION | npm run test:production success |
| ESLint/React Compiler rules | NOT RUN THIS SESSION | npm run lint success |
| Node 22 base-path static export | NOT RUN THIS SESSION | npm ci and NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build success |
| Home and all 17 routes | PARTIAL | Direct live HTTP and screenshot smoke test |
| Responsive 360/390/768/1440px | NOT VERIFIED | Captures and interaction recordings |
| Keyboard & screen reader | FAIL SOURCE GAP / LIVE UNVERIFIED | Tab, Enter, Esc, focus and assistive-tech proof |
| Reduced motion | FAIL SOURCE GAP / LIVE UNVERIFIED | Reduced-motion visual proof |
| Performance budget | NOT MEASURED | Mobile Lighthouse, Core Web Vitals and network waterfall |
| Conversion actions | LIMITED BY CONFIG | Verified real destination and test submission |
| Game-story authority | HOLD FOR FOUNDER | Explicit sign-off before public canon-changing copy |
| Merge / release | NOT ATTEMPTED | Reviewed PR, merged source, guard-safe Pages publish, green Pages run |

## 5. Proposed next work gate: LKN-SITE-G02 — Accessibility + Load-Control Repair

**Scope proposal:** F01–F04, in that order: lazy and resilient 169-frame sequences; meaningful reduced-motion fallback; accessible 2D Room 14 evidence controls; hidden-menu focus management. Add regression tests and concise QA checklist. Keep existing visual DNA and game identifiers unchanged. Do **not** mix this with a brand redesign or the founder-gated editorial changes F05/F06.

**Acceptance conditions:**
1. Existing 17 static routes export without error; source validation/tests/lint pass on Node 22.
2. Scroll frame loading begins on demand rather than an unconditional 169-image request; first-frame poster and missing-frame fallback work.
3. Reduced-motion users can navigate a fully meaningful sequence without forced animation.
4. Room 14 objects are accessible without pointer or WebGL; selection is synchronized with the registry.
5. Closed mobile navigation has no hidden focusable links; keyboard Escape and focus restoration work.
6. Browser evidence captured for representative phone, tablet and desktop sizes, at least one real mobile device, plus keyboard and screen-reader checks.
7. No original media is replaced, no change to game IDs or canon, no publishing to gh-pages from an unmerged feature branch.

## 6. Release path / stops

This G01 PR is **audit documentation only**. Open against claude/dreamy-hawking-VcoBe. Validate the PR via the source-validation workflow. There is no rationale to publish gh-pages on an audit-only PR. Recheck source and gh-pages tips when implementation is ready; publish only from **freshly merged** canonical source with the guarded Python publisher, observe the green Pages run and smoke-test the live home, /devlog/, /room-14/ and base-path assets.

Do not infer that a passing build proves visual or interactive quality; and do not infer that a live homepage proves all companion routes work.

## 7. Evidence index

- [Canonical handoff](../../CODEX_HANDOFF.md) and [AGENTS](../../AGENTS.md)
- [Source release workflow](../../../../.github/workflows/likeness-site-validate.yml)
- [Publisher and workflow](WORKFLOW.md)
- [Frame sequence config](../../src/lib/frames.ts)
- [Home canvas](../../src/components/sections/CinematicReveal.tsx)
- [Street canvas](../../src/components/companion/Street.tsx)
- [Room 14 WebGL](../../src/components/companion/Room14.tsx)
- [Mobile navigation](../../src/components/ui/Navbar.tsx)
- [Smooth scroll](../../src/components/providers/SmoothScrollProvider.tsx)
- [Global motion CSS](../../src/app/globals.css)
- [Registry and intake](../../src/lib/registry.ts)
- [Static sitemap](../../src/app/sitemap.ts)
- [Home layout](../../src/app/page.tsx)
- [Story map; draft pending founder approval](../../handoff/story/SCREENPLAY_TO_GAME.md)
- [Published provenance marker](https://github.com/bthoreau88/likeness-universe/blob/gh-pages/production-release.json)

**Human review required:** decide whether G02 may implement the accessibility/performance fixes without expanding scope; separately authorize any flagship-vs-TAPE-03 homepage copy edits and any acquisition URLs.
