import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('intake', Path(__file__).with_name('intake.py'))
intake = importlib.util.module_from_spec(spec)
spec.loader.exec_module(intake)


class IntakeTests(unittest.TestCase):
    def test_prior_files_skipped_but_same_name_new_revision_included(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            uploads = root / 'uploads'
            uploads.mkdir()
            (uploads / 'keep.txt').write_text('same')
            (uploads / 'revise.txt').write_text('old')
            previous = root / 'batch-001.json'
            intake.write_inventory(uploads, previous)
            before = previous.read_bytes()
            (uploads / 'revise.txt').write_text('new')
            result = intake.inventory(uploads, [previous])
            self.assertEqual([f['name'] for f in result['files']], ['revise.txt'])
            self.assertEqual([f['name'] for f in result['skipped_previous']], ['keep.txt'])
            self.assertEqual(previous.read_bytes(), before)

    def test_renamed_duplicate_keeps_cross_batch_lineage(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            uploads = root / 'uploads'
            uploads.mkdir()
            (uploads / 'original.txt').write_text('same')
            previous = root / 'batch-001.json'
            intake.write_inventory(uploads, previous)
            (uploads / 'renamed.txt').write_text('same')
            result = intake.inventory(uploads, [previous])
            self.assertEqual(len(result['files']), 1)
            self.assertEqual(result['duplicate_groups'], [['renamed.txt', 'batch-001.json::original.txt']])

    def test_invalid_prior_schema_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            previous = root / 'prior.json'
            previous.write_text(json.dumps({'schema_version': 99, 'files': []}))
            with self.assertRaises(ValueError):
                intake.inventory(root, [previous])

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
