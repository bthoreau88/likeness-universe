import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";

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

export function validateSources(index, batches) {
  requireValue(index.schema_version === 1 && Array.isArray(index.sources), "Invalid prompt source index");
  const files = batches.flatMap(batch => batch.files);
  const ids = new Set();
  for (const source of index.sources) {
    requireValue(typeof source.id === "string" && !ids.has(source.id), "Duplicate or missing prompt source ID");
    ids.add(source.id);
    requireValue(files.some(file => file.name === source.file && file.sha256 === source.sha256), "Prompt source is not tied to inventoried bytes");
    requireValue(["core", "alternate_eden"].includes(source.family), "Invalid source family");
    requireValue(source.adoption === "reference_only" && source.auto_import === false, "References cannot silently become runtime content");
    requireValue(Number.isSafeInteger(source.page_count) && source.page_count > 0 && Array.isArray(source.sections), "Invalid source pagination");
    const sections = new Set();
    for (const section of source.sections) {
      requireValue(typeof section.id === "string" && !sections.has(section.id), "Duplicate or missing section ID");
      sections.add(section.id);
      requireValue(Array.isArray(section.pages) && section.pages.length === 2 && section.pages.every(Number.isSafeInteger), "Invalid section pages");
      const [start, end] = section.pages;
      requireValue(start >= 1 && end >= start && end <= source.page_count, "Section pages outside source PDF");
    }
  }
  for (const source of index.sources) {
    if (source.declared_source_edition) requireValue(index.sources.some(parent => parent.id === source.declared_source_edition && parent.id !== source.id && parent.family === source.family), "Invalid source-edition relationship");
  }
}

export function main() {
  validateAssets(load("asset-plan.json"));
  const batches = readdirSync(directory).filter(name => /^intake-batch-.*\.json$/.test(name));
  requireValue(batches.length > 0, "No intake batches");
  const batchData = batches.map(name => load(name));
  for (const batch of batchData) {
    validateBatch(batch);
    for (const previous of batch.previous_batches ?? []) {
      requireValue(batches.includes(previous.name), "Previous intake receipt is missing");
      const sha = createHash("sha256").update(readFileSync(path.join(directory, previous.name))).digest("hex");
      requireValue(sha === previous.sha256, "Previous intake receipt changed after reference");
    }
  }
  validateSources(load("prompt-source-index.json"), batchData);
  console.log(`Production metadata valid: ${batches.length} intake batch(es); candidates remain separate from accepted assets.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
