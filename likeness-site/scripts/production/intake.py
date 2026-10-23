"""Inventory uploads without extraction/execution; output is create-only metadata."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import stat
import zipfile

MAX_MEMBER_BYTES = 64 * 1024 * 1024
MAX_ARCHIVE_BYTES = 256 * 1024 * 1024
MAX_MEMBERS = 10000


def digest(stream):
    value = hashlib.sha256()
    for chunk in iter(lambda: stream.read(1024 * 1024), b""):
        value.update(chunk)
    return value.hexdigest()


def inventory(folder, previous_batches=()):
    records = []
    seen = {}
    previous_pairs = set()
    history = {}
    previous_refs = []
    skipped = []
    for receipt in previous_batches:
        data = json.loads(receipt.read_text(encoding='utf-8'))
        if data.get('schema_version') != 1 or not isinstance(data.get('files'), list):
            raise ValueError(f'Unsupported previous batch: {receipt.name}')
        with receipt.open('rb') as stream:
            previous_refs.append({'name': receipt.name, 'sha256': digest(stream)})
        for item in data['files']:
            previous_pairs.add((item['name'], item['sha256']))
            history.setdefault(item['sha256'], []).append(receipt.name + '::' + item['name'])
            for member in item.get('members', []):
                history.setdefault(member['sha256'], []).append(receipt.name + '::' + item['name'] + '::' + member['name'])
    # Deliberately shallow: a missing HTML companion directory is not source code.
    for path in sorted(folder.iterdir()):
        if path.is_symlink() or not path.is_file():
            continue
        with path.open('rb') as stream:
            sha = digest(stream)
        if (path.name, sha) in previous_pairs:
            skipped.append({'name': path.name, 'sha256': sha})
            continue
        item = {"name": path.name, "bytes": path.stat().st_size, "sha256": sha,
                "status": "pending_reconciliation", "duplicate_of": seen.get(sha)}
        seen.setdefault(sha, path.name)
        if path.suffix.lower() == '.zip':
            members = []
            with zipfile.ZipFile(path) as archive:
                infos = archive.infolist()
                if len(infos) > MAX_MEMBERS:
                    raise ValueError('Archive has too many members')
                total = 0
                for info in infos:
                    name = info.filename.replace('\\', '/')
                    parts = PurePosixPath(name).parts
                    if name.startswith('/') or '..' in parts or (parts and ':' in parts[0]):
                        raise ValueError(f'Unsafe archive path: {name}')
                    if stat.S_ISLNK(info.external_attr >> 16):
                        raise ValueError(f'Archive symlink: {name}')
                    if info.is_dir():
                        continue
                    total += info.file_size
                    if info.file_size > MAX_MEMBER_BYTES or total > MAX_ARCHIVE_BYTES:
                        raise ValueError('Archive exceeds intake size budget')
                    with archive.open(info) as stream:
                        member_sha = digest(stream)
                    members.append({"name": name, "bytes": info.file_size, "sha256": member_sha})
            item['members'] = members
        records.append(item)
    # Cross-check loose files against archive members without unpacking them.
    by_hash = {}
    for item in records:
        by_hash.setdefault(item['sha256'], []).append(item['name'])
        for member in item.get('members', []):
            by_hash.setdefault(member['sha256'], []).append(item['name'] + '::' + member['name'])
    # Previous batches stay immutable. Only groups touching this new batch appear.
    groups = [refs + history.get(sha, []) for sha, refs in by_hash.items()
              if len(refs) + len(history.get(sha, [])) > 1]
    result = {"schema_version": 1, "batch_status": "open_more_uploads_expected",
              "files": records, "duplicate_groups": groups}
    if previous_refs:
        result.update(previous_batches=previous_refs, skipped_previous=skipped)
    return result


def write_inventory(folder, output, previous_batches=()):
    # Compute everything before writing; never overwrite an earlier intake receipt.
    result = inventory(folder, previous_batches)
    with output.open('x', encoding='utf-8') as stream:
        json.dump(result, stream, indent=2, ensure_ascii=False)
        stream.write('\n')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--previous-batch', type=Path, action='append', default=[],
                        help='Skip unchanged name/hash pairs; repeat for each earlier batch.')
    args = parser.parse_args()
    result = write_inventory(args.folder, args.output, args.previous_batch)
    print(f"Inventoried {len(result['files'])} files; no content extracted or executed.")
