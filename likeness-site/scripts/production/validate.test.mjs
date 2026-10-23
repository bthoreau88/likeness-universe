import test from "node:test";
import assert from "node:assert/strict";
import { validateAssets, validateBatch } from "./validate.mjs";

const asset = { id: "PROP_TAPE_001", strategy: "adapt", status: "candidate", rights_status: "unverified", reason: "Inspect proof", targets: ["web", "unreal"] };
test("candidates can exist without fabricated license approvals", () => validateAssets({ schema_version: 1, assets: [asset] }));
test("unverified assets cannot be approved", () => assert.throws(() => validateAssets({ schema_version: 1, assets: [{ ...asset, status: "approved" }] }), /Unverified rights/));
test("duplicate IDs are rejected", () => assert.throws(() => validateAssets({ schema_version: 1, assets: [asset, asset] }), /duplicate asset ID/));
test("engine approval does not imply web distribution permission", () => assert.throws(() => validateAssets({ schema_version: 1, assets: [{ ...asset, status: "approved", rights_status: "verified", source_sha256: "a".repeat(64), license_record: "record-1", qc_status: "passed", approved_targets: ["unreal"] }] }), /Target rights/));
test("intake duplicate claims must match hashes", () => assert.throws(() => validateBatch({ schema_version: 1, files: [{ name: "a", bytes: 1, sha256: "a".repeat(64) }, { name: "b", bytes: 1, sha256: "b".repeat(64), duplicate_of: "a" }] }), /Invalid duplicate/));
