"""Inventory a large asset archive without extracting it.

Run on the workstation:
    python -I zip_inventory.py "LIKENESS THE GAME ASSETS.zip" zipinv-assets.json

Hashes the archive (SHA-256) and lists members from the zip directory only: nothing is
extracted, opened or executed. macOS metadata members (__MACOSX/, ._*) are counted
separately so the content counts are honest. Refuses to overwrite its output file.
"""
import argparse
import hashlib
import json
import os
import zipfile
from collections import Counter
from pathlib import PurePosixPath

ENGINE_OR_3D = {".uasset", ".umap", ".uproject", ".fbx", ".obj", ".abc", ".glb", ".gltf", ".usd", ".usdz", ".blend"}


def is_macos_metadata(name):
    return name.startswith("__MACOSX/") or PurePosixPath(name).name.startswith("._")


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def inventory(path):
    with zipfile.ZipFile(path) as archive:
        files = [info for info in archive.infolist() if not info.is_dir()]
    content = [info for info in files if not is_macos_metadata(info.filename)]
    extensions = Counter(PurePosixPath(info.filename).suffix.lower() or "(none)" for info in content)
    return {
        "archive_bytes": os.path.getsize(path),
        "sha256": sha256(path),
        "members_total": len(files),
        "members_macos_metadata": len(files) - len(content),
        "members_content": len(content),
        "content_uncompressed_bytes": sum(info.file_size for info in content),
        "content_by_extension": dict(extensions.most_common()),
        "contains_engine_or_3d_files": any(ext in ENGINE_OR_3D for ext in extensions),
        "names": sorted(info.filename for info in content),
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("archive")
    parser.add_argument("output")
    args = parser.parse_args(argv)
    result = inventory(args.archive)
    with open(args.output, "x", encoding="utf-8") as handle:
        json.dump(result, handle, indent=1)
    print(json.dumps({key: value for key, value in result.items() if key != "names"}, indent=1))


if __name__ == "__main__":
    main()
