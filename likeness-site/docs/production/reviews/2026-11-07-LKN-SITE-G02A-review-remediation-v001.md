# LKN-SITE-G02A — Independent review of PR #25 + accessibility remediation (V001)

**Status:** FEATURE BRANCH / REVIEW REQUIRED / NOT PUBLISHED
**Date:** 2026-11-07 (Los Angeles)
**Reviewer / implementer:** Claude (independent review + remediation lane), assisting Codex's G02 work.

**Anchors**
- Canonical source (base): `claude/dreamy-hawking-VcoBe` @ `c53809b2e68b6d1dce66f60a8879a8645d8a743d`
- PR under review: **#25** `LKN-SITE-G02: Original LIKENESS cinematic scroll + editorial Works and dossiers` — head `codex/lkn-site-g02-originals-editorial-v001` @ `d9e152b81d9b65a304a655903da5dfa5dece17e9` (open, **draft**, base = canonical, +929 / −306, 360 files, 27 commits).
- This remediation branch: `claude/likeness-universe-site-apwuh1` @ `015b719` (base = canonical).

**Method / boundary.** The review of PR #25 was **read-only** (no commits to Codex's branch, no merge, no force-push, no gh-pages publish). My own code changes live on a **separate branch cut from canonical**, and touch **only files PR #25 does not modify**, so the two can merge in either order without conflict. No character canon, screenplay, visual identity, or game-ID change. No asset generation. No superhero/Iron Man asset restored. Human review remains mandatory before any merge, motion approval, or publication.

---

## 1. Independent assessment of PR #25

PR #25 is **structurally sound and well-governed**. It does what it claims: it retires the recognizable third-party superhero frame demo (338 JPEGs removed from `public/frames/` + `public/frames2/`), repoints both scroll sequences at already-present original LIKENESS stills via `registry.ts` → `frames.ts`, adds a progressive crossfade scrub renderer, and adds editorial `/works/` + three character dossiers — all registry-driven, with no invented stats, credits, or dates, and no live publish. The draft status, the self-imposed "verification still required" list, and the explicit identity-governance note (stills are a *bridge*, not authority-locked motion) are exactly right.

Two independent technical observations:

- **`useScrollCanvas.ts` (renderer) — accept.** It lazy-loads only the active still and its single neighbor, caches each (`images[at]`), guards incomplete/broken images before drawing (`img.complete`, `naturalWidth/Height === 0`), forces `progress = 0` under `prefers-reduced-motion`, rAF-throttles scroll, and tears down cleanly (`stopped`, `cancelAnimationFrame`, listener removal). For the **current** sequence sizes (home = 6, street = 8) this is efficient and correct. The absence of `AbortController`/explicit `Image` disposal is a **latent** concern only — it would start to matter if a sequence grew back toward 169 frames; at 6–8 it is negligible. No change requested now; see G02B.
- **Large PNG stills.** The scroll/hero stills are full PNGs (e.g. `thoreau-watching.png` ≈ 2.1 MB). PR #25's own doc already flags that optimized derivatives may be warranted. Agreed — a route-level LCP/INP pass is owed before release, not blocking for draft review.

### The one blocking defect — broken `/frames/` references PR #25 deletes out from under

PR #25 removes **every** JPEG in `public/frames/` but **does not update two components that still reference those exact files**. Both components are untouched by PR #25 (their blob SHAs on the head branch are identical to canonical), so this is a deletion that outran its callers — and it directly violates PR #25's own exit criterion *"Confirm no references to `/frames/` or `/frames2/` remain in runtime."*

