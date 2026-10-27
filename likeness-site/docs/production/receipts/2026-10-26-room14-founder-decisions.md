# Founder decisions — Room 14 authority, map, cassette, publishing (2026-10-26)

- Session / sender / receiver: Claude Code `session_01M7hBtD6sjMASJZcMJkMzxS` / Claude, recording Brandon's answers in chat / Codex + next agent
- Answers to the "Founder decisions still open" in [reviews/2026-10-26-room14-authority-cassette-review.md](../reviews/2026-10-26-room14-authority-cassette-review.md)
- Branch: `claude/room14-decisions-2026-10-26` → PR into `claude/dreamy-hawking-VcoBe` (Brandon chose "PR for now")

| # | Question | Brandon's answer | Recorded decision | Status |
|---|---|---|---|---|
| 1 | Does the 2026-09-05 G02 lock govern? | "Confirm unless you suggest otherwise." Claude raised no objection: the geometry was measured and matches | **The G02 lock governs Room 14's game greybox:** interior 5.4864 × 3.81 × 2.5908 m (18 ft × 12 ft 6 in × 8 ft 6 in), plus the source-locked relationships (bed left, window, entry and bathroom doors, dresser/TV, mirror on the right wall). The 3.5 × 5.0 × 2.8 m target is **retired** and marked superseded where it appears | **APPROVED** |
| 2 | Build `L_Dellwood_Room14` from the locked greybox, or conform the old `Lvl_Room14`? | "Which is better, go with that." | **Build from the locked greybox.** It is measured and founder-locked, while `Lvl_Room14` predates the lock, is unmeasured, and conforming it would mean editing an original map. `Lvl_Room14` stays as reference. Do it in the sandbox first (GAME_LANE GL-17) | **APPROVED** |
| 3 | Reopen G02 for the entry review camera, or rule review cameras outside the lock? | "What do you suggest?" | **Recommended:** rule that review cameras are review tooling outside the spatial lock. They don't change the envelope, anchors, furniture or relationships. Any camera change ships as a new versioned derivative with a receipt, the locked `.blend` stays byte-identical, and a camera never establishes canon. That keeps the lock on geometry without reopening the gate for every camera fix | **PENDING Brandon's yes.** Until then V002 stays a derivative; nothing depends on it yet |
| 4 | Where did `Deko_MatrixDemo` come from? | "I have no idea at the moment." | Provenance stays **`BLOCKED_PROVENANCE`**. Neither mesh is assigned to `PROP_TAPE_001`; the original proxy (GL-18) is the path. A read-only search of the connected Gmail for Deko, Matrix Demo and Fab/Epic senders found nothing. The Epic/Fab account may use another address. Check fab.com → My Library, or the Epic launcher's Fab/Vault library, when convenient | **OPEN (non-blocking)** |
| 5 | PR the unpublished source commits, or publish them? | "PR for now." | Nothing is published. New work goes through PRs. The 8 commits from the Claude lane already on the source branch (`b2bf6ad` … `f4aa047`) can't be reopened as a PR without rewriting history, which the handoff forbids, so this PR links their compare view for review instead. `gh-pages` stays at `00353a9` | **APPROVED** |

## Effect on the queue

- GAME_LANE: the Room 14 row now records the lock and the build-from-greybox plan; the inspect-logic row is corrected (the `RunTrace` note was stale); GL-17 (map build) and GL-18 (cassette proxy) added.
- Codex's next task is unchanged: GL-18, the original cassette proxy and its 10-second editable proof.
- OVS-OS and Codex's Blender/Unreal files are unchanged. Recording the confirmation inside OVS-OS belongs to that repo's lane.

## Addendum (2026-10-26, later)

- Brandon: "I approve we can continue to next gate." Decision 3 (review cameras are tooling outside
  the G02 spatial lock, changed only through versioned derivatives with receipts) is now **APPROVED**.
  V002 can serve as the entry review camera without reopening G02; the locked `.blend` stays untouched.
- PR #20 merged as `73180ad`.
- Next gate started: GL-18 (receipt `2026-10-26-GL-18-cassette-proxy.md`).
