# CODEX HANDOFF — LIKENESS UNIVERSE (companion site)

> **You are picking up a live, deployed project.** Read this whole file before
> touching anything. It is the single source of truth for what this is, how it
> deploys, where everything lives, and the rules for working on it alongside
> another agent (Claude) without breaking each other's work.

Last updated: 2026-10-19 · Maintained for cross-agent handoff (Claude ⇄ Codex).

---

## 0. THE STARTING PROMPT (paste this into Codex first)

```
You are working on the LIKENESS UNIVERSE companion/marketing website — a Next.js
static site for the psychological-horror game "LIKENESS : THE GAME" by Omnia
Vanitas Studios (OVS). It is live at https://bthoreau88.github.io/likeness-universe/.

Before doing anything:
1. Read likeness-site/CODEX_HANDOFF.md (this file) and likeness-site/AGENTS.md in full.
2. The code is in the `likeness-site/` folder of the `likeness-universe` repo
   (formerly `dev-brandon`). Update your git remote if it still says dev-brandon:
   git remote set-url origin https://github.com/bthoreau88/likeness-universe.git
3. Branch from `claude/dreamy-hawking-VcoBe` — that is the canonical deploy-SOURCE
   branch and holds the newest work. Do NOT work off `main` (that's an unrelated
   Android app) and NEVER hand-edit the `gh-pages` branch (it's a generated build).

How to work:
- The site is a static export. Build with:
  cd likeness-site && npm ci && NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build
- This is Next 16 with strict React-compiler lint rules; run `npm run lint` and fix
  everything before you commit. Read node_modules/next/dist/docs/ before writing
  Next-specific code (the version has breaking changes vs. training data).
- All site content/data lives in src/lib/registry.ts — "the site and the game speak
  the same language." Add data there, not hardcoded in components.
- Be additive and collaboration-safe: open a PR into claude/dreamy-hawking-VcoBe,
  never force-push, and before republishing gh-pages confirm nobody else published
  there since. Rebuild the deploy from the merged source. Do not overwrite work.

First task: <state your task here>. When done, follow the "Deploy" steps in
CODEX_HANDOFF.md §7 to publish, and verify the Pages build goes green.
```

---

## 1. WHAT THIS IS

- **Project:** the **LIKENESS UNIVERSE** — the companion + marketing website for
  **LIKENESS : THE GAME**, a psychological chamber-horror game by **Omnia Vanitas
  Studios (OVS)**.
- **Story world:** the Dellwood motel, **Room 14**. Characters **THOREAU** and
  **DRYA**, and **the double** ("DARK THOREAU") who answers for them. The canonical
  tape within the universe is **TAPE 03** (an apartment, 3:14 AM). North star:
  *"The room remembers what love edits out."*
- **Live URL:** https://bthoreau88.github.io/likeness-universe/
- **Nature of the site:** a static, cinematic, scroll-driven Next.js site. Dark
  "OVS grade": graphite void, burnt-orange accent, cold HUD teal, mono labels,
  grain/scanlines, HUD frames.

---

## 2. REPOS & NAMES (renamed July 2026)

| Now | Was | What it is |
|---|---|---|
| **`likeness-universe`** | `dev-brandon` | **THIS repo** — the site (in `likeness-site/`) + an old Android app (on `main`). |
| `quickphrase-midterm` | `2025May_Team04` | Unrelated Android "QuickPhrase" team app. |
| `ovs-os` | `OVS-OS` | Separate OVS project. |

GitHub redirects the old URLs, but update any clone's remote:
`git remote set-url origin https://github.com/bthoreau88/likeness-universe.git`.
Repos `NewRepo` and `desktop-tutorial` are slated for deletion — don't reference them.

---

## 3. BRANCHES (important)

| Branch | Role | Rule |
|---|---|---|
| **`claude/dreamy-hawking-VcoBe`** | **Deploy SOURCE** — canonical, newest site source. | **Branch from this.** PR into this. |
| **`gh-pages`** | **Generated build** — what GitHub Pages actually serves. | **NEVER hand-edit.** Only the publish step writes here. |
| `main` | The old Android "QuickPhrase" app. Unrelated. | Ignore for site work. |
| `claude/likeness-universe-site-apwuh1` | Claude's feature branch (PR'd into the source branch). | Claude's; you make your own. |

