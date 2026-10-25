import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from legacy_inventory import inventory  # noqa: E402


def make(root, rel, data=b"x"):
    path = Path(root, rel)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


class LegacyInventoryTest(unittest.TestCase):
    def build_tree(self, root):
        make(root, "LikenessOld/LikenessOld.uproject", json.dumps({"EngineAssociation": "4.27", "Plugins": [{"Name": "Paper2D", "Enabled": True}]}).encode())
        make(root, "LikenessOld/Content/Room/SM_Bed.uasset", b"1234")
        make(root, "LikenessOld/Content/Room/M_Carpet.uasset", b"12")
        make(root, "LikenessOld/Content/Maps/Room14.umap", b"123")
        make(root, "LikenessOld/Content/Raw/bed_highpoly.fbx", b"12345")
        make(root, "LikenessOld/Source/LikenessOld/Thing.cpp")
        make(root, "LikenessOld/Intermediate/junk.uasset", b"999999")
        make(root, "LikenessOld/Saved/Autosaves/auto.umap", b"999999")
        make(root, "Likeness58/Likeness58.uproject", json.dumps({"EngineAssociation": "5.8"}).encode())
        make(root, "Likeness58/Content/BP_Door.uasset")
        make(root, "loose_exports/thoreau_ref.png", b"img")

    def test_inventory_counts_and_skips_generated_folders(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.build_tree(tmp)
            data = inventory(tmp)
            old = next(p for p in data["projects"] if p["project"] == "LikenessOld/LikenessOld.uproject")
            self.assertEqual(old["engine"], "4.27")
            self.assertFalse(old["engine_matches_target"])
            self.assertEqual(old["uasset_count"], 3)  # Intermediate and Saved skipped
            self.assertEqual(old["maps"], ["Content/Maps/Room14.umap"])
            self.assertTrue(old["has_cpp_source"])
            self.assertEqual(old["content_folders"]["Room"]["assets"], 2)
            self.assertEqual(old["asset_prefixes"], {"SM_": 1, "M_": 1, "(none)": 1})
            self.assertEqual(old["source_files"]["mesh"]["files"], 1)
            self.assertEqual(old["plugins_enabled"], ["Paper2D"])
            new = next(p for p in data["projects"] if p["project"] == "Likeness58/Likeness58.uproject")
            self.assertTrue(new["engine_matches_target"])
            self.assertEqual(data["loose_files_outside_projects"]["source_files"]["texture"]["files"], 1)

    def test_output_paths_are_relative(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.build_tree(tmp)
            text = json.dumps(inventory(tmp))
            self.assertNotIn(str(Path(tmp).resolve()), text)

    def test_cli_refuses_to_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.build_tree(tmp)
            out = Path(tmp, "out.json")
            out.write_text("{}")
            script = Path(__file__).resolve().parent / "legacy_inventory.py"
            result = subprocess.run([sys.executable, "-I", str(script), tmp, str(out)], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(out.read_text(), "{}")


if __name__ == "__main__":
    unittest.main()
