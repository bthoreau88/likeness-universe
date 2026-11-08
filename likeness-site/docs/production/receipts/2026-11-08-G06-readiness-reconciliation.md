# G06 sandbox load/exit — readiness reconciliation (Claude lane)

- Session / date: Claude Code `session_01M7hBtD6sjMASJZcMJkMzxS` / 2026-11-08
- Requested by Brandon: return the exact G06 load/exit receipt, its result and logs, and reconcile it
  before G06 is repeated or the inspect viewer is started.
- Read-only. Nothing in OVS-OS, the MSI, the original game or the sandbox was changed.

## The receipt (historical, written by the Codex lane)

| | |
|---|---|
| Repo / branch | `bthoreau88/OVS-OS` · `codex/lkn-game-ccgs-g06-safe-sandbox-load-revalidation-v001` @ `876f41e0` |
| PR | [OVS-OS #328](https://github.com/bthoreau88/OVS-OS/pull/328), draft, open, not merged |
| Receipt | `projects/likeness/game/proposals/LKN-GAME-CCGS-G06/EXECUTION_RECEIPT_V001.json` (SHA-256 `8d8106d3d98d06daf0e92bf33ca904eb53094118389cd9b8f1dc4083dfdd7891`) |
| Also staged | `README.md`, `LOAD_EXIT_PROTOCOL_V001.md` (pass contract G06-01…12), `PRECHECK_READONLY_V001.ps1` |
| Decision | **`G06_BLOCKED_RESOURCE_NO_EDITOR_LAUNCH`**; last status `ONLINE_TARGETED_APP_CLEANUP_COMPLETE_RESOURCE_HOLD` |
| Editor load / MapCheck / clean exit | `NOT_RUN` / `NOT_RUN` / `NOT_RUN` |
| Load/exit logs | **None exist**: the editor was never launched |
| Precheck script | Run once on the MSI; stdout and exit code **not retrieved** (`INCONCLUSIVE_OUTPUT_NOT_RETRIEVED`). Not a pass |
| Evidence that does exist | Separate read-only probes: original and sandbox `.uproject` `72711D8E…861F7` and `Build.cs` `6D8F4AF…ACEDA` match; Git `4d9bbfe` with the exact 15 status entries; RAM 0.50 → 4.93 → 5.48 → **4.90 GiB final** (threshold 6 GiB); C: 38.24 GB / D: 19.29 GB free. No full file manifest |
| Mutations | None to the original game, sandbox, engine, plugins or canon. App process trees (ChatGPT, Claude desktop, Discord, LinkedIn) were closed to free RAM |

## What the receipt does not know

| # | Fact | Effect on G06 |
|---|---|---|
| 1 | 2026-11-01 ~19:27 PST, after the receipt's last entry: GL-18 measured **4.34 / 4.32 GiB** free (receipt `2026-10-26-GL-18-cassette-proxy.md`) | Newest RAM reading; still below 6 GiB → resource hold stands |
| 2 | That run was headless Blender 5.1.2, exit 0; wrote only `D:\OVS\LIKENESS\PROPS\PROP_TAPE_001\v001\run-20261101-192754\` and `C:\OVS\_gl18\` | No Unreal process; no source or sandbox write; G06-01/02/03 unaffected |
| 3 | 2026-10-25: UnrealBuildTool compiled the staged C++ module in a throwaway project at `C:\OVS\_buildcheck\2e5471f\` (no editor; not the sandbox) | Predates G06; the receipt's "no UBT launched" is correct for G06 itself. Uses some C: space; C: remains above the 12 GiB G06-05 floor |
| 4 | 2026-10-25/26 read-only sweeps (`C:\OVS\_review\…`) recorded the same `.uproject` / `Build.cs` hashes | Independent agreement with G06's selected-hash custody |
| 5 | Room 14 founder decisions (PR #20) and GL-18 cassette proof (PR #22) | Outside G06's scope (IntroRoom load/exit only); no conflict |

## Readiness to repeat G06

Blocked until all of these hold:

1. MSI online. At 2026-11-08 it was **offline** (last seen ~11 h earlier).
2. Two RAM readings of at least 6 GiB.
3. `PRECHECK_READONLY_V001.ps1` re-run with stdout and exit code captured.
4. A new disposable third copy of the sandbox (never the original or the preserved sandbox).
5. Founder approval of the exact launch: `UnrealEditor.exe` path, map `/Game/DemoTemplate/_Core/Lvl_IntroRoom`, timeout.

The inspect viewer needs Unreal as well, so it is behind the same resource hold. The completed
cassette proof is Blender-only and does not clear it.
