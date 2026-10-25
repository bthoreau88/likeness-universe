"""Inventory old Unreal projects and loose asset folders without opening anything.

Run on the workstation, pointed at wherever old versions live:
    python -I legacy_inventory.py "D:\\Old LIKENESS builds" legacy-inventory.json

Reads directory entries and file sizes only: never loads, converts, moves or writes inside
the scanned folders. Paths in the output are relative to the scan root so the summary can
be shared without exposing the machine's folder layout. Heavy generated folders
(Intermediate, DerivedDataCache, Binaries, Saved, .git) are skipped.
"""
import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

SKIP_DIRS = {"intermediate", "deriveddatacache", "binaries", "saved", ".git", ".vs", "__pycache__"}
SOURCE_EXT = {
    ".fbx": "mesh", ".obj": "mesh", ".abc": "mesh", ".glb": "mesh", ".gltf": "mesh", ".usd": "mesh", ".usdz": "mesh",
    ".blend": "blender", ".ma": "maya", ".mb": "maya", ".spp": "painter", ".psd": "image_layered",
    ".png": "texture", ".jpg": "texture", ".jpeg": "texture", ".tga": "texture", ".exr": "texture", ".tif": "texture", ".tiff": "texture", ".hdr": "texture",
    ".wav": "audio", ".mp3": "audio", ".ogg": "audio", ".flac": "audio",
    ".mp4": "video", ".mov": "video",
}
TARGET_ENGINE = "5.8"


def walk(root):
    """Yield (relative posix path, size, mtime) for files under root, skipping generated dirs."""
    stack = [root]
    while stack:
        current = stack.pop()
        try:
            entries = list(os.scandir(current))
        except OSError:
            continue
        for entry in entries:
            if entry.is_symlink():
                continue
            if entry.is_dir(follow_symlinks=False):
                if entry.name.lower() not in SKIP_DIRS:
                    stack.append(entry.path)
            elif entry.is_file(follow_symlinks=False):
                info = entry.stat(follow_symlinks=False)
                rel = PurePosixPath(Path(entry.path).relative_to(root).as_posix())
                yield rel, info.st_size, info.st_mtime


def asset_prefix(stem):
    head = stem.split("_", 1)[0]
    return head + "_" if "_" in stem and head.isalnum() and len(head) <= 5 else "(none)"


def iso(ts):
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d") if ts else None


def inventory(scan_root):
    scan_root = Path(scan_root).resolve()
    files = list(walk(scan_root))
    project_files = sorted(rel for rel, _, _ in files if rel.suffix.lower() == ".uproject")
    project_dirs = [rel.parent for rel in project_files]

    def owner(rel):
        best = None
        for d in project_dirs:
            if d == PurePosixPath(".") or rel.is_relative_to(d):
                if best is None or len(d.parts) > len(best.parts):
                    best = d
        return best

    projects = {}
    for rel in project_files:
        try:
            data = json.loads((scan_root / Path(rel)).read_text(encoding="utf-8-sig"))
        except (OSError, ValueError):
            data = {}
        engine = str(data.get("EngineAssociation", "unknown"))
        projects[rel.parent] = {
            "project": rel.as_posix(),
            "engine": engine,
            "engine_matches_target": engine.startswith(TARGET_ENGINE),
            "modules": [m.get("Name") for m in data.get("Modules", []) if isinstance(m, dict)],
            "plugins_enabled": sorted(p.get("Name") for p in data.get("Plugins", []) if isinstance(p, dict) and p.get("Enabled")),
            "has_cpp_source": False,
            "maps": [],
            "content_folders": {},
            "asset_prefixes": {},
            "uasset_count": 0,
            "content_bytes": 0,
            "source_files": {},
            "latest_change": 0,
        }

    loose = {"source_files": {}, "uasset_count": 0, "latest_change": 0}
    for rel, size, mtime in files:
        parent = owner(rel)
        record = projects.get(parent) if parent is not None else None
        target = record if record is not None else loose
        target["latest_change"] = max(target["latest_change"], mtime)
        ext = rel.suffix.lower()
        inner = rel.relative_to(parent) if record is not None else rel
        if record is not None and inner.parts and inner.parts[0] == "Source" and ext in {".h", ".cpp", ".cs"}:
            record["has_cpp_source"] = True
        if ext in {".uasset", ".umap"}:
            target["uasset_count"] += 1
            if record is not None and inner.parts and inner.parts[0] == "Content":
                folder = inner.parts[1] if len(inner.parts) > 2 else "(root)"
                bucket = record["content_folders"].setdefault(folder, {"assets": 0, "bytes": 0})
                bucket["assets"] += 1
                bucket["bytes"] += size
                record["content_bytes"] += size
                prefix = asset_prefix(rel.stem)
                record["asset_prefixes"][prefix] = record["asset_prefixes"].get(prefix, 0) + 1
                if ext == ".umap":
                    record["maps"].append(inner.as_posix())
        elif ext in SOURCE_EXT:
            kind = SOURCE_EXT[ext]
            bucket = target["source_files"].setdefault(kind, {"files": 0, "bytes": 0, "examples": []})
            bucket["files"] += 1
            bucket["bytes"] += size
            if len(bucket["examples"]) < 5:
                bucket["examples"].append(inner.as_posix())

    result = []
    for record in projects.values():
        record["maps"].sort()
        record["latest_change"] = iso(record["latest_change"])
        record["content_folders"] = dict(sorted(record["content_folders"].items(), key=lambda kv: -kv[1]["bytes"]))
        record["triage"] = "pending"
        result.append(record)
    loose["latest_change"] = iso(loose["latest_change"])
    return {
        "schema_version": 1,
        "scanned": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "target_engine": TARGET_ENGINE,
        "projects": sorted(result, key=lambda r: r["project"]),
        "loose_files_outside_projects": loose,
        "note": "Metadata only. Nothing was opened, converted or modified. Paths are relative to the scan root.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("scan_root")
    parser.add_argument("output")
    args = parser.parse_args()
    output = Path(args.output)
    if output.exists():
        raise SystemExit(f"Refusing to overwrite existing {output}; choose a new filename.")
    data = inventory(args.scan_root)
    output.write_text(json.dumps(data, indent=2), encoding="utf-8")
    for p in data["projects"]:
        mb = p["content_bytes"] / 1e6
        flag = "" if p["engine_matches_target"] else f"  <- engine {p['engine']}, OPEN A COPY ONLY"
        print(f"{p['project']}: {p['uasset_count']} assets, {len(p['maps'])} maps, {mb:.0f} MB content, last change {p['latest_change']}{flag}")
    loose = data["loose_files_outside_projects"]
    kinds = ", ".join(f"{k} {v['files']}" for k, v in loose["source_files"].items()) or "none"
    print(f"Loose files outside projects: {kinds}")
    print(f"Wrote {output}. Nothing in the scanned folders was changed.")


if __name__ == "__main__":
    main()
