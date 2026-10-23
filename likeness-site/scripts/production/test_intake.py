import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('intake', Path(__file__).with_name('intake.py'))
intake = importlib.util.module_from_spec(spec)
spec.loader.exec_module(intake)


class IntakeTests(unittest.TestCase):
    def test_cross_archive_duplicates_and_no_extraction(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / 'loose.txt').write_text('evidence')
            with zipfile.ZipFile(root / 'bundle.zip', 'w') as archive:
                archive.writestr('nested/source.txt', 'evidence')
            before = sorted(p.name for p in root.iterdir())
            result = intake.inventory(root)
            self.assertEqual(sorted(p.name for p in root.iterdir()), before)
            self.assertEqual(len(result['duplicate_groups']), 1)
            self.assertEqual(len(result['files']), 2)

    def test_never_overwrite_receipt(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            output = root / 'batch.json'
            output.write_text('preserve')
            with self.assertRaises(FileExistsError):
                intake.write_inventory(root, output)
            self.assertEqual(output.read_text(), 'preserve')

    def test_unsafe_archive_paths_rejected(self):
        for name in ['../escape', '/absolute', 'C:/drive', '..\\escape']:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                with zipfile.ZipFile(root / 'unsafe.zip', 'w') as archive:
                    archive.writestr(name, 'bad')
                with self.assertRaises(ValueError):
                    intake.inventory(root)

    def test_budget_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            with zipfile.ZipFile(root / 'large.zip', 'w') as archive:
                archive.writestr('asset', 'x' * 100)
            original = intake.MAX_MEMBER_BYTES
            try:
                intake.MAX_MEMBER_BYTES = 10
                with self.assertRaises(ValueError):
                    intake.inventory(root)
            finally:
                intake.MAX_MEMBER_BYTES = original


if __name__ == '__main__':
    unittest.main()
