import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const directory = path.join(root, "data/production");
const load = (name) => JSON.parse(readFileSync(path.join(directory, name), "utf8"));
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const hash = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);

export function validateAssets(plan) {
  requireValue(plan.schema_version === 1, "Unsupported asset plan version");
  requireValue(Array.isArray(plan.assets) && plan.assets.length > 0, "Missing assets");
  const ids = new Set();
  for (const item of plan.assets) {
    requireValue(typeof item.id === "string" && !ids.has(item.id), "Missing or duplicate asset ID");
    ids.add(item.id);
    requireValue(["reuse", "source", "adapt", "custom"].includes(item.strategy), `Invalid strategy: ${item.id}`);
    requireValue(["candidate", "staged", "approved"].includes(item.status), `Invalid status: ${item.id}`);
    requireValue(["unverified", "verified"].includes(item.rights_status), `Invalid rights: ${item.id}`);
    requireValue(typeof item.reason === "string" && item.reason.length > 0, `Missing reason: ${item.id}`);
    requireValue(Array.isArray(item.targets) && item.targets.length > 0 && item.targets.every(t => ["web", "unreal", "capture"].includes(t)), `Invalid targets: ${item.id}`);
    if (item.status === "approved") {
      requireValue(item.rights_status === "verified", `Unverified rights: ${item.id}`);
      requireValue(hash(item.source_sha256), `Missing source hash: ${item.id}`);
      requireValue(typeof item.license_record === "string" && item.license_record.length > 0, `Missing license record: ${item.id}`);
      requireValue(item.qc_status === "passed", `Missing QC: ${item.id}`);
      requireValue(Array.isArray(item.approved_targets) && item.targets.every(t => item.approved_targets.includes(t)), `Target rights not approved: ${item.id}`);
    }
  }
}

export function validateBatch(batch) {
  requireValue(batch.schema_version === 1 && Array.isArray(batch.files) && batch.files.length > 0, "Invalid intake batch");
  const names = new Set();
  for (const file of batch.files) {
    requireValue(typeof file.name === "string" && !names.has(file.name), "Duplicate or missing intake name");
    names.add(file.name);
    requireValue(hash(file.sha256) && Number.isSafeInteger(file.bytes) && file.bytes >= 0, "Missing intake hash/size");
    for (const member of file.members ?? []) requireValue(hash(member.sha256), "Missing member hash");
  }
  for (const file of batch.files) if (file.duplicate_of) requireValue(batch.files.some(other => other.name === file.duplicate_of && other.sha256 === file.sha256), "Invalid duplicate relationship");
}

export function main() {
  validateAssets(load("asset-plan.json"));
  const batches = readdirSync(directory).filter(name => /^intake-batch-.*\.json$/.test(name));
  requireValue(batches.length > 0, "No intake batches");
  for (const name of batches) validateBatch(load(name));
  console.log(`Production metadata valid: ${batches.length} intake batch(es); candidates remain separate from accepted assets.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
