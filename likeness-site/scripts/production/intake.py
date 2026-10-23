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


def inventory(folder):
    records = []
    seen = {}
    # Deliberately shallow: a missing HTML companion directory is not source code.
    for path in sorted(folder.iterdir()):
        if path.is_symlink() or not path.is_file():
            continue
        with path.open('rb') as stream:
            sha = digest(stream)
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
    return {"schema_version": 1, "batch_status": "open_more_uploads_expected",
            "files": records, "duplicate_groups": [v for v in by_hash.values() if len(v) > 1]}


def write_inventory(folder, output):
    # Compute everything before writing; never overwrite an earlier intake receipt.
    result = inventory(folder)
    with output.open('x', encoding='utf-8') as stream:
        json.dump(result, stream, indent=2, ensure_ascii=False)
        stream.write('\n')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    result = write_inventory(args.folder, args.output)
    print(f"Inventoried {len(result['files'])} files; no content extracted or executed.")