---

## 4. DEPLOY MODEL (read this twice)

- The site is a **static export** (`output: "export"` → `out/`).
- The **live site is served from the `gh-pages` branch**, which contains a
  *generated* build. **There is NO working CI** — the old `deploy-pages.yml`
  GitHub Action was removed on purpose (it only ever failed; it required Pages
  source = "GitHub Actions", but this repo uses "Deploy from a branch: gh-pages").
- **Publishing is manual:** build the export, then replace the `gh-pages`
  contents with `out/` and push. GitHub's automatic "pages build and deployment"
  then serves it (usually green in ~1 min; it occasionally flakes/time-outs — if
  a run fails, push an empty commit to `gh-pages` to re-trigger).
- **The base path MUST equal the repo name.** Build with
  `NEXT_PUBLIC_BASE_PATH=/likeness-universe`. If the repo is ever renamed again,
  rebuild with the new base path or every asset 404s.

---

## 5. STACK & CONVENTIONS

- **Next.js 16.2.7** (App Router, `output: "export"`, Turbopack, `trailingSlash: true`,
  `images: { unoptimized: true }`), **React 19.2.4**, **Tailwind v4**,
  **framer-motion 12**, **lenis** (smooth scroll), **three** 0.180. **Node ≥ 22.**
- ⚠️ **This is NOT the Next.js you know** (per `AGENTS.md`): the version has breaking
  changes vs. training data. Read `node_modules/next/dist/docs/` before writing
  Next-specific code. The build runs the **React compiler lint** — rules like
  `react-hooks/refs` (no reading `ref.current` during render) and
  `react-hooks/immutability` (don't mutate an object also read in an effect) WILL
  fail the build. Use callback refs / a rendered `<audio>` element etc. (see
  `Journey.tsx` and `Score.tsx` for the patterns that pass).
- **Route pattern:** `src/app/<route>/page.tsx` is a **server component** that
  exports `metadata` and renders a **client** component from
  `src/components/companion/` (or `sections/`, `room/`, `universe/`).
- **`src/lib/base.ts`** — helpers: `asset(p)` (prefixes `BASE_PATH` for any public
  asset referenced in code), `ogImage(p)` + `socialCard(slug,title,description)`
  (metadata), `SITE_ORIGIN`, `BASE_PATH`.
- **`src/lib/registry.ts`** — **the single source of truth** the site reads:
  `NORTH_STAR`, `CHARACTERS`, `STREET_SUBJECTS` (+ `streetSightingsFor`), `EVIDENCE`,
  `BEATS`, `ARC`, `LEVELS`, `ROUTES`, `WORKS`, `EXPANSIONS`, `DEVLOG`, `PHASES`,
  `ALT_FRAMES`, and **`INTAKE`** (the follow/wishlist CTA config). Add content here;
  components read from it so "the site and the game speak the same language."
- **`src/lib/frames.ts`** — `HERO` (→ `/frames`, 169) and `CINE` (→ `/frames2`, 169)
  scrub-sequence configs + scroll "beat" cards.
- **`src/lib/prompts.ts`** — the Master Visual Prompt Library (see §9).
- **Design system (`src/app/globals.css`):**
  - Tokens: `--background:#0a0b0d` (graphite void), `--foreground:#e7e9ec`,
    `--muted:#888d94`, `--accent:#e0531f` (OVS burnt orange), `--teal:#6fc6d6`
    (cold HUD teal), `--steel:#14161a`, `--panel` / `--panel-border`.
  - Utility classes: `.grain` (scanlines), `.glass` (HUD panel), `.hud-frame`
    (corner brackets), `.glow-accent` (orange glow), `.mono` (mono font),
    `.scroll-animation` (tall frame-scrub parent), `.animate-marquee`,
    `.eq-bar` (equalizer, reduced-motion aware).
  - Fonts: Geist sans + Geist mono (next/font). Mono is used for all labels/eyebrows.
- **Metadata routes:** `src/app/sitemap.ts`, `src/app/robots.ts`,
  `src/app/not-found.tsx` (→ `out/404.html`, served for any unmatched path).

---

## 6. ROUTES (17 live)

`/` (home) · `/universe` · `/studio` · `/characters` · `/street` · `/wardrobe` ·
`/score` · `/journey` · `/room-testifies` · `/room-14` · `/tapes` · `/motel` ·
`/evidence` · `/devlog` · `/press` · `/prompts` · `/alt`
Plus generated `sitemap.xml`, `robots.txt`, `404.html`.

Nav lives in `src/components/ui/Navbar.tsx` (renders on the home page; shows a
full menu at `lg`, a hamburger overlay below `lg`). Companion pages have their own
`← OVS // LIKENESS` back-link instead of the navbar.

---

## 7. BUILD · LINT · DEPLOY (exact steps)

```bash
cd likeness-site
npm ci                                   # Node >= 22
npm run lint                             # MUST pass (React-compiler rules are strict)
NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build   # → likeness-site/out/

# ---- PUBLISH (manual; writes the generated build to gh-pages) ----
touch out/.nojekyll                      # keep Pages from Jekyll-processing _next
# Replace gh-pages contents with out/ and push. Safe recipe (worktree):
#   git fetch origin gh-pages
#   git worktree add -B gh-pages /tmp/ghp origin/gh-pages
#   find /tmp/ghp -mindepth 1 -not -path '/tmp/ghp/.git*' -delete
#   cp -a out/. /tmp/ghp/
#   (cd /tmp/ghp && git add -A && git commit -m "Publish: <what>" && git push origin gh-pages)
#   git worktree remove /tmp/ghp --force
# Then confirm the "pages build and deployment" run is green. If it fails/times out,
# push an empty commit to gh-pages to re-trigger.
```

Source changes themselves go through a **PR into `claude/dreamy-hawking-VcoBe`**,
then rebuild+publish from the merged source.

**2026-10-22 safe publisher addition:** prefer the guarded implementation of the
same branch-based publish model in `scripts/production/publish.py`. Run
`python3 scripts/production/publish.py --check`, then from a clean checkout of
the merged canonical source run `python3 scripts/production/publish.py --publish
--expected-source SOURCE_SHA --expected-pages PAGES_SHA` with the actual observed
SHAs. It rebuilds, validates and rejects changed tips. See
`docs/production/WORKFLOW.md` for the release verification and rollback steps.
The new source-validation Action does not deploy or change Pages settings.

---

## 8. ASSET INVENTORY (all assets live in `likeness-site/public/`)

Reference assets in code via `asset("/path")` (it prefixes the base path). In
metadata use `ogImage("/path")`. Raw counts:

| Folder | Count | What | Used by |
|---|---|---|---|
| `public/frames/frame_0001..0169.jpg` | 169 | HERO scrub sequence | `/street` canvas sweep, `lib/frames.ts` `HERO` |
| `public/frames2/frame_0001..0169.jpg` | 169 | CINE scrub sequence | home `CinematicReveal`, `lib/frames.ts` `CINE` |
| `public/stills/*.png` | 39 | Rendered key stills (see list below) | most pages |
| `public/subjects/*.png` | 5 | Character select/sheet plates | `/characters`, `/street` |
| `public/og/*.jpg` | 9 | Social preview cards (generated, 1200×630) | OG/Twitter metadata |
| `public/video/*.mp4 (+poster .jpg)` | 5 | Motion clips + scrub video | `Motion`, universe scrub |
| `public/assets/audio/cue_00..05.wav` | 6 | **Synthesized** score cues | `/score` player |

**`public/stills/` (39):** apt-investigate-crt, apt-photo-wall, apt-study-desk,
apt-study-wide, bathroom, bedroom, choice-door, drya-atrium, drya-close,
drya-corridor, drya-customization, drya-face-study, drya-lock-sheet, drya-main-menu,
drya-over-shoulder, drya-tape, fabric, hallway-door14, key-14,
likeness-tape003-poster, living-room, office, open-world-city, ovs-poster,
polaroids, poster-room14, study-window, the-other, thoreau-desk, thoreau-lock-sheet,
thoreau-mirror, thoreau-portrait-clean, thoreau-stealth, thoreau-waking,
thoreau-watching, three-tapes, typewriter-note, wall-of-photos, world-board.

**`public/subjects/` (5):** drya-select, drya-sheet, thoreau-portrait, thoreau-sheet,
thoreau-title.

**`public/og/` (9, generated):** home, studio, street, wardrobe, score, journey,
characters, universe, room-testifies `.jpg`. Regenerate with the method in §9.

**`public/video/` (5):** investigate-motion.mp4 (+.jpg), study-motion.mp4 (+.jpg),
scrub.mp4.

**`public/assets/audio/` (6):** `cue_00.wav` (room tone, 12s loop), `cue_01` (arrival),
`cue_02` (residue), `cue_03` (mirror lag), `cue_04` (tape contradiction, stereo),
`cue_05` (double occupancy). **These were synthesized from scratch** (Python
`wave` stdlib — sine drones, fluorescent hum, filtered-noise hiss, detuned piano,
pitched echo). No samples; original. To regenerate/extend, write a Python script
using the stdlib `wave` module (see the `/score` cue descriptions for the recipe).

---

## 9. PROMPTS — the Master Visual Prompt Library

**`src/lib/prompts.ts`** (rendered at **`/prompts`**) is the **complete, paste-ready
prompt library** used to generate every image asset, in the OVS six-part skeleton.
This is how new on-brand assets are made.

- **Type:** each `Prompt` has `{ id, cat, title, label, ratio, scene, camera, light,
  negative }`. Paste-ready for Midjourney v6+, Flux, SDXL, Imagen, Sora (still),
  Nano Banana.
- **10 categories (`CATEGORIES`):**
  - **A** Key Art & Posters · **B** Character Studies · **C** Environments ·
    **D** Object Macros & Evidence · **E** Tape Footage · **F** Reality-Shift ·
    **G** UI · Title · Menu · **H** Steam & Marketing · **I** Devlog & Social ·
    **J** Reference Boards (input for UE5 lighting / MetaHuman).
- **House style baked into every prompt:** motivated tungsten key + teal threshold
  spill, sepia-umber grade, crushed shadows, warm subsurface scattering, 50mm,
  shallow DOF; **negatives** always ban text/logos, plastic AI skin, glamour
  smoothing, neon, jump-scare framing, extra figures.
- **OG social cards** were generated separately by rendering an OVS-styled HTML
  template at 1200×630 in headless Chromium (background still as a base64 data URI
  + gradient + grain + OVS mark + eyebrow + title + tagline), exported as JPEG q84
  → `public/og/<route>.jpg`. The generator script approach is reproducible; keep
  the card list in sync with routes.

> "all prompts" are **in the repo** at `src/lib/prompts.ts` and visible at `/prompts`.
> There is no separate prompt file to chase down.

---

## 10. WHAT WAS BUILT (recent changelog — all live)

1. **`/street`** — cinematic surveillance-sweep "street cast" (canvas frame-scrub,
   kinetic type, doubles). (Recreation of an easytomorrow.com/street-style scroll
   experience, reframed to LIKENESS.)
2. **`/wardrobe`** — motel-noir lookbook (identity-locked garment cards).
3. **`/score`** — "room tone as music": 6 **synthesized** audio cues with a real
   play/pause player + animated waveforms.
4. **`/studio`** — Omnia Vanitas Studios manifesto (doctrine + registry-driven
   anthology + north star).
5. **`/journey`** — scroll-driven 5-chapter journey of Tape 03 (pinned parallax +
   progress rail). Original homage to `amirmushichge/tea-leaf-scroll-world`'s form
   (built native — their Cloudflare/D1 stack was not grafted in).
6. **Home "Threads" band** — surfaces `/street` `/wardrobe` `/score` from the home page.
7. **`/street` cast → registry** — `STREET_SUBJECTS` in `registry.ts`, linked to
   character IDs; `/characters` shows "SEEN ON THE STREET" cross-links.
8. **Mobile pass** — hamburger overlay nav (nav was `lg`-only), mobile `/journey`
   progress bar + continuous active-stage detection.
9. **Open Graph pass** — 9 social cards + `openGraph`/`twitter` metadata site-wide
   (`socialCard()` helper; absolute URLs).
10. **404 + sitemap + robots** — on-brand `not-found.tsx`, `sitemap.ts`, `robots.ts`.
11. **OVS INTAKE CTA** — site-wide follow/wishlist call-to-action (`FollowCTA`,
    `band`+`compact`), driven by `INTAKE` in `registry.ts`.

---

## 11. OPEN TASKS / NEXT STEPS

- **Light up the CTA:** set `INTAKE.steam` / `INTAKE.discord` / `INTAKE.newsletterAction`
  in `src/lib/registry.ts` (one place). Email signup needs a form POST endpoint
  (Formspree/Buttondown) since the site is static. GitHub "Follow development" is
  already live as the default.
- **Deploy weight:** `gh-pages` carries two 169-frame sequences + audio + OG cards.
  Deploys occasionally flake/time out. Consider compressing/trimming the frame
  sets (or moving them to a CDN/release) to make deploys faster and more reliable.
- **Accessibility:** add `prefers-reduced-motion` guards to the canvas scroll-scrub
  and parallax (the `eq-bar` already has one).
- **`/journey` art:** swap the stand-in frames for stage-specific art.
- **Analytics:** add a privacy-light snippet to learn what lands.
- **Bigger picture:** the site is ahead of the game — the highest-value work is now
  the **game vertical slice** (Room 14, mirror-lag, tape playback), not more pages.

---

## 12. COLLABORATION RULES (Claude ⇄ Codex) — be non-destructive

- **Branch from `claude/dreamy-hawking-VcoBe`; PR into it; never force-push.**
- Before republishing `gh-pages`, **fetch and confirm nobody else pushed there**
  since your last publish; **rebuild from the merged source** so you don't clobber
  the other agent's work. Only the publish step writes `gh-pages`, and it's a full
  replace — so always build from current merged HEAD, never a stale `out/`.
- Keep changes **additive**. Content/data → `registry.ts`. Don't hand-edit
  `gh-pages`. Don't touch `main` (Android app).
- Both agents read `likeness-site/AGENTS.md` (project status + deploy model) and
  this file on clone.

---

## 13. PRODUCTION PIPELINE AND PASSBACK (2026-10-22 addition)

Read `docs/production/README.md` after this file for the additive execution layer:
upload reconciliation, Codex/Claude exchange receipts, Blender delivery, Unreal
proof, public-domain/free/paid asset decisions, validation and safe publishing.
Use `docs/production/templates/SESSION.md` for each exchange. The current audit
and unresolved state-schema conflicts are in `docs/production/AUDIT_AND_INTAKE.md`.

The first ten uploads are inventoried in `data/production/intake-batch-001.json`;
more files are expected. New batches are create-only. Older package instructions
to use `main`, install Vite or restore biomech framing are not adopted.
`data/production/asset-plan.json` contains candidates, not acquired/approved assets.
Accepted assets still require entries in `handoff/data/asset_manifest.csv`.

Run `npm run validate:production` and `npm run test:production` along with lint
and the base-path static build. No new branching runtime, microphone, paid
generation, Blender model or Unreal build is implied by these pipeline docs.

**Batch 002 (2026-10-23):** ten further files are reconciled in
`docs/production/INTAKE_BATCH_002.md`. All 205 file occurrences in the three
handoff ZIPs map to existing paths; do not restore their older registries or
reinstall their Vite starter. The four prompt PDFs have a physical-page source
index in `data/production/prompt-source-index.json`; Eden Cut remains an alternate
reference. See `docs/production/PROMPT_SOURCE_ROUTING.md` before selecting prompts.
Intake supports repeatable `--previous-batch` arguments to skip unchanged uploads
without losing changed revisions. Preserve batch 001 and append later batches.

