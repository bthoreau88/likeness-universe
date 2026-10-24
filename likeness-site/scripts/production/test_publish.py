import importlib.util
from pathlib import Path
import unittest
import tempfile

spec = importlib.util.spec_from_file_location('publish', Path(__file__).with_name('publish.py'))
publisher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publisher)


class PublishGuardTests(unittest.TestCase):
    def test_transient_copy_is_not_published(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            output = root / 'out'
            (output / 'subjects').mkdir(parents=True)
            (output / 'subjects' / 'portrait.png').write_bytes(b'approved image')
            (output / 'subjects' / '.portrait.png.Abc123').write_bytes(b'partial copy')
            (output / '.nojekyll').touch()
            omitted = publisher.copy_export(output, root / 'published', {'subjects/portrait.png'})
            self.assertEqual(omitted, ['subjects/.portrait.png.Abc123'])
            self.assertFalse((root / 'published/subjects/.portrait.png.Abc123').exists())
            self.assertEqual((root / 'published/subjects/portrait.png').read_bytes(), b'approved image')
            self.assertTrue((root / 'published/.nojekyll').exists())

    def test_tracked_asset_with_similar_name_is_preserved(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            output = root / 'out'
            output.mkdir()
            (output / '.intentional.Abc123').write_bytes(b'tracked source')
            omitted = publisher.copy_export(output, root / 'published', {'.intentional.Abc123'})
            self.assertEqual(omitted, [])
            self.assertEqual((root / 'published/.intentional.Abc123').read_bytes(), b'tracked source')

    def test_unchanged_tips(self):
        publisher.assert_tips({f'refs/heads/{publisher.SOURCE}': 'a', 'refs/heads/gh-pages': 'b'}, 'a', 'b')

    def test_other_agent_published(self):
        with self.assertRaises(RuntimeError):
            publisher.assert_tips({f'refs/heads/{publisher.SOURCE}': 'a', 'refs/heads/gh-pages': 'new'}, 'a', 'b')

    def test_new_source_requires_rebuild(self):
        with self.assertRaises(RuntimeError):
            publisher.assert_tips({f'refs/heads/{publisher.SOURCE}': 'new', 'refs/heads/gh-pages': 'b'}, 'a', 'b')


if __name__ == '__main__':
    unittest.main()
