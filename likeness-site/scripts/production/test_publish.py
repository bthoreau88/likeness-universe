import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('publish', Path(__file__).with_name('publish.py'))
publisher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publisher)


class PublishGuardTests(unittest.TestCase):
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
