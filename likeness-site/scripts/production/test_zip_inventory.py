import hashlib
import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from zip_inventory import inventory, main  # noqa: E402


class ZipInventoryTest(unittest.TestCase):
    def build(self, root):
        path = Path(root, "assets.zip")
        with zipfile.ZipFile(path, "w") as archive:
            archive.writestr("ASSETS/room14_cutaway.PNG", b"png")
            archive.writestr("ASSETS/clip.mov", b"mov")
            archive.writestr("__MACOSX/ASSETS/._room14_cutaway.PNG", b"meta")
            archive.writestr("ASSETS/empty/", b"")
        return path

    def test_counts_content_separately_from_macos_metadata(self):
        with tempfile.TemporaryDirectory() as root:
            path = self.build(root)
            result = inventory(path)
            self.assertEqual(result["members_total"], 3)
            self.assertEqual(result["members_macos_metadata"], 1)
            self.assertEqual(result["content_by_extension"], {".png": 1, ".mov": 1})
            self.assertFalse(result["contains_engine_or_3d_files"])
            self.assertEqual(result["sha256"], hashlib.sha256(path.read_bytes()).hexdigest())
            self.assertFalse(Path(root, "ASSETS").exists())

    def test_refuses_to_overwrite_output(self):
        with tempfile.TemporaryDirectory() as root:
            path = self.build(root)
            out = Path(root, "inv.json")
            main([str(path), str(out)])
            self.assertEqual(json.loads(out.read_text())["members_content"], 2)
            with self.assertRaises(FileExistsError):
                main([str(path), str(out)])


if __name__ == "__main__":
    unittest.main()
