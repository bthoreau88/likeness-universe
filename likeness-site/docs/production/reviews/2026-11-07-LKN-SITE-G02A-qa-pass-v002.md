# LKN-SITE-G02A — PR #24 review + PR #25 browser / accessibility / performance QA (V002)

**Status:** FEATURE BRANCH / REVIEW REQUIRED / NOT PUBLISHED
**Date:** 2026-11-07 (Los Angeles) · **Lane:** Claude (independent review) · **Supersedes nothing** — extends V001 (`2026-11-07-LKN-SITE-G02A-review-remediation-v001.md`).

**Anchors (verified this session)**

| Ref | SHA |
|---|---|
| Canonical `claude/dreamy-hawking-VcoBe` | `c53809b2e68b6d1dce66f60a8879a8645d8a743d` |
| gh-pages | `00353a9066566febcd16f421f64cf46ef5813c0b` (release marker source `1c929ec`, 14 commits behind canonical) |
| PR #24 `codex/lkn-site-g01-audit-20261106` | `d736e1d` (draft, docs only, 1 file) |
| PR #25 `codex/lkn-site-g02-originals-editorial-v001` | `d9e152b` (draft, 360 files) |
| PR #26 `claude/likeness-universe-site-apwuh1` (this branch) | `2dc41ac` before this commit |

**Boundary.** Read-only review of PRs #24 and #25. No commits to Codex branches, no merge, no force-push, no gh-pages publish, no asset generation, no canon/registry change, no superhero asset restored. This commit adds documentation and QA evidence only.

---

## 1. What was and was not tested

| Check | Status | Method |
|---|---|---|
| `npm ci` | **PASS** | PR #25 head, Node v22.23.4, npm 10.9.9 |
| `npm run validate:production` | **PASS** (exit 0) | 6 intake batches; parity 32 site IDs; pre-existing `EXP_` warnings only |
| `npm run test:production` | **PASS** (exit 0) | 17/17 node + 17 python |
| `npm run lint` | **PASS** (exit 0) | |
| `NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build` | **PASS with an environment substitution** | See note ¹. Next 16.2.7 Turbopack, 30 static pages incl. all 8 new routes |
| Same gates on **PR #25 + PR #26 merged** (local trial merge, not pushed) | **PASS** | Git auto-merged `Navbar.tsx`; lint/validate/test/build all exit 0 |
| Browser: 12 routes × mobile 390 / tablet 768 / desktop 1440 | **DONE — Chrome only** | Playwright 1.65 driving system Google Chrome against the static export served under `/likeness-universe` |
| axe-core WCAG 2.0/2.1/2.2 A+AA (mobile + desktop) | **0 violations** on all 12 routes | `@axe-core/playwright` |
| Keyboard: Tab order, filters, dossier switcher | **DONE** | Scripted |
| Reduced motion (`prefers-reduced-motion: reduce`) | **DONE — emulated** | Chrome emulation, not an OS setting |
| Network bytes/requests, before vs after | **DONE — unthrottled** | Canonical vs PR #25, mobile emulation |
| **Safari / WebKit** | **NOT RUN** | The sandbox blocks the Playwright WebKit download; no Mac/iOS device available |
| **VoiceOver / NVDA** | **NOT RUN** | No screen reader available; only the axe + accessibility-tree proxy |
| Real-device memory, throttled LCP/INP | **NOT RUN** | JS heap only (decoded image memory is not visible to it) |

¹ The sandbox blocks `fonts.googleapis.com`, so `next/font/google` cannot fetch Geist. For the build **only**, `layout.tsx` was swapped locally to `next/font/local` pointing at the identical Geist variable fonts from the official `geist@1.9.2` npm package. This change was **not committed**. CI with network access should build the unmodified source; confirm on the PR's workflow run.

Evidence: `evidence/2026-11-07-g02a-qa-v002/` — `browser-qa-results.json` (per-route, per-viewport), `perf-before-after.json`, two contact sheets, and the four QA scripts used (re-runnable).

---

## 2. PR #24 (LKN-SITE-G01 audit, docs only) — review

**Verdict: accurate; mergeable as a dated audit record once founder reviews.** Every source claim I spot-checked against canonical `c53809b` holds:

