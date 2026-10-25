// Cross-checks the three places a LIKENESS ID lives:
//   1. handoff/data/*.csv            — canon (the game imports these as DataTables)
//   2. src/lib/registry.ts           — the companion site
//   3. handoff/unreal/cpp_rowstructs — the C++ the PC compiles (row structs, room states)
// Every costly stall so far was one of these drifting silently. Errors fail CI;
// soft-domain mismatches (EXP_) are reported as warnings.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const DATA = path.join(root, "handoff/data");

// Game-entity prefixes: the site and the asset plan may only use IDs that exist in canon.
export const ENTITY_DOMAINS = {
  CHR_: "character_registry.csv",
  PROP_: "asset_manifest.csv",
  LOC_: "level_registry.csv",
  BEAT_: "narrative_beats.csv",
  MECH_: "mechanics_registry.csv",
};

// Row struct -> CSV it is imported from (mirrors import_registries_as_datatables.py).
export const STRUCT_SOURCES = {
  CharacterRow: "character_registry.csv",
  LevelRow: "level_registry.csv",
  AssetManifestRow: "asset_manifest.csv",
  MechanicRow: "mechanics_registry.csv",
  NarrativeBeatRow: "narrative_beats.csv",
  PromptRow: "prompt_registry.csv",
  ExpansionRow: "expansion_registry.csv",
  BlenderWorkflowRow: "blender_asset_workflow_registry.csv",
  MilestoneTaskRow: "milestone_01_task_board.csv",
};

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some(v => v !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some(v => v !== "")) rows.push(row); }
  return rows;
}

export function loadCanon(dataDir = DATA) {
  const canon = {};
  for (const file of new Set([...Object.values(ENTITY_DOMAINS), ...Object.values(STRUCT_SOURCES)])) {
    const rows = parseCsv(readFileSync(path.join(dataDir, file), "utf8"));
    canon[file] = { header: rows[0], rows: rows.slice(1), ids: new Set(rows.slice(1).map(r => r[0])) };
  }
  return canon;
}

export const webIds = text => [...text.matchAll(/\bid:\s*"([A-Z0-9_]+)"/g)].map(m => m[1]);

export function checkEntityIds(ids, canon, label) {
  const errors = [];
  for (const id of new Set(ids)) {
    const prefix = Object.keys(ENTITY_DOMAINS).find(p => id.startsWith(p));
    if (prefix && !canon[ENTITY_DOMAINS[prefix]].ids.has(id)) {
      errors.push(`${label} uses ${id}, which is not in handoff/data/${ENTITY_DOMAINS[prefix]} (add the canon row first)`);
    }
  }
  return errors;
}

export function parseRowStructs(headerText) {
  const structs = {};
  for (const m of headerText.matchAll(/struct\s+F(\w+)\s*:\s*public\s+FTableRowBase\s*\{([\s\S]*?)\};/g)) {
    structs[m[1]] = [...m[2].matchAll(/^\s*\w+\s+(\w+)\s*;/gm)].map(p => p[1]);
  }
  return structs;
}

export function checkRowStructs(structs, canon) {
  const errors = [];
  for (const [name, file] of Object.entries(STRUCT_SOURCES)) {
    const props = structs[name];
    if (!props) { errors.push(`LikenessRows.h has no F${name} for ${file}`); continue; }
    const columns = canon[file].header.slice(1);
    const missing = columns.filter(c => !props.includes(c));
    const extra = props.filter(p => !columns.includes(p));
    if (missing.length || extra.length) {
      errors.push(`F${name} vs ${file}: missing [${missing.join(", ")}] extra [${extra.join(", ")}] — DataTable import binds columns by name`);
    }
  }
  return errors;
}

export function checkRoomStates(headerText, canon) {
  const enumBody = headerText.match(/enum\s+class\s+EOVSRoomState[^{]*\{([\s\S]*?)\}/);
  if (!enumBody) return ["OVSRoomStateSubsystem.h has no EOVSRoomState enum"];
  const engine = new Set([...enumBody[1].matchAll(/\b(STATE_\d+_[A-Z_]+)\b/g)].map(m => m[1]));
  const beats = canon["narrative_beats.csv"];
  const col = beats.header.indexOf("resulting_room_state");
  const data = new Set(beats.rows.map(r => r[col]).filter(Boolean));
  data.add("STATE_00_NORMAL");
  const errors = [];
  for (const s of data) if (!engine.has(s)) errors.push(`narrative_beats uses ${s}, missing from EOVSRoomState`);
  for (const s of engine) if (!data.has(s)) errors.push(`EOVSRoomState has ${s}, but no beat produces it`);
  return errors;
}

export function runParity(base = root) {
  const canon = loadCanon(path.join(base, "handoff/data"));
  const errors = [];
  const warnings = [];

  const site = webIds(readFileSync(path.join(base, "src/lib/registry.ts"), "utf8"));
  errors.push(...checkEntityIds(site, canon, "src/lib/registry.ts"));

  const plan = JSON.parse(readFileSync(path.join(base, "data/production/asset-plan.json"), "utf8"));
  errors.push(...checkEntityIds(plan.assets.map(a => a.id), canon, "data/production/asset-plan.json"));

  const expCanon = parseCsv(readFileSync(path.join(base, "handoff/data/expansion_registry.csv"), "utf8")).slice(1).map(r => r[0]);
  const expSite = site.filter(id => id.startsWith("EXP_"));
  const siteOnly = expSite.filter(id => !expCanon.includes(id));
  const canonOnly = expCanon.filter(id => !expSite.includes(id));
  if (siteOnly.length) warnings.push(`EXP_ IDs on the site but not in expansion_registry.csv: ${siteOnly.join(", ")}`);
  if (canonOnly.length) warnings.push(`expansion_registry.csv IDs not on the site: ${canonOnly.join(", ")}`);

  const cpp = path.join(base, "handoff/unreal/cpp_rowstructs/Source/LikenessTheGame/Public");
  const rows = path.join(cpp, "LikenessRows.h");
  const state = path.join(cpp, "OVSRoomStateSubsystem.h");
  if (existsSync(rows)) errors.push(...checkRowStructs(parseRowStructs(readFileSync(rows, "utf8")), canon));
  else warnings.push("LikenessRows.h not found; row-struct contract not checked");
  if (existsSync(state)) errors.push(...checkRoomStates(readFileSync(state, "utf8"), canon));
  else warnings.push("OVSRoomStateSubsystem.h not found; room-state contract not checked");

  return { errors, warnings, siteIds: site.length };
}

export function main() {
  const { errors, warnings, siteIds } = runParity();
  for (const w of warnings) console.warn(`warn: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    throw new Error(`Registry parity failed: ${errors.length} error(s)`);
  }
  console.log(`Registry parity valid: ${siteIds} site IDs, row structs and room states match handoff/data.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
