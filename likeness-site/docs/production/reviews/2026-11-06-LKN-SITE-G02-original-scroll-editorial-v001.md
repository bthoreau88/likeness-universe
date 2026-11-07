# LKN-SITE-G02 — Original Character Scroll + Editorial Expansion (V001)

**Status:** FEATURE BRANCH / REVIEW REQUIRED / NOT PUBLISHED  
**Date:** 2026-11-06 (Los Angeles)  
**Source:** `claude/dreamy-hawking-VcoBe` @ `c53809b2e68b6d1dce66f60a8879a8645d8a743d`  
**Feature branch:** `codex/lkn-site-g02-originals-editorial-v001`  
**Reference direction:** NAAU Studios’ editorial work index and AVE Studio’s character-selection/project-process design patterns, based on user-supplied screenshots and public pages. Their source code, visuals and copyrighted art were not copied.

## Why

Founder confirms the existing LIKENESS homepage direction should remain, but the superhero demonstration scroll is unacceptable and must feature original LIKENESS characters. Repo source inspection identified recognizably Iron Man imagery in `public/frames/` and `public/frames2/`; both originally had 169 JPEGs. User also requests more compelling work and character-detail pages inspired by two editorial design examples.

## Delivered on this branch

1. **Original-character scroll media:** `SCROLL_SEQUENCES` in `src/lib/registry.ts` references already-present THOREAU/DRYA/THE OTHER and Dellwood imagery, not third-party superhero frames. `src/lib/frames.ts` now maps the home and Street sequences to registry entries.
2. **Progressive cinematic scrub:** `src/components/atmos/useScrollCanvas.ts` uses scroll-position blends between adjacent source stills, progressively loading only neighboring images. It avoids preloading 169 files at once and guards missing images before drawing.
3. **Retired media:** 338 old superhero JPEGs removed from source in a normal descendant commit. The live Pages branch is untouched, and git history remains available for audit or recovery. The released site still serves the old content until a separately authorized guarded deployment.
4. **Reduced-motion alternative:** home and Street sequences retain an initial still and provide readable static beat descriptions; animated overlays are disabled under the OS reduced-motion setting, and marquees stop.
5. **NAAU-inspired Works index:** `/works/` has editorial typography, filter controls and large independent project stills with four categories grounded in the existing `WORKS` registry.
6. **Case-study pages:** `/works/the-game/`, `/works/tape-03/`, `/works/wardrobe/`, `/works/score/`. The source descriptions, status and media are taken from `WORKS` and `WORK_FEATURES`, without made-up release dates, credits or engine build claims.
7. **AVE-inspired character dossiers:** `/characters/thoreau/`, `/characters/drya/`, `/characters/the-other/` feature large character imagery, switcher thumbnails and source-backed identity/continuity notes. No invented radar stats or copy from the reference site.
8. **Navigation and discovery:** the Works route is linked from the homepage nav and companion route registry; roster cards link to their dossier; all eight new pages are in the sitemap.

## Media and identity governance

All source stills are **existing site assets**, not newly generated or definitively face-authority-locked images. They are a zero-credit visual bridge. A future final 169-frame replacement requires human-approved original-character authorities and a dedicated controlled motion proof. Preserve facial geometry/wardrobe/visual doctrine, and do not imply these stills are production-approved 3D game captures.

## Explicit exclusions

- No live deployment, no merge, no gh-pages or main branch mutation.
- No imported NAAU/AVE code, fonts, artwork or case-study copy.
- No paid generation or image/video renders.
- No canonical game IDs, screenplay or state changes.
- No fictional stats, release date, awards, unverified client credits or unfinished gameplay claims.
- No new Steam, Discord or newsletter endpoints.

## Verification still required

- Source CI: Node 22 `npm ci`, `npm run validate:production`, `npm run test:production`, `npm run lint`, `NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build` to PASS.
- Visual screenshots: home, Street, Works, case-study and character-detail routes at mobile/tablet/desktop, Safari especially.
- Keyboard focus and VoiceOver/NVDA on filters, profile selector, link destinations and nav.
- Reduced motion; scroll source crossfade and position; image fallback on missing asset; bad network.
- Route-level network waterfall and LCP/INP; original source stills are PNG and may warrant optimized derivatives.
- Confirm no references to `/frames/` or `/frames2/` remain in runtime.
- Verify new routes and base-path assets after any guarded release.

## Exit condition / release

Draft PR into `claude/dreamy-hawking-VcoBe`. Human creative review and green source validation first. Merge with review, then from clean merged source execute `python3 scripts/production/publish.py --check` and guarded publish with fresh SHAs. Confirm GitHub Pages green and live smoke tests, not only source CI green.

This work is **not** proof that a newly approved cinematic 169-frame sequence has been authored. It is a copyright-safe, registry-driven editorial replacement and site expansion pending production QA.
