# OVS-LKN-COORD-G01 V001 — return package

**Founder-authorised coordinated production handoff: authorised preflight and bounded remediation.**

| | |
|---|---|
| Prepared | 2026-11-21 to 22, Claude Code (cloud session) |
| Branch | `claude/lkn-coord-g01-preflight-v001`, from canonical `claude/dreamy-hawking-VcoBe` @ `3a87155` |
| Canon effect | None |
| Paid spend | Zero |
| Merge | None |
| Publication | None (`gh-pages` untouched at `00353a9`) |
| Status | **Submitted for independent review and founder approval.** Work stops here |

---

## 01 — Exact-source and commit reconciliation

### Repository state, refreshed 2026-11-21

| Ref | Handoff value | Current value | Note |
|---|---|---|---|
| Canonical `claude/dreamy-hawking-VcoBe` | — | `3a87155dfeaff4401275c24e53b30f4c06cac086` (2026-11-19 20:44 PST) | Merge of PR #35 |
| PR #25 (G02 originals/editorial) | draft, open, `d9e152b` | **Merged** 2026-11-20 04:44 UTC; head `d9e152b` | Head is an ancestor of canonical |
| PR #26 (G02A a11y remediation) | merged, `36dc905` | Merged, merge commit `36dc905` | **Matches** |
| PR #33 (D1/D2 fixes) | draft, open, `d2e376a` | **Closed unmerged** 2026-11-20; head `d2e376a` | Its content is in canonical via PR #35 (`12890a4`); head is an ancestor of canonical |
| PR #34 (Journey weapon-HUD fix + roadmap) | not in handoff | Merged 2026-11-20 04:39 UTC (`168133c`) | Already removed the HUD image from Journey Stage I |
| PR #35 (integration of #25 + #33) | not in handoff | Merged 2026-11-20 04:44 UTC (`3a87155`) | Current canonical head |
| `gh-pages` (live) | — | `00353a906656…` (2026-10-24) | Not published since; still serves `/prompts/` |
| This branch | — | `b028697` FD-003 · `115eac4` mobile-nav focus · `dde9b2d` G01A.3 engine · `7041caf` briefs/mockups/evidence · plus this package commit | Not merged |

**Conflicts resolved.**
- The handoff's "historical reference values" for #25 and #33 are stale. Both were superseded by #35 and are contained in canonical, so nothing from them is missing.
- The handoff's website item 1 (HUD audit) had already been actioned by PR #34. This gate re-verified it (§03).

### Source authorities

