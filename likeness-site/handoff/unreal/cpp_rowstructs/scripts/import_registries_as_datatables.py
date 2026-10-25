# import_registries_as_datatables.py
# Run INSIDE the UE editor (MCP execute_python_code or the Python console) AFTER the
# LikenessTheGame C++ module is built, so unreal.CharacterRow et al. exist.
#
# Creates/refreshes one DataTable per canonical registry at /Game/OVS_LIKENESS/09_Data,
# bound to its native row struct. Row Name = the CSV's first column (the canonical ID).
#
# Why not AssetImportTask: the CSV importer only treats the first column as the row key
# when its header is literally "Name". Ours are character_id / asset_id / ..., so
# import_asset_tasks returns no objects and creates nothing (observed on UE 5.8).
# This version creates the asset with the struct bound, then fills it from the CSV text
# with the first header renamed to "Name" in memory. The CSV files are never modified.
#
# Re-running is safe: an existing table is refilled in place (no delete, which triggers
# a slow reference scan). Single source of truth: C:/OVS/LIKENESS_THE_GAME/data/*.csv

import csv
import io

import unreal

CSV_DIR = "C:/OVS/LIKENESS_THE_GAME/data/"
DEST = "/Game/OVS_LIKENESS/09_Data"

# (csv filename, DataTable asset name, native row struct python type)
MAPPING = [
    ("character_registry.csv",               "DT_CharacterRegistry", unreal.CharacterRow),
    ("level_registry.csv",                   "DT_LevelRegistry",     unreal.LevelRow),
    ("asset_manifest.csv",                   "DT_AssetManifest",     unreal.AssetManifestRow),
    ("mechanics_registry.csv",               "DT_MechanicsRegistry", unreal.MechanicRow),
    ("narrative_beats.csv",                  "DT_NarrativeBeats",    unreal.NarrativeBeatRow),
    ("prompt_registry.csv",                  "DT_PromptRegistry",    unreal.PromptRow),
    ("expansion_registry.csv",               "DT_ExpansionRegistry", unreal.ExpansionRow),
    ("blender_asset_workflow_registry.csv",  "DT_BlenderWorkflow",   unreal.BlenderWorkflowRow),
    ("milestone_01_task_board.csv",          "DT_Milestone01Tasks",  unreal.MilestoneTaskRow),
]

eal = unreal.EditorAssetLibrary
asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
if not eal.does_directory_exist(DEST):
    eal.make_directory(DEST)


def csv_for_unreal(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    if not rows:
        return ""
    rows[0][0] = "Name"  # UE row-key convention; file on disk is untouched
    buf = io.StringIO()
    csv.writer(buf).writerows(rows)
    return buf.getvalue()


results = []
for csv_file, dt_name, row_type in MAPPING:
    full = DEST + "/" + dt_name
    if eal.does_asset_exist(full):
        dt = eal.load_asset(full)
    else:
        factory = unreal.DataTableFactory()
        factory.set_editor_property("struct", row_type.static_struct())
        dt = asset_tools.create_asset(dt_name, DEST, unreal.DataTable, factory)
    if dt is None:
        results.append((dt_name, "FAIL", 0, "could not create or load asset"))
        continue
    ok = unreal.DataTableFunctionLibrary.fill_data_table_from_csv_string(dt, csv_for_unreal(CSV_DIR + csv_file))
    eal.save_asset(full)
    names = unreal.DataTableFunctionLibrary.get_data_table_row_names(dt)
    status = "OK" if (ok and len(names) > 0) else "WARN"
    results.append((dt_name, status, len(names), str(names[0]) if names else "none"))

print("=== DataTable import results ===")
for name, status, rows, first in results:
    print("{0:<24} {1:<5} rows={2:<3} first_row={3}".format(name, status, rows, first))
print("Done. Re-run after any CSV edit; tables refill in place.")
