# LKN-SITE Marketing & Production Roadmap — V001

**Gates:** G02A.1 (Integration & Regression Closure) + G02A.2 (Flagship Identity & Audience Conversion)
**Date:** 2026-11-20 (Los Angeles) · **Lane:** Claude (independent review + planning)
**Status:** REVIEW / PLANNING — not merged, not published. Human review → approval → next gate.

> Governing principle: **preserve the existing LIKENESS cinematic identity.** This is an expansion of the site's *purpose* (sell the game, grow the audience), not a redesign of its visual DNA. No canon, character-identity, story or game-ID change is proposed here. No paid generation.

---

## 1. Current source & deployment status

| Ref | Value |
|---|---|
| Canonical source branch | `claude/dreamy-hawking-VcoBe` @ `36dc905` |
| Live site (gh-pages) | **unchanged / stale** — publishing is a manual guarded step, deliberately not run. `bthoreau88.github.io/likeness-universe` does not reflect merged source. |
| Merged into canonical | **PR #26** (G02A a11y: mobile-nav focus/inert, Room 14 keyboard + WebGL fallback, site-wide reduced-motion) and **D1** frame-reference fix. |
| Open draft | **PR #25** `codex/...originals-editorial-v001` @ `d9e152b` — original-character scroll + `/works` editorial + 3 character dossiers. Not merged. |
| Open draft | **PR #33** `claude/lkn-site-g02-d1-d2-fixes` @ `d2e376a` — stacked on #25: D1/D2 fixes + regression tests. Not merged. |
| This branch | `claude/lkn-site-g02a-roadmap-reconcile` — this roadmap + the Journey weapon-image fix. |

### Build/validation posture (combined tree, trial-merged locally this engagement)
Canonical ⊕ PR #25 ⊕ PR #33, with conflicts resolved (see §2): `validate:production` ✓, `test:production` ✓ (19 node + 17 python, incl. #33's new all-`src` frame/asset regression tests), `lint` ✓, `tsc` + base-path static export ✓ (30 routes), browser sweep ✓ (home/street/journey/works/dossier: **0 broken images, 0 404s**). Safari/WebKit and real screen-reader passes **not run** (unavailable in sandbox) — see §6.

---

## 2. G02A.1 — Integration & regression closure

### 2.1 ⚠️ Journey weapon-HUD image (founder-flagged) — FIXED on this branch, pending approval
`/stills/open-world-city.png` is a full game screenshot carrying a **burned-in combat HUD: pistol + ammo "10 | 50 / MANTIS BLADE", grenade/med-kit icons, "INFECTION 37%", minimap, "MARTIAL LAW / QUARANTINE ZONE", police cars, burning wreckage, a cybernetic-armed figure.** It violates the story law **"No combat, no bodies, no guards"** on every axis, carries game HUD, and is not the LIKENESS world. It was live in **merged canonical** at `Journey.tsx:36` (Stage I "Found").

- **Resolution (this branch):** `Journey.tsx:36` → `/stills/thoreau-stealth.png` — clean, on-brand, no HUD, tonally fits "the exterior cameras logged it." One line.
- **Alternative for founder:** `/stills/thoreau-watching.png` (THOREAU watching surveillance/VHS of his double — thematically ideal) — but it is already the home "The Street" card, so using it here duplicates it. Recommend keeping them distinct: **Journey = thoreau-stealth, home card = thoreau-watching.**
- **Deliberately NOT changed:** `registry.ts:535` keeps `open-world-city.png` — there it is *intentional*, labeled "THE CITY · MARTIAL LAW / the abandoned open-world expansion. LIKENESS locked to one location instead." That editorial "what we are not" framing is correct and stays.

### 2.2 D-series reconciliation (PR #25 / #26 / #33)
| ID | Finding | Status |
|---|---|---|
| D1 | Broken `/frames/` refs (home card, Journey I) | **Fixed.** #26 landed it in canonical (home=thoreau-watching). #33 picked thoreau-stealth for the card (older 2026-11-11 pick) → **conflict with canonical**; resolution keeps canonical's thoreau-watching. Journey I now thoreau-stealth (§2.1). |
| D2 | Hidden-but-focusable outro CTA (`useScrollCanvas.ts`) | **Fixed in PR #33** (inert toggle) + the drafted patch posted to PR #25. Preserve on integration. |
| D6 | `/works` filter touch targets < 44px | Patch drafted/posted to PR #25 (`min-h-11`). Header/back links across new routes still 14–16px — follow-up. |
| D7 | Flagship game cover art reads "TAPE 003" | **FOUNDER CALL** — see §4. |
| D8 | Portrait covers cropped to 16:10 (lose faces/title) | Art-direction follow-up on `/works`. |
| D9 | "Prompts" removed from nav by #25 | Reconciled by the three-experience IA (§3): Prompt Library becomes a Studio sub-item, not a top nav slot. |
| D10 | Filter result count not announced (silent) | Optional `aria-live` count — follow-up. |
| D3/D4 | Perf: more bytes despite fewer requests; mixed portrait/landscape framing | Addressed by §6 performance plan (WebP) + art-direction. |