| Authority | Version / location | SHA-256 | Available |
|---|---|---|---|
| LIKENESS : THE GAME Production Bible | V001, `likeness-site/handoff/OVS_LIKENESS_THE_GAME_Production_Bible_V001.pdf` @ `3a87155` | `d7cf9eda7eb225bdb36f629454a1c1290258c7fefae9903f03172b308ba6a9f1` | Yes |
| Tape 03 Branching Narrative Bible | V.002, Google Drive `1OFRqwpvyDXxYMLvVa7pr3bvUTpYbrxhY` (created 2026-07-12) | `c5504c3e15caeacf44d369435efca397b43535da25bc64a2c319eb141d3aaa09` | Yes. Variants also on Drive: V002_EXPANDED_V2, V002_PROJECT_INTEGRATION_V2 (V.002.1), V002_2_CLAUDE_SOUND_EXPANSION (V.002.2). **V.002 was used as the stated authority**; the later patches were not reconciled against it in this gate |
| OVS-GAME-BRANCH-G01A.1 package | — | — | **No.** Searched likeness-universe (all branches), OVS-OS (392 branches), Drive, Gmail |
| OVS-GAME-BRANCH-G01A.2 V002 package | — | — | **No.** Same search |
| OVS UE 5.8 Plug-and-Play Workflow | `likeness-site/handoff/UE58_PACKAGE_ADOPTION_MAP.md` @ `3a87155` | `57f6e565de7b87d494db16f4960c0de638f5251e8584f956ae380545f924d3f6` | Yes (adoption map; the package itself is on the workstation) |
| LKN-SITE-G02A D1/D2 Fix (PR #33 report) | `docs/production/receipts/2026-11-14-LKN-SITE-G02A-d1-d2-stacked-fix.md` @ `3a87155` | `6509225f271741c9da77103b10331a755923b5b1929c23b5e102d9a28fcea110` | Yes |
| OVS Dialogue Naturalism Law | V001, OVS-OS `codex/ovs-dialogue-naturalism-law-v001` @ `2711c91` | (branch head) | Yes. Draft PR, not main-canonical |
| OVS Ivory Ledger PDF standard | V001, OVS-OS `codex/ovs-ivory-ledger-pdf-law-v001` @ `b12ae54` | (branch head) | Yes. Draft PR, not main-canonical |
| LKN-GAME-UNIFY-G01 approved source | OVS-OS `codex/lkn-game-unify-g03a1-reconciliation` @ `b6244dc` | (branch head) | Yes (inherited ledger law) |
| Story bible and screenplay (draft) | `likeness-site/handoff/story/` @ `3a87155` | — | Yes. HUMAN-lane draft; GL-16 unsigned. Used only as descriptive reference for the exterior |

**Rule applied.** Newer approved decisions win over historical material. The founder decisions FD-001 to FD-005 in this handoff are the newest authority. The story draft is cited only as description, never as authority.

## 02 — Founder decision implementation matrix

| Decision | What was done | Evidence | Status |
|---|---|---|---|
| **FD-001** Purpose-made Dellwood exterior for Journey Stage I — concept and QC only | Audited the current image; wrote the concept brief, framing plan (F1–F3) and 12-point visual QC sheet. No image produced or changed | `reviews/2026-11-21-FD-001-journey-exterior-concept-brief.md` | **Done (concept).** Awaiting founder Q-E1 to Q-E3 |
| **FD-002** Separate master game branding from TAPE 03 episode branding | Audited title, navbar and hero usage (episode used as master in three places; five title patterns). Three mockup boards: hierarchy, lockups and title grammar, two hero options. **Not applied to the site**, pending choice | `evidence/2026-11-21-coord-g01/mockups/board-1..3.png`, `branding-hierarchy.html` | **Done (mockups).** Awaiting choice |
| **FD-003** Prompts becomes internal; remove from public nav; keep resources; audit access | Removed all five rendered links; dropped `/prompts` from the sitemap; `noindex,nofollow` on the route. Route, component and data untouched. Access audit below | Commit `b028697`; regression `checks.prompts` | **Done (navigation).** Access control **not achievable** on the current hosting (see below) |
| **FD-004** Advance G01A.3 independently | Engine, schemas, fixtures, UE spec, persistence harness, cold-read protocol and rubric, causality findings. G01A.2 untouched | `handoff/game/narrative/` | **Partial.** Blocked on the G01A.2 package for D42/R13/R22/R23/W22, the 28 utterances and node-ID preservation |
| **FD-005** No automatic merge, publication, canon promotion or paid spend | Draft PR only; `gh-pages` untouched; no canon files edited; zero spend | This package | **Complied** |

### FD-003 access-control audit (actual)

| Question | Finding |
|---|---|
| Is `/prompts` still built? | Yes: `out/prompts/index.html` |
| Is it linked anywhere on the candidate? | No. Zero rendered `a[href*="/prompts"]` across 25 routes × 2 viewports (baseline: 4 surfaces) |
| Is it in the sitemap? | No (baseline: yes) |
| Search engines | `<meta name="robots" content="noindex, nofollow">` (baseline: none) |
| Is the content private? | **No.** The prompt text ships in a public JS chunk (`out/_next/static/chunks/2-*.js` contains "Key Art & Posters"). The source `src/lib/prompts.ts` is in a **public** repository |
| Live site today | The `gh-pages` branch (`00353a9`) still contains `prompts/index.html` and links to it. It changes only on the next (prohibited) publication. The live URL could not be fetched from this sandbox (egress proxy refused); the branch contents were checked instead |
| What true restriction would need | Move the library out of the public repo and the static export, for example to the private OVS-OS or ovs-studio-brain repo. This is a separate founder decision; FD-003 says "do not delete underlying resources", so nothing was moved |

## 03 — Journey exterior concept brief and visual QC sheet

See `reviews/2026-11-21-FD-001-journey-exterior-concept-brief.md`.

- **Headline:** the HUD is gone (PR #34), but Stage I shows an interior with armour-like costume that contradicts `EXT · THE STREET`.
- None of the 39 existing stills shows the Dellwood exterior. Checked on a contact sheet; the only exterior is the retired HUD street image.
- The brief keeps the current image as an interim placeholder and specifies the F1 shot: pavement-level 35 mm, caseless cassette, Room 14 door, wet night, 03:14.

## 04 — Master-game and Tape 03 branding mockups

`evidence/2026-11-21-coord-g01/mockups/`:

| Board | Content |
|---|---|
| 1 | Three-tier hierarchy (OVS → LIKENESS : THE GAME → TAPE 03) and the current-usage audit |
| 2 | Navbar current vs proposed, master and episode lockups, one `<title>` grammar |
| 3 | Home hero options A (master-first, recommended for `/`) and B (episode landing) |

All boards are rendered with the site's own Geist fonts and `globals.css` tokens. No imagery was generated. The episode subtitle is left as "[founder to confirm]".

## 05 — Website remediation diff and regression evidence

**Code diff** vs `3a87155`: 6 files, +27 / −25.

| File | Change |
|---|---|
| `Navbar.tsx` | −2 prompt CTAs; +Tab wrap inside the open mobile menu |
| `ConceptFrames.tsx` | −CTA; copy now says the shot orders live in the internal library |
| `UniverseHero.tsx` | −2 links |
| `sitemap.ts` | −`/prompts` |
| `prompts/page.tsx` | +`noindex` metadata and a comment explaining it is not access control |
| `package.json` | +`test:narrative` |

**Why the focus fix is included.** With the mobile overlay open, Tab and Shift+Tab moved into page content hidden behind it. This was reproduced on the baseline: "Meet the two", "View Stills" and the Drya/Thoreau cards were focused invisibly. It violates the acceptance criteria "no hidden keyboard-focus targets" and "functional mobile navigation". The fix is a 21-line wrap in the existing keydown handler.

### Gates (candidate)

| Gate | Result |
|---|---|
| `validate:production` | Valid |
| `test:production` | 19 + 17 pass |
| `test:narrative` | 17 pass |
| `eslint` | Clean |
| `next build` (`NEXT_PUBLIC_BASE_PATH=/likeness-universe`) | Compiled, all routes static |

**Fonts.** The unmodified source builds with `next/font/google` in this environment. **No font workaround was used.** The 2026-11-07 QA note's local swap was needed only where `fonts.googleapis.com` is blocked. Suggested follow-up, not done: switch to the already-installed `geist` package for offline-deterministic builds.

### Browser regression

Headless Chromium 153, served static export, 25 routes (24 sitemap routes + `/prompts/`) × desktop 1440 and mobile 390.

| Check | Baseline `3a87155` | Candidate | Note |
|---|---|---|---|
| Non-200 routes | 0 | 0 | |
| Failed requests / page errors | 0 / 0 | 0 / 0 | Aborted Next.js prefetches are excluded |
| Broken images (D1) | 0 | 0 | `original-media.test.mjs` also passes |
| Retired media | `/alt/` only | `/alt/` only | Intentional, labelled non-canon |
| Internal links | 25 checked, 0 broken | 24 checked, 0 broken | `/prompts/` link removed |
| Horizontal overflow | 0 | 0 | |
| Hidden focus on home (D2), desktop and mobile, 50 Tabs | 0 | 0 | |
| Mobile nav: focus contained | **No**: escaped to 9 hidden targets | **Yes**: wraps both directions; Escape closes; focus returns to toggle | Fixed |
| Reduced motion | Lenis off, Journey parallax static | Same | Preserved |
| axe (WCAG 2.2 AA) serious/critical | `link-in-text-block` ×1 on `/devlog/`, `/alt/` | Same | **Pre-existing, not fixed** (out of FD scope) |
| Rendered `/prompts` links | 4 surfaces | 0 | FD-003 |

Evidence lives in `evidence/2026-11-21-coord-g01/`:
- `{baseline,candidate}-regression-{summary,results}.json`;
- 20 screenshots (6 routes × 3 viewports, Journey Stage I, mobile nav open);
- `scripts/regression.cjs`.

## 06 — Character cold-read scripts and evaluation rubric

See `handoff/game/narrative/G01A3_NARRATIVE_QUALIFICATION_V001.md` §2–4:
- the protocol (CR-0 to CR-4, under Dialogue Law steps 6–10);
- the per-character script template, including "knows / does not know" rows generated by the validator;
- a 7-criterion rubric with a pass rule.

**The scripts themselves are not produced.** The 28 provisional utterances are in the unavailable G01A.2 package. No actor or reader feedback exists, and none is reported.

## 07 — Narrative causality findings

Six findings on the bible's sample charts (qualification doc §7). They are about the bible, not G01A.2.

- **NC-1 (High): Bible §15 template outcome N060 is unreachable.** Every route collects at most 1 evidence item; the gate requires 2. Proven by the validator and a test.
- **NC-2 (Medium):** Dellwood D50 decides "calm" vs "suspicion" by evidence count, not by the truth/lie conversation. A liar who searched the lobby ends "calm".
- **NC-3 to NC-6:** unstated thresholds and edges, an unread POLICE_HEAT consequence, and a D60 knowledge constraint.

D42, R13, R22, R23 and W22 are **formally escalated**: the IDs do not exist in any available source. The W01 rule is implemented and tested; correcting G01A.2's actual W01 line is blocked on its text.

## 08 — Unreal save-state adapter specification

See `handoff/game/narrative/UE_NARRATIVE_STATE_ADAPTER_SPEC_V001.md`. It covers:
- ownership and data flow;
- node and edge schema;
- the frozen 8 variables;
- typed conditions;
- validated mutation;
- flags and facts;
- transactional commit with idempotent decision ids;
- separation of replay and discovery;
- W01 enforcement;
- read-only companion export;
- SaveGame envelope, versioning, stepwise migration and replay verification;
- Dialogue and Sequencer interfaces;
- UE acceptance criteria.

**Not compiled or executed in Unreal.** C++ appears only as a labelled design sketch.

## 09 — Schema and deterministic test fixtures

| Path | Content |
|---|---|
| `schema/narrative-graph.schema.json` | Graph schema (JSON Schema 2020-12) |
| `schema/save.schema.json` | Save envelope schema |
| `fixtures/T03_01_*.json` | Bible §09 |
| `fixtures/T03_02_*.json` | Bible §15, verbatim |
| `fixtures/T03_05_*.json` | Bible §11, with labelled assumptions A1–A4 |
| `fixtures/playthroughs.golden.json` | 11 routes with an expected end state and checksum |

All three fixtures and a real save envelope validate against the schemas (ajv 8.17.1, run in the session scratch area). **These are not "from the existing browser prototype"**: that prototype is part of the unavailable G01A.2 package.

## 10 — Browser persistence and accessibility receipts

**Persistence.** Real headless Chromium 153: 11/11 pass. Results: `handoff/game/narrative/evidence/2026-11-21-browser-persistence-results.json`.

| Scenario | Result |
|---|---|
| Reload restores the exact state and play continues | PASS |
| Separate playthroughs are independent; discovery spans both | PASS |
| A stale tab gets `E_CONFLICT`; newer progress kept; the other tab is notified via the storage event | PASS |
| Concurrent discovery writes merge without loss | PASS |
| A malformed save is reported, quarantined and not deleted | PASS |
| A future-version save is refused | PASS |
| A hand-edited save is refused | PASS |
| A save for a different chapter is refused | PASS |
| A triple-clicked choice applies once | PASS |
| Export then import in a fresh browser profile is byte-identical; import never clobbers | PASS |
| Locked and hidden nodes do not leak into the rendered companion view | PASS |

**Scope.** This qualifies the **reference engine's** persistence layer in a real browser. It is not the G01A.2 browser prototype, which was unavailable.

**Accessibility.** The automated axe and keyboard results are in §05.

| Item | Status |
|---|---|
| Safari / WebKit | **BLOCKED.** Not installed in this environment, and installing Playwright browsers is prohibited here |
| Firefox | **BLOCKED.** Same reason |
| Real mobile devices | **NOT PERFORMED.** Mobile = Chromium device emulation at 390×844 only |
| VoiceOver / NVDA | **NOT PERFORMED.** No screen reader available; no results claimed |

## 11 — Remaining blockers and unverified work

1. **The G01A.2 V002 package (and G01A.1) is unavailable.** This blocks:
   - node-ID preservation and checks of the 7 outcomes;
   - the 28-utterance audit and cold-read scripts;
   - rulings on D42/R13/R22/R23/W22;
   - the actual W01 line fix;
   - convergence validation against the real graph;
   - fixtures taken from the real prototype.
2. **No human cold read** or actor-performance evidence exists, so actor-performance approval cannot be granted.
3. **No Unreal compilation or execution.** The UE 5.8 sandbox G06 load/exit test is still BLOCKED_RESOURCE (free RAM below 4.5 GiB; the MSI was offline at the last check).
4. **Safari, Firefox, real mobile devices, VoiceOver and NVDA:** not performed (§10).
5. **Prompts are not access-controlled** on the current hosting (§02).
6. **A pre-existing axe `link-in-text-block`** on `/devlog/` and `/alt/` is not fixed.
7. **The live site was not fetched** (egress proxy). Live-state claims rest on the `gh-pages` branch contents.
8. **Tape 03 Bible patches V.002.1 and V.002.2** were not reconciled against V.002.
9. **FD-002 is not applied** pending a mockup choice. **FD-001 has no image** by design.

## 12 — Independent review handoff

The reviewer should **not** take this package's word for anything. Reproduce from the branch:

```
cd likeness-site && npm ci
npm run validate:production && npm run test:production && npm run test:narrative && npx eslint
NEXT_PUBLIC_BASE_PATH=/likeness-universe npm run build
# serve: mkdir -p /tmp/s && cp -r out /tmp/s/likeness-universe && (cd /tmp/s && python3 -m http.server 8765 &)
QA_BASE=http://localhost:8765/likeness-universe QA_OUT=/tmp/qa AXE=<axe.min.js> \
  node docs/production/reviews/evidence/2026-11-21-coord-g01/scripts/regression.cjs
cd handoff/game/narrative && (python3 -m http.server 8790 &) && QA_BASE=http://localhost:8790 QA_OUT=/tmp/p node browser/persistence.qa.cjs
```

Specific things to challenge:
1. Is the mobile-nav Tab wrap acceptable UX? Should the logo link be inside the wrap?
2. Do the FD-003 copy changes in `ConceptFrames.tsx` reveal more than intended about the internal library?
3. Is the 0–100 clamp correct?
4. Is the decision-id idempotency model sound for Sequencer-driven commits?
5. Is NC-1 a true defect or an intended teaching beat?
6. Are the schema's `additionalProperties` choices too loose on nodes?

## 13 — Recommended next gate

**OVS-GAME-BRANCH-G01A.4 — G01A.2 ingestion and human cold read.**
1. The founder supplies the G01A.2 V002 package.
2. Load the 33-node graph unchanged, run the validator, and rule on D42/R13/R22/R23/W22 and W01.
3. Generate the 28-line cold-read scripts.
4. Run a real CR-1 read-aloud and CR-2 independent cold read.

In parallel, on the website side, the founder chooses:
- an FD-002 option (A recommended), which unlocks a small branding patch;
- an FD-001 production route (Q-E2), at zero spend;
- whether to relocate the prompt library to a private repository.

UE adapter compilation should wait until G06 passes.

## 14 — OVS Ivory Ledger review PDF and source package

`OVS_LKN_COORD_G01_REVIEW_IVORY_LEDGER_V001.pdf` was typeset per OVS-IL-001 and delivered to the founder **outside the repository**:
- it embeds the OVS logo, and the standard forbids committing logo extractions without an asset-intake decision;
- this repository is public.

Its SHA-256 and page QA are in `receipts/2026-11-21-OVS-LKN-COORD-G01.md`. The complete source package is this branch: every file listed above, at the commit recorded in the receipt.
