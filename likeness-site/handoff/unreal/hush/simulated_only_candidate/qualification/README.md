# GL-19R.1 · Source qualification fixture (HOST SHIM ONLY)

**This is not Unreal Engine validation.** The host shim intentionally replaces Unreal reflection, world, delegates and logging with minimal C++ stand-ins so the **same candidate C++ source** can be compiled and its event behavior exercised on Linux/macOS with a C++17 compiler. It provides no UHT generated code, editor, Blueprint reflection, input mapping, PIE, Audio Mixer, actual actor or memory proof.

## Reproduce

From this directory (or any directory):

```sh
bash run_host_shim.sh
```

Requires `g++` (or `CXX=clang++`); writes only to a temporary directory, which is removed on exit. The script compiles the **actual** `../OVSNoiseListenerComponent.cpp` and `../Public/OVSNoiseListenerComponent.h`, not a rewritten logic duplicate, with the stub headers in `stubs/`.

Expected successful output:

```text
HOST_SHIM_PASS checks=20; NOT_UE_COMPILATION
```

## What the 20 assertions actually cover

- Disarmed noise ignored; under-8 simulated margin ignored; exact 8 = minor
- Exact 20 = major; under-20 = minor
- Nonfinite NaN/Infinity input ignored
- Refractory suppresses events inside 1.2 seconds; event resumes at boundary
- Same-session `Arm()` is idempotent and cannot reset refractory
- `Deafen(1.5)` suppresses events before expiration and resumes exactly when due
- Deafening survives `Disarm()` / `Arm()` reentry
- Noise after `Disarm()` ignored
- Reentrant event from within event callback suppressed
- Misordered thresholds safely clamp to nondecreasing values
- `IsArmed()` state behavior, source and reason fields preserved

**Excluded / not proven:** Unreal Header Tool (UHT), true `UCLASS` metadata/reflection, module build/link, engine 5.8 API signatures, actor placement, `BeginPlay` output, runtime microphone privacy, input bindings, director exposure/quiet decay/rewind, 3-beat animation, G06 load/exit or GL-15 hide-spot baseline.

## Custody

Tested against source candidate blob hashes (Git blob SHA-1):
- Header corrected review candidate: `df5c70f12d03c127730da932993e077db68f5ed3`
- CPP existing: `0e68687824f58f4092991cb4b50c3109edc9fe95`

The previous review candidate header before metadata correction was `d4d8239fd9453098c640309ec24d75f716079d9e`. The correction places `DisplayName` inside `meta=(...)` in `UCLASS`, consistent with Unreal 5.8 class metadata documentation.

Source compilation: GNU g++ 14.2, C++17 with `-Wall -Wextra -Werror -pedantic`. The source was **not** compiled by UE5.8/UHT; do not describe this as an Unreal build.

**GL-19R.1 disposition: CONDITIONAL HOST-SOURCE QUALIFICATION ONLY.** Human review and actual GL-15/G06 gates remain.
