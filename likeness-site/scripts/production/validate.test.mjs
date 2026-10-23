import test from "node:test";
import assert from "node:assert/strict";
import { validateAssets, validateBatch, validateSources } from "./validate.mjs";

const asset = { id: "PROP_TAPE_001", strategy: "adapt", status: "candidate", rights_status: "unverified", reason: "Inspect proof", targets: ["web", "unreal"] };
test("candidates can exist without fabricated license approvals", () => validateAssets({ schema_version: 1, assets: [asset] }));
test("unverified assets cannot be approved", () => assert.throws(() => validateAssets({ schema_version: 1, assets: [{ ...asset, status: "approved" }] }), /Unverified rights/));
test("duplicate IDs are rejected", () => assert.throws(() => validateAssets({ schema_version: 1, assets: [asset, asset] }), /duplicate asset ID/));
test("engine approval does not imply web distribution permission", () => assert.throws(() => validateAssets({ schema_version: 1, assets: [{ ...asset, status: "approved", rights_status: "verified", source_sha256: "a".repeat(64), license_record: "record-1", qc_status: "passed", approved_targets: ["unreal"] }] }), /Target rights/));
test("intake duplicate claims must match hashes", () => assert.throws(() => validateBatch({ schema_version: 1, files: [{ name: "a", bytes: 1, sha256: "a".repeat(64) }, { name: "b", bytes: 1, sha256: "b".repeat(64), duplicate_of: "a" }] }), /Invalid duplicate/));

const source = { id: "EDEN", file: "eden.pdf", sha256: "c".repeat(64), family: "alternate_eden", adoption: "reference_only", auto_import: false, page_count: 96, sections: [{ id: "boards", pages: [8, 15] }] };
const batch = { files: [{ name: "eden.pdf", sha256: "c".repeat(64) }] };
test("alternate reference remains indexed without runtime adoption", () => validateSources({ schema_version: 1, sources: [source] }, [batch]));
test("prompt sources must match inventoried bytes", () => assert.throws(() => validateSources({ schema_version: 1, sources: [{ ...source, sha256: "d".repeat(64) }] }, [batch]), /inventoried bytes/));
test("alternate source cannot be silently auto-imported", () => assert.throws(() => validateSources({ schema_version: 1, sources: [{ ...source, auto_import: true }] }, [batch]), /runtime content/));
test("page references must fit actual source", () => assert.throws(() => validateSources({ schema_version: 1, sources: [{ ...source, sections: [{ id: "bad", pages: [90, 103] }] }] }, [batch]), /outside source PDF/));
