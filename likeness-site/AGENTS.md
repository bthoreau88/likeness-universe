<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-status -->
# Project status & deploy — read before working

**Full handoff:** see `likeness-site/CODEX_HANDOFF.md` for the complete package
(project map, deploy model, architecture, asset + prompt inventory, changelog,
open tasks, and a paste-ready starting prompt). The essentials follow.

**Repo renames (July 2026).** This repo is now `likeness-universe` (was `dev-brandon`).
Related renames: `2025May_Team04` → `quickphrase-midterm`, `OVS-OS` → `ovs-os`.
GitHub redirects the old URLs, but update any clone's remote:
`git remote set-url origin https://github.com/bthoreau88/likeness-universe.git`.
Repos `NewRepo` and `desktop-tutorial` are slated for deletion — do not reference them.

**Branches.** `claude/dreamy-hawking-VcoBe` is the deploy source branch and holds the
newest work. Branch from it for any site changes so you don't recreate or clobber
existing pages (e.g. the `/street` route).

**Deploy model — do not fight it.**
- Source is this Next.js app (`likeness-site/`). Build is a static export (`output: "export"`).
- The **live site is served from the `gh-pages` branch**, which contains a *generated*
  build. **Never hand-edit `gh-pages`.**
- There is **no CI deploy** (the old `deploy-pages.yml` Action was removed on purpose —
  it never actually deployed the site). Publishing is manual:
  build with `NEXT_PUBLIC_BASE_PATH=/likeness-universe`, then push the `out/` folder to
  `gh-pages`. Live at `https://bthoreau88.github.io/likeness-universe/`.
- The base path must match the repo name; if the repo is renamed again, rebuild with the
  new `NEXT_PUBLIC_BASE_PATH` or every asset link 404s.
<!-- END:project-status -->

## Production execution layer (2026-10-22)

After CODEX_HANDOFF.md, read `docs/production/README.md` and the latest receipt
under `docs/production/receipts/`. Use the exchange template for Codex/Claude
passbacks. Uploads are reconciled in immutable intake batches, not copied over
the application. Site-facing content still belongs in `src/lib/registry.ts`.
Run `npm run validate:production` and `npm run test:production` before lint/build.
Blender/Unreal completion requires actual versioned artifacts and proof.
The source-validation workflow is separate from branch-based Pages publishing.