| G01 claim | Verified |
|---|---|
| 14 commits between release marker `1c929ec` and canonical | ✔ `git rev-list --count` = 14 |
| Home/Street each eagerly create 169 `Image` objects | ✔ `CinematicReveal.tsx:30–31`, `Street.tsx:94` (canonical) |
| frames = 11,186,808 B, frames2 = 10,400,429 B | ✔ exact |
| 39 + 5 PNGs = 98,063,522 + 14,450,079 B | ✔ 44 PNGs = 112,513,601 B |
| Lenis always mounted; only `.eq-bar` has a reduced-motion rule | ✔ |
| Closed mobile menu focusable, no `aria-controls`/Escape | ✔ (now fixed by PR #26, re-confirmed in browser) |
| 17 routes in `src/app` and `sitemap.ts` | ✔ |

Notes for the founder, not defects:
- G01 is a **point-in-time** document. F01 (preload) and F04 (menu) are addressed by PRs #25/#26; F03 (Room 14) by PR #26; **F02 (reduced motion) is only partly addressed** (see §3, D5). Merge it as history, not as a current status board.
- G01-F05 (flagship = THE GAME vs TAPE 03) remains open and is **made more visible** by PR #25: see D7.
- G01's network figures are repository sums; §4 below now gives measured wire numbers.

---

## 3. PR #25 — defects found in the browser (prioritized)

| # | Sev | Where | Finding | Evidence | Owner |
|---|---|---|---|---|---|
| D1 | **HIGH** | `src/components/sections/Threads.tsx:29`, `src/components/companion/Journey.tsx:35` | **Confirmed in browser:** `/frames/frame_0044.jpg` 404 + broken `<img>` on home (all 3 viewports); `/frames/frame_0012.jpg` 404 + empty Stage I background on `/journey`. (V001 predicted this from source; now observed.) | `browser-qa-results.json` → `brokenImgs`; desktop contact sheet, panel 3 | Codex — needs founder-approved replacement stills |
| D2 | **HIGH (a11y)** | `src/components/atmos/useScrollCanvas.ts:84–88` (shared hook) → `CinematicReveal.tsx:84` "Meet the two", `Street.tsx:170` `#cast` link | The outro CTA is hidden with `opacity:0` + `pointer-events:none` but **stays in the Tab order**. Keyboard focus lands on an invisible button at effective opacity 0 (desktop and mobile, still present after PR #26 merges). Same defect class as the old mobile menu. Pre-existing on canonical; carried into the new hook. | Tab scan, `qa2.mjs` | Codex (file owned by PR #25) — patch in §5 |
| D3 | **MEDIUM (perf)** | `src/lib/registry.ts:37–56` `SCROLL_SEQUENCES` | Fewer requests, **more bytes**. Full traversal now downloads more than the 169-JPEG demo did: home 28.9 → **32.6 MB**, Street 18.5 → **20.5 MB** (§4). The stills are 1.7–3.0 MB PNGs. | `perf-before-after.json` | Codex + founder (derivatives need visual/identity QC) |
| D4 | **MEDIUM (visual)** | `registry.ts:38–45` (home list) | The home sequence alternates **portrait 1024×1536** and **landscape 1672×941** stills. With cover-fit on a 16:9 canvas, portrait frames are cropped to a horizontal band, so the crossfade jumps between framings. All stills are ≤1672 px wide, so they render upscaled on a 1440 px DPR-2 display. | Pillow dimensions | Art direction |
| D5 | **MEDIUM (a11y)** | `src/components/providers/SmoothScrollProvider.tsx:12`; `Journey.tsx:102–103`; home `whileInView` reveals | Under emulated reduced motion, **Lenis smooth scroll still runs on every route**, the `/journey` parallax still translates and scales (`translateY(-8%) scale(1.12)` → `translateY(2.4%) scale(1.06)` after scrolling), and home fade-up transforms and `animate-pulse` keep running. PR #25's static alternative for the two scroll sequences **does work** (canvas hidden, `ovs-reduced-only` list shown). | `results.json` → `reducedMotion`; `qa2.mjs` | Pre-existing (G01-F02); not fixed by #25 or #26 |
| D6 | **MEDIUM (touch)** | `src/components/companion/WorksIndex.tsx:53–61` | `/works/` filter buttons are **16 px tall** (60–173 px wide). They pass WCAG 2.5.8 through the spacing exception (axe clean), but fall well below the 44 px touch guidance on phones. Header/back links on all new routes are 14–16 px tall. | `smallTargets` | Codex |
| D7 | **MEDIUM (editorial)** | `registry.ts:70` `WORK_COVERS.WORK_LIKENESS_GAME = poster-room14.png` | The **flagship game's** cover art visibly reads "TAPE 003". This reinforces the G01-F05 flagship/TAPE-03 confusion on the exact page meant to resolve it. | Desktop contact sheet, panel 1 | **Founder** |
| D8 | LOW (visual) | `WorksIndex.tsx:88` (`sm:aspect-[16/10]`) | Portrait posters are cropped to 16:10 on tablet and desktop. The TAPE 03 cover loses its faces and title lettering (only torsos and the bottom glyph row remain). | Desktop contact sheet, panel 2 | Codex / art direction |
| D9 | LOW (disclosure) | `src/components/ui/Navbar.tsx:7–16` (PR #25) | PR #25 **removes "Prompts" from the nav** (adds "Works"). The route still exists and is in the sitemap, but the PR description does not mention the removal. | diff | Founder OK needed |
| D10 | LOW (a11y) | `WorksIndex.tsx:46–64` | Filtering changes the list with no announcement of the result count, and items are renumbered per filter ("01 /" re-used). It works and is keyboard-operable, just silent. | Filter test | Codex |

**What passed in PR #25** (re-verified, not assumed):
- All 8 new routes render at 3 viewports: correct `h1`, no horizontal overflow, no broken images, no console errors, **0 axe violations**. Every internal link on the 12 tested routes returns 200 (23 unique URLs). The "failed" requests seen in raw logs are `net::ERR_ABORTED` Next.js prefetches, which are benign.
- `/works/` filters: All 4 / Game 1 / Film & Tape 1 / Creative Threads 2; `aria-pressed` toggles; Enter works; visible 2 px focus ring.
- Dossier switcher: 3 links, `aria-current="page"` on the active one, keyboard Enter navigates, "Next identity" cycles thoreau → drya → the-other → thoreau.
- Scroll renderer: **0** requests to `/frames/` or `/frames2/`; 2 stills at idle, the rest on scroll; JS heap +1 MB after a full traversal.
- Reduced-motion static alternatives for the home and Street sequences display correctly.
- OVS cinematic design is intact: no template look, type and grade preserved (contact sheets).

---

## 4. Performance — measured before vs after (Chrome, mobile 390×844 @3x, unthrottled)

| Route | Build | Requests at idle | MB at idle | MB after full sequence scroll |
|---|---|---|---|---|
| `/` | canonical | 238 (169 frames) | 22.96 | 28.90 |
| `/` | PR #25 | **78** | **18.49** | **32.61** |
| `/street/` | canonical | 190 (169 frames) | 12.27 | 18.49 |
| `/street/` | PR #25 | **24** | **5.17** | **20.48** |

Reading: PR #25 fixes the **request flood** (−67% / −87%) and lightens first load, but **raises total transfer** for anyone who scrolls through. Home still moves **18.5 MB before any scroll** on a phone; most of it is PNG stills and subjects.

Opportunity (estimate, **not committed**): encoding the 10 sequence/subject PNGs at native size gives **25.32 MB → 0.84 MB as WebP q82** or **1.66 MB as progressive JPEG q84**. That would put the sequences well under the old demo's cost. It requires visual and identity QC (banding on the dark grade, grain loss) before any reference change, as G01-F07 already requires.

Memory: Chrome JS heap rises only from 5.5 → 6.6 MB (home) because decoded bitmaps are not counted. [Estimate] Each still decodes to ~6.3 MB RGBA, and the hook keeps every visited still referenced (`images[]`), so a full traversal can hold ~38 MB (home) / ~50 MB (Street) of decodable image data. That is fine on desktop; it needs real-device confirmation on older iPhones.

---

## 5. Passback for Codex (PR #25), conflict-safe

1. **D1:** repoint `Threads.tsx:29` and `Journey.tsx:35` to founder-approved stills; then `rg "/frames2?/" likeness-site/src` must be empty.
2. **D2:** in `useScrollCanvas.ts`, alongside the existing pointer-events toggle (line 87), also remove the hidden outro from focus and the accessibility tree:
   ```ts
   outroRef.current.style.pointerEvents = show ? "auto" : "none";
   outroRef.current.inert = !show;              // drops hidden CTA from Tab order + a11y tree
   ```
   (React 19 / current Chrome, Safari and Firefox support `inert`.) Re-test: Tab through home and `/street/` without scrolling; focus must never land on an invisible element.
3. **D3:** keep PNG masters; add optimized derivatives only after founder visual QC; repoint `SCROLL_SEQUENCES` and `WORK_COVERS`.
4. **D6:** give the filter buttons and back links at least `min-h-11` (44 px) with padding; keep the type size.
5. **D8/D10:** cover crop per art direction; optional `aria-live="polite"` count, e.g. "Showing 2 works".
6. **Merge order:** PR #25 and PR #26 **both edit `Navbar.tsx`** (V001 was wrong to call them file-disjoint; see errata). Git auto-merges them cleanly, and the trial-merged tree passes all gates, so order is still free.

Not for Codex alone: D5 (site-wide reduced motion: Lenis off and parallax gated) is a separate, small fix in files PR #25 does not touch (`SmoothScrollProvider.tsx`, `Journey.tsx` parallax lines). It can land on this branch or a G02A-2 branch once the founder approves scope.

---

## 6. G02B readiness

**Not ready.** Unchanged from V001, with two additions:
1. Founder/identity sign-off on every still in `SCROLL_SEQUENCES`, `WORK_COVERS` and the three dossiers, **including resolving D7** (the game cover branded TAPE 003).
2. An approved original-character **motion source** and a motion proof, replacing the still bridge; no generated or purchased assets without explicit authorization.
3. D1 and D2 fixed in PR #25.
4. **Owed QA still not performed anywhere:** Safari/iOS on a real device, VoiceOver and NVDA passes, throttled LCP/INP, real-device memory.
5. A decision on delivery format for stills (D3) before motion work multiplies the byte cost.

## 7. Errata to V001 (same date)

- V001 §header/§2 and receipt line 45 state the PR #26 branch "touch[es] only files PR #25 does not modify" / is "file-disjoint". **Incorrect:** both PRs modify `src/components/ui/Navbar.tsx` (PR #25: route list and gap class; PR #26: focus/inert logic). The practical conclusion ("merges in either order without conflict") **still holds**: verified by trial merge plus full gates.
- Receipt line 6 says "PR pending". The PR exists: **#26**.