**Reconciliation recommendation:** integrate PR #25 (originals/editorial) + PR #33's D2/tests on top of current canonical, taking canonical's thoreau-watching for the home card and thoreau-stealth for Journey I, dropping #33's now-superseded home-card line. The combined tree validated green with exactly this resolution. **Do not merge without founder review.**

---

## 3. G02A.2 — Proposed information architecture: three interconnected experiences

One site, one cinematic identity, three clear doors. The homepage currently tries to be all three at once; the fix is routing clarity, not a redesign.

### 3.1 LIKENESS : THE GAME — flagship commercial experience
The conversion surface. **Route:** `/` (becomes a clear game landing) + a dedicated `/game`.
Content: hero (logline + genre), key art, **trailer slot**, a "what is it" beat, **Unreal gameplay captures**, a short feature list (spoiler-safe), platforms (TBD — do not invent), and the **primary Follow/Wishlist CTA**. Links out to Universe and Studio.

### 3.2 LIKENESS UNIVERSE — narrative, character & worldbuilding
The depth layer (most existing companion content already lives here). **Hub:** `/universe`.
Members: `/characters` + dossiers, `/street`, `/wardrobe`, `/score`, `/journey`, `/room-testifies`, `/room-14`, `/tapes`, `/motel`, `/evidence`, `/alt` (abandoned directions). Purpose: turn atmosphere into *understanding* so fans can evangelize — spoiler-safe.

