#!/usr/bin/env bash
# Run from any working directory. Requires a local C++17 compiler.
# Only compiles the review-only candidate with fake Unreal interfaces. NO Unreal Engine.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
parent="$(dirname "$here")"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cxx="${CXX:-g++}"
"$cxx" -std=c++17 -Wall -Wextra -Werror -pedantic   -I"$here/stubs" -I"$parent/Public"   "$parent/OVSNoiseListenerComponent.cpp" "$here/host_shim_test.cpp"   -o "$tmp/hush_host_shim_test"
"$tmp/hush_host_shim_test"
