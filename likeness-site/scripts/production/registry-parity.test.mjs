import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, checkEntityIds, parseRowStructs, checkRowStructs, checkRoomStates, runParity, STRUCT_SOURCES } from "./registry-parity.mjs";

const canonFrom = tables => Object.fromEntries(Object.entries(tables).map(([file, text]) => {
  const rows = parseCsv(text);
  return [file, { header: rows[0], rows: rows.slice(1), ids: new Set(rows.slice(1).map(r => r[0])) }];
}));

test("parses quoted CSV fields containing commas and quotes", () => {
  const rows = parseCsv('id,qc\r\nPROP_A_001,"old brass, not ""gold"""\n');
  assert.deepEqual(rows, [["id", "qc"], ["PROP_A_001", 'old brass, not "gold"']]);
});

test("flags a site ID that canon does not define, ignores web-only domains", () => {
  const canon = canonFrom({ "character_registry.csv": "character_id,name\nCHR_THOREAU_001,THOREAU\n", "asset_manifest.csv": "asset_id\n", "level_registry.csv": "level_id\n", "narrative_beats.csv": "beat_id\n", "mechanics_registry.csv": "mechanic_id\n" });
  assert.deepEqual(checkEntityIds(["CHR_THOREAU_001", "WORK_TAPE_03"], canon, "site"), []);
  assert.equal(checkEntityIds(["THOREAU", "CHR_DRYA_001"], canon, "site").length, 1);
});

test("flags a row struct whose properties drift from the CSV header", () => {
  const header = "struct FAssetManifestRow : public FTableRowBase\n{\n\tGENERATED_BODY()\n\tUPROPERTY()\n\tFString name;\n\tUPROPERTY()\n\tFString qc_notes;\n};";
  const structs = parseRowStructs(header);
  assert.deepEqual(structs.AssetManifestRow, ["name", "qc_notes"]);
  const tables = Object.fromEntries(Object.values(STRUCT_SOURCES).map(f => [f, "id,x\n"]));
  tables["asset_manifest.csv"] = "asset_id,name,qc_notes,inspect_text\n";
  const errors = checkRowStructs(structs, canonFrom(tables));
  assert.ok(errors.some(e => e.includes("FAssetManifestRow") && e.includes("inspect_text")));
});

test("flags room states missing from the engine enum", () => {
  const canon = canonFrom({ "narrative_beats.csv": "beat_id,resulting_room_state\nBEAT_A,STATE_02_MIRROR_LAG\nBEAT_B,STATE_09_NEW\n" });
  const header = "enum class EOVSRoomState : uint8 { STATE_00_NORMAL, STATE_02_MIRROR_LAG };";
  const errors = checkRoomStates(header, canon);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /STATE_09_NEW/);
});

test("current repository passes parity", () => {
  const { errors } = runParity();
  assert.deepEqual(errors, []);
});
