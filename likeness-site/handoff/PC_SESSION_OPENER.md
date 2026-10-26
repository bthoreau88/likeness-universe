# PC Session Opener — first 3 messages for Claude Code on the PC

Run Claude Code from the **game-project root** (the extracted V004 folder), with the
Unreal MCP bridge installed and UE 5.8 open. Paste these in order. Do ONE milestone, then
stop and report before the next.

---

## MESSAGE 1 — Orient + verify (no edits yet)
You are the lead technical artist, gameplay engineer, and build producer for
LIKENESS : THE GAME (Omnia Vanitas Studios). Before doing anything, read
README_START_HERE.md, docs/00_OVS_Production_Workflow.md, docs/11_Unreal_Claude_Setup.md,
agents/AGENTS.md, agents/CLAUDE.md, and the registries in /data. Preserve the OVS law:
Face is the budget. Room is the antagonist. Camera is a witness. Image must feel playable.
Then, WITHOUT editing anything: (1) confirm the Unreal MCP/editor bridge is connected,
(2) capture a viewport screenshot, (3) report what you found, the UE version, and what is
missing. Do not change files yet — just report.

---

## MESSAGE 2 — Milestone 01 only (foundation)
Execute Milestone 01 ONLY, following agents/MILESTONE_01_AGENT_PROMPT.md and
docs/17_Milestone_01_Build_Kickoff.md: create/verify the UE 5.8 project skeleton under
/unreal, import the CSV registries from /data as DataTables, ensure Git is initialized
with the foundation commit, and produce a QA report from
agents/MILESTONE_01_ACCEPTANCE_REPORT_TEMPLATE.md. Build NO gameplay yet.
IMPORTANT: do NOT build or scaffold a web app — a full Next.js companion already exists at
bthoreau88.github.io/dev-brandon; the game only needs to share the same registry IDs.
When done, STOP and report: what changed, what was created, what still needs human assets,
and the exact play-in-editor / build test + screenshot that proves the foundation is
healthy. Then commit (`chore: initialize foundation`).

---

## MESSAGE 3 — Milestone 02 only (Room 14 greybox) — after M01 passes
Now Milestone 02 ONLY — Room 14 greybox (see handoff MILESTONE_02_ROOM14_GREYBOX.md).
Greybox Room 14 + a connected hallway at real-world scale (~3.5m x 5m room) *[superseded 2026-10-26: the founder-locked G02 envelope is 5.4864 × 3.81 × 2.5908 m; see docs/production/receipts/2026-10-26-room14-founder-decisions.md]*. First-person
pawn: walk + look, collisions hold. Motivated PLACEHOLDER lighting only (one warm lamp in
Room 14, one fluorescent in the bathroom — no skylight dump). Add a data-driven inspect
trace: BP_OVS_InteractableBase line-traces from the camera; on hit, WBP_OVS_InspectUI
shows the object's name + one inspect line READ FROM THE REGISTRY BY ID. Place 5
placeholder evidence objects tagged: PROP_KEY14_001, PROP_LOCKET_001, PROP_TAPE_001,
PROP_MIRROR_001, PROP_DEVICE_001. NO final art, NO MetaHuman, NO mirror-lag/tape/doubles.
Acceptance: PIE walk works; each object shows the correct registry text (change a CSV value
to prove it is data-driven); scale reads as a motel room. Screenshot proof: one wide of
Room 14, one active inspect prompt. Then commit (`feat: add room 14 greybox`).

---

## Loop after that
One milestone per session: 03 Inspect-full → 04 Mirror Lag → 05 Tape Contradiction →
06 Character refs (4-step) → 07 Integration → 08 Capture → ... Each: read the milestone,
implement, PIE/build test, screenshot, commit. Send me (cloud session) the QA report or any
errors and I'll plan the next step + keep the web companion matched.