### 3.3 OMNIA VANITAS STUDIOS — creative studio & portfolio
Studio credibility + press. **Hub:** `/studio`.
Members: `/works` (editorial case studies from #25), `/press` (build into a real press kit), `/devlog`, `/prompts` (**Prompt Library — secondary production resource**, per directive). Purpose: who made this, what else, how to cover it.

### 3.4 Navigation & title/logo placement (proposal — logo lock is a founder decision)
- **Top nav:** three pillars — `THE GAME · UNIVERSE · STUDIO` — plus a persistent **Follow** CTA. Prompt Library demoted under Studio (resolves D9).
- **Wordmark:** keep the OVS `◊` diamond mark + `LIKENESS` wordmark top-left on every page; make the context tag (`// TAPE-03` today) pillar-aware (`// THE GAME`, `// UNIVERSE`, `// STUDIO`).
- **No approved logo asset exists yet** — this is placement/hierarchy only. A locked wordmark/logo is an owner decision + asset requirement (§5).

### 3.5 Primary CTA architecture
- **Primary (global):** **"Follow development."** Until an authorized Steam/newsletter endpoint exists, point it at a **genuine existing destination** — the public dev repo (`github.com/bthoreau88/likeness-universe`) and/or the on-site `/devlog`. **Do not invent a Steam URL, newsletter, Discord or release date.**
- **On authorization:** swap Primary → **"Wishlist on Steam."** Add newsletter capture + Discord as secondary.
- **Secondary CTAs:** "Enter the Universe", "The Studio".
- **Prompt Library:** tertiary, Studio-scoped.

### 3.6 Hero copy candidates (spoiler-safe — pick one, or blend)
> All three avoid the twist. They convey premise + mood + a narrative (not action) genre. No gameplay claims, no release date.

- **A — Premise:** *"You found a tape on the pavement outside Room 14. Play it, and the room starts editing you. **LIKENESS** — a psychological thriller about memory, likeness, and the version of the night that refuses to stay told."*
- **B — Mood / world-forward:** *"Room 14 remembers a different night than you do. **LIKENESS** is a cinematic thriller where every recording tells the truth differently — and one of them is wearing your face."*
- **C — Invitation / character:** *"One object. Five rooms. A face that keeps coming back wrong. Step into **LIKENESS**, a narrative thriller about the double you can't account for."*

---

## 4. Flagship identity decisions (owner)
1. **Lock the title + wordmark** ("LIKENESS : THE GAME" as commercial title; "LIKENESS UNIVERSE" as the narrative layer; "OMNIA VANITAS STUDIOS" as studio signature). Produce a locked wordmark asset.
2. **D7 — the game's cover art reads "TAPE 003"** (`registry.ts:70`, `poster-room14.png` on the flagship `/works` entry). Decide: new flagship key art, or relabel. This is the one page meant to resolve the game/TAPE-03 confusion and currently deepens it.
3. **Pick a hero candidate** (§3.6).
4. **Spoiler boundary** — how much of the story ("A Night for Four", the double, the love-story truth layer) is public.

---

## 5. Asset requirements
| Asset | For | Owner / gate |
|---|---|---|
| Locked wordmark / logo | Title lock, nav, OG card | Founder (G02A.2) |
| Flagship key art (not "TAPE 003") | `/`, `/game`, `/works` game entry | Founder / art direction (D7) |
| **Trailer / teaser** (animatic ok to start) | Game landing | §7 |
| **Unreal gameplay captures** | Game landing, works | §7 + GAME_LANE camera-readiness |
| Approved original-character key art (identity-authority locked) | Scroll sequences, dossiers (replaces the *bridge* stills) | **G02B** |
| OG / social share key art (per pillar) | SEO/share (§8) | Founder |
| Optimized image derivatives (WebP) | All image routes | §6 (no approval needed to generate; approval to *replace* refs) |

No new art is generated here. Bridge stills remain provisional, **not** approved motion (G02B).

---

## 6. Accessibility & performance acceptance criteria

### 6.1 Accessibility (acceptance = all true before publish)
- 0 axe WCAG 2.2 AA violations on every route, mobile + desktop. *(Combined tree: achieved.)*
- Every interactive element keyboard-reachable and operable; **no focus on hidden/opacity-0 elements** (D2). *(Fixed.)*
- Visible focus indicators; interactive touch targets ≥ 44px (filters fixed; **back/header links pending**).
- `prefers-reduced-motion` honored site-wide. *(Done in #26.)*
- **Real screen-reader pass (VoiceOver + NVDA)** on nav, filters, dossier switcher, forms — **PENDING, required before launch.**
- **Safari/WebKit** functional pass — **PENDING.**

### 6.2 Performance — measured, zero-credit derivative assessment (this engagement)
Real encodes of the **44 source PNGs** in `public/stills` + `public/subjects`, **dimensions and dark grade preserved** (no resize, no tone change). Originals untouched; derivatives written to a scratch dir.

| Set | Bytes | vs PNG |
|---|---|---|
| **PNG source (current)** | **107.30 MB** | — |
| **WebP q82** | **4.17 MB** | **−96.1% (measured)** |
| **JPEG q84** (mozjpeg, 4:4:4) | **7.43 MB** | **−93.1% (measured)** |

Representative per-file (measured, KB): `key-14` 3264→**162** webp / 246 jpg; `bathroom` 2974→**63**/144; `thoreau-mirror` 2966→**91**/184; `thoreau-portrait` (subject) 2959→**132**/221; `poster-room14` 2938→**164**/288.

> These are **measured** byte counts from real encodes, not estimates. Visual comparison (banding check on the dark grade) is attached to the passback; **production references are not replaced** until founder visual QC signs off (dark-grade banding/grain is the risk).

**Acceptance criteria (proposed):**
- Replace scroll/hero/cover PNG refs with WebP (keep PNG masters) **only after** a visual-QC pass shows no banding/grain loss on the dark grade.
- Budget: home **first-load < 3 MB** and **full-scroll < 6 MB** on mobile (from the current ~18.5 MB first-load / ~32 MB full-scroll measured earlier). LCP < 2.5s, INP < 200ms on a mid-tier throttled mobile profile — measured, not assumed.

---

## 7. Trailer & Unreal gameplay-capture plan
- **Phase 1 — Teaser/animatic (no paid gen):** a 30–60s montage from existing *approved* stills + the existing score, diegetic sound, title card. Self-hosted MP4 (static-export friendly) with a poster-image fallback and a reduced-motion/no-autoplay default; captions. Buys a "motion" surface before the engine is ready.
- **Phase 2 — In-engine captures:** gated on GAME_LANE camera-readiness (Room 14 greybox / Lvl_Room14). Target shots: Room 14 interior reveal, the street surveillance sweep, the tape/mechanic, a spoiler-gated double reveal. Captured at fixed res, graded to match the site, no HUD.
- **Governance:** no combat/weapon framing (the open-world-city lesson); identity-authority approval for any character on screen (G02B); no paid generation without authorization.

## 8. Editorial case-study expansion (`/works`)
Keep #25's editorial system; per case study add process + role + stills, resolve D7 (flagship art), D8 (portrait crop), D10 (filter announcement). Add works as produced. This is the Studio pillar's credibility engine.

## 9. Audience acquisition strategy
- **Now (no new endpoints):** public dev (GitHub) + a **devlog cadence** (first 3-post backlog: the world, the characters, the look) + shareable clips from the cinematic site + a real press kit.
- **On authorization:** Steam coming-soon (wishlist) as primary CTA, newsletter capture, Discord.
- **Engine:** devlog → character/world reveals → the teaser → wishlist. Each milestone is a post + a social cut.

## 10. Dependencies, owner decisions & release gates
**Owner decisions (blocking):** title/logo lock; D7 flagship art; hero pick; spoiler boundary; platforms + store timing; community-channel commitment; **Journey image approval (thoreau-stealth)**; imagery/identity approvals (G02B).
**Dependencies:** GAME_LANE Unreal camera-readiness (captures); authorized endpoints (CTAs); founder visual QC (WebP swap).
**Release gates:**
- **G02A.1** (this): integration + regression + weapon-image fix → founder review.
- **G02A.2** (this): identity + conversion plan → founder decisions above.
- **G02B:** Visual review & original-character motion authority — **no paid generation; no provisional identity imagery published as approved motion.**
- **Publish gate:** guarded gh-pages release from *merged* canonical only, with fresh source + gh-pages SHAs and a live smoke test. Never from a feature branch, never automatic.

**No force-push. No unauthorized merge. No direct gh-pages edits. No paid generation. Human review → approval → next gate.**