| Sev | File:line | Reference | Effect after PR #25 merges | Owner |
|-----|-----------|-----------|----------------------------|-------|
| **HIGH** | `src/components/sections/Threads.tsx:29` | `image: "/frames/frame_0044.jpg"` ("The Street" card) | Broken image on the **home page** anthology band | Codex (PR #25) |
| **HIGH** | `src/components/companion/Journey.tsx:35` | `image: "/frames/frame_0012.jpg"` (Stage I "Found" parallax bg) | Broken background on **`/journey`** Stage I | Codex (PR #25) |

These are **not** defects on canonical today (the frames still exist there), which is why they are **not** fixable on my remediation branch without (a) making an unauthorized art-direction choice about the correct replacement still and (b) masking the regression inside the wrong PR. They belong to PR #25 and are itemized as a passback in §5.

> Note: I deliberately did **not** carry a speculative `/frames/* → /stills/thoreau-watching.png` swap into this branch. Picking the replacement image for those two slots is approved-imagery/art-direction work for Codex + founder, and pointing two different sections at the same still would be a visual regression of its own.

---

## 2. What this branch remediates (accessibility / resilience)

Narrowly scoped a11y + reduced-motion repairs to **two canonical files PR #25 does not touch**. Diff: 2 files, +128 / −27.

### `src/components/ui/Navbar.tsx` — mobile overlay menu
- **Escape + focus restoration:** pressing `Escape` closes the menu; on open, focus moves into the panel; on close, focus returns to the toggle that opened it (previously: no keyboard close, focus left stranded).
- **`inert` + `aria-hidden` while closed:** the overlay is opacity-toggled and always in the DOM, so when closed its 9 nav links + CTA were **hidden but still tab-focusable and exposed to assistive tech**. It is now `inert={!open}` + `aria-hidden={!open}`, removing it from the tab order and the a11y tree while closed.
- **`aria-controls="mobile-menu"`** on the toggle, wiring it to the panel it controls (joins the existing `aria-expanded`).

### `src/components/companion/Room14.tsx` — Room 14 diorama
- **Keyboard + screen-reader evidence access:** the only way to inspect evidence was drag/tap + raycast on the WebGL canvas — unreachable by keyboard or AT. Added an accessible **"Evidence Index"** (`<nav aria-label="Room 14 evidence">` of `aria-pressed` buttons) that drives the **same** `selected` state and the same inspect overlay. Verified: keyboard `Enter` on a button opens the inspector (`PROP_KEY14_001 / Brass Motel Key 14`). Buttons meet the 44 px touch-target minimum and have a visible `focus-visible` ring.
- **WebGL fallback:** `new THREE.WebGLRenderer()` is wrapped in `try/catch`; on context-creation failure the scene degrades to a worded fallback panel + the evidence index, instead of an empty black box. (State flip is deferred via `queueMicrotask` so it is not a synchronous `setState` in the effect — satisfies the project's strict `react-hooks` rules — and the first render stays optimistic, avoiding any hydration mismatch.)
- **Reduced motion:** auto-drift, lamp flicker, and object bob are held still under `prefers-reduced-motion` (drag still works).
- **SR semantics:** decorative canvas + filmic overlays marked `aria-hidden`; the inspect overlay is an `aria-live="polite"` region; the close button gains `aria-label="Close inspector"` + a focus ring.

No change to the registry, canon IDs, visual identity, or the OVS cinematic design. Screenshots (desktop Room 14 with the Evidence Index; mobile nav open) captured against the static export and reviewed — both render with the design intact.

---

## 3. Validation evidence (this branch, `015b719`)

Run from `likeness-site/`, Node v22.22.0:

| Gate | Command | Result |
|------|---------|--------|
| Lint | `npm run lint` | **pass** (0 problems) |
| Source validation | `npm run validate:production` | **pass** — 6 intake batches; registry parity 28 IDs. (Pre-existing `EXP_`/registry warnings only, unrelated to this change.) |
| Tests | `npm run test:production` | **pass** — 14 node subtests + 17 python tests |
| Build | `NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build` | **pass** — TypeScript clean, 22 static routes exported |

Behavioral checks in a headless browser against the built `out/`:
- Navbar: toggle `aria-controls` present; open → `inert` removed, `aria-expanded=true`; **`Escape` → `aria-expanded=false` and focus restored to the toggle**.
- Room 14: `nav[aria-label="Room 14 evidence"]` present with 5 `aria-pressed` buttons; keyboard `Enter` opens the inspector with the correct evidence content.

> Scope honesty: these gates cover **this branch's** diff. I did **not** re-run the full suite on PR #25's head, and I did **not** keyboard/Safari-QA all eight new PR #25 routes — those remain on Codex's "verification still required" list.

---

## 4. Prioritized defect list (consolidated, with owner)

1. **HIGH — broken `/frames/` images** · `Threads.tsx:29`, `Journey.tsx:35` · fix in **PR #25** before merge (see §5).
2. **FIXED (this branch)** — mobile nav: hidden-but-focusable links when closed; no `Escape`; no focus restoration · `Navbar.tsx`.
3. **FIXED (this branch)** — Room 14: no keyboard/SR evidence path; no WebGL fallback; motion ignores `prefers-reduced-motion` · `Room14.tsx`.
4. **MEDIUM — large PNG stills** · route-level LCP/INP pass + optimized derivatives before release · PR #25 / release gate.
5. **LOW / latent — `useScrollCanvas` request lifecycle** · no `AbortController`/image disposal; fine at 6–8 frames, revisit if sequences scale · PR #25 / G02B.
6. **OWED (not re-verified here)** — keyboard + VoiceOver/NVDA QA on `/works/` filters, character switcher, and nav; Safari + device screenshots; missing-asset/bad-network behavior · PR #25 "verification still required".

---

## 5. Conflict-safe passback for Codex

Everything below lives inside **PR #25's** domain; this branch intentionally leaves it alone to avoid conflicts and unauthorized art choices.

1. **Resolve the two deleted-frame references.** On `codex/lkn-site-g02-originals-editorial-v001`, update `Threads.tsx:29` ("The Street" card) and `Journey.tsx:35` (Stage I "Found" background) to **approved original stills** (not `/frames/*`). Choose per art direction — they should likely differ from each other and from the `/street` scroll stills. After the change, grep the tree to satisfy your own exit criterion: `rg "/frames2?/" src` must return nothing in runtime code.
2. **Re-run the export and visually confirm** the home page and `/journey` Stage I render real imagery (the broken-image state is only visible once the frames are actually gone from the build).
3. **Merge order is free.** This branch (`apwuh1`) and PR #25 are disjoint at the file level; whichever merges first, the other still applies cleanly.
4. When you pick up the Navbar/Room 14 files later, you'll inherit the a11y work from this branch — no need to redo it.

---

## 6. G02B readiness recommendation

PR #25 is explicit that its stills are a **copyright-safe visual bridge**, *not* identity-authority-locked motion. To move from G02 (bridge) to **G02B** (approved original-character cinematic), the following are required — none are satisfiable by an agent alone:

1. **Founder / identity-authority sign-off** on the specific original-character stills now wired into `SCROLL_SEQUENCES`, the `/works/` covers, and the three dossiers — confirming each face/wardrobe is an approved likeness for public display.
2. **Approved original-character motion source.** A purpose-authored sequence (the eventual replacement for the retired 169-frame demo) for the home and Street scrubs, face-authority-locked, with a controlled **motion proof** — not stills dressed as motion, and not AI-generated/purchased without explicit founder authorization.
3. **The two broken slots resolved** (§5) to approved stills, so no page ships a gap.
4. **QA sign-off:** keyboard + SR on filters/switcher/nav, Safari + device screenshots, reduced-motion and missing-asset/bad-network behavior, and a LCP/INP pass with optimized still derivatives.
5. **Release mechanics (out of scope here):** guarded Pages publish from clean merged canonical with fresh source + gh-pages SHAs, live smoke test — never from a feature branch, never auto.

**Recommendation:** keep PR #25 **draft**. It is mergeable-quality *as a reviewed bridge* once defect #1 is fixed and founder approves the imagery; it is **not** evidence of an approved cinematic. Merge this a11y branch (`apwuh1`) independently on its own review — it has no dependency on the G02B imagery decisions.

---

> **Errata (added 2026-11-07, V002 QA pass — original text above left unchanged):** this branch and PR #25 are **not** file-disjoint; both modify `src/components/ui/Navbar.tsx`. Git auto-merges them cleanly and the trial-merged tree passes lint / validate / test / build, so "merge in either order" still holds. The PR is **#26**. See `2026-11-07-LKN-SITE-G02A-qa-pass-v002.md`.
