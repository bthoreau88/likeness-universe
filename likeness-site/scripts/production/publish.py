"""Rebuild current merged source and publish with ordinary fast-forward Git push."""
import argparse
import json
import os
import re
from pathlib import Path
import shutil
import subprocess
import tempfile

SITE = Path(__file__).resolve().parents[2]
REPO = SITE.parent
SOURCE = 'claude/dreamy-hawking-VcoBe'


def run(*args, cwd=REPO, capture=True, env=None):
    result = subprocess.run(args, cwd=cwd, check=True, text=True,
                            stdout=subprocess.PIPE if capture else None, env=env)
    return result.stdout.strip() if capture else None


def tips():
    refs = run('git', 'ls-remote', 'origin', f'refs/heads/{SOURCE}', 'refs/heads/gh-pages')
    return {line.split()[1]: line.split()[0] for line in refs.splitlines()}


def assert_tips(observed, source, pages):
    if observed.get(f'refs/heads/{SOURCE}') != source or observed.get('refs/heads/gh-pages') != pages:
        raise RuntimeError('Source or Pages moved. Fetch/reconcile and rebuild; do not reuse this export.')


def copy_export(output, destination, tracked_public):
    """Omit observed temporary copy files, preserving explicitly tracked assets."""
    omitted = []

    def ignore(directory, names):
        excluded = []
        for name in names:
            relative = (Path(directory) / name).relative_to(output).as_posix()
            if ((Path(directory) / name).is_file()
                    and re.fullmatch(r'\..+\.[A-Za-z0-9]{6}', name)
                    and relative not in tracked_public):
                excluded.append(name)
                omitted.append(relative)
        return excluded

    shutil.copytree(output, destination, dirs_exist_ok=True, ignore=ignore)
    return omitted


def publish(source, pages):
    if run('git', 'status', '--porcelain'):
        raise RuntimeError('Publisher requires a clean repository.')
    assert_tips(tips(), source, pages)
    run('git', 'fetch', 'origin', SOURCE, 'gh-pages', capture=False)
    if run('git', 'rev-parse', 'HEAD') != source or run('git', 'rev-parse', f'origin/{SOURCE}') != source:
        raise RuntimeError('Check out the exact current merged canonical source before publishing.')
    env = {**os.environ, 'NEXT_PUBLIC_BASE_PATH': '/likeness-universe'}
    for command in [('npm', 'ci'), ('npm', 'run', 'validate:production'), ('npm', 'run', 'test:production'), ('npm', 'run', 'lint'), ('npm', 'run', 'build')]:
        run(*command, cwd=SITE, capture=False, env=env)
    output = SITE / 'out'
    # All existing app routes must survive, not merely the home page.
    for page in (SITE / 'src/app').rglob('page.tsx'):
        relative = page.parent.relative_to(SITE / 'src/app')
        if not (output / relative / 'index.html').is_file():
            raise RuntimeError(f'Missing static route: {relative}')
    if not (output / '_next').is_dir() or '/likeness-universe/_next/' not in (output / 'index.html').read_text():
        raise RuntimeError('Export is missing assets or the required base path.')
    (output / '.nojekyll').touch()
    (output / 'production-release.json').write_text(json.dumps({'source_sha': source, 'previous_pages_sha': pages, 'base_path': '/likeness-universe'}, indent=2) + '\n')
    assert_tips(tips(), source, pages)
    with tempfile.TemporaryDirectory(prefix='likeness-publish-') as temp:
        worktree = Path(temp) / 'pages'
        run('git', 'worktree', 'add', '--detach', str(worktree), pages, capture=False)
        try:
            cname = (worktree / 'CNAME').read_bytes() if (worktree / 'CNAME').is_file() else None
            for child in worktree.iterdir():
                if child.name == '.git':
                    continue
                if child.is_dir() and not child.is_symlink():
                    shutil.rmtree(child)
                else:
                    child.unlink()
            tracked = run('git', 'ls-files', '-z', '--', 'likeness-site/public')
            public_prefix = 'likeness-site/public/'
            tracked_public = {name[len(public_prefix):] for name in tracked.split('\0')
                              if name.startswith(public_prefix)}
            omitted = copy_export(output, worktree, tracked_public)
            if omitted:
                print(f'Excluded {len(omitted)} untracked temporary export copy artifact(s).')
            if cname is not None and not (worktree / 'CNAME').exists():
                (worktree / 'CNAME').write_bytes(cname)
            run('git', 'add', '-A', cwd=worktree)
            run('git', 'commit', '-m', f'Publish: production pipeline from {source}', cwd=worktree, capture=False)
            assert_tips(tips(), source, pages)
            if run('git', 'status', '--porcelain') or run('git', 'rev-parse', 'HEAD') != source:
                raise RuntimeError('Local source changed during build.')
            published = run('git', 'rev-parse', 'HEAD', cwd=worktree)
            run('git', 'push', 'origin', 'HEAD:refs/heads/gh-pages', cwd=worktree, capture=False)
            print(json.dumps({'source_sha': source, 'pages_sha': published, 'pages_run_status': 'verify_on_github'}, indent=2))
        finally:
            run('git', 'worktree', 'remove', '--force', str(worktree), capture=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--check', action='store_true')
    mode.add_argument('--publish', action='store_true')
    parser.add_argument('--expected-source')
    parser.add_argument('--expected-pages')
    args = parser.parse_args()
    if args.check:
        print(json.dumps(tips(), indent=2))
    else:
        if not args.expected_source or not args.expected_pages:
            parser.error('--publish requires both reviewed expected SHAs')
        publish(args.expected_source, args.expected_pages)
