"""Build the original PROP_TAPE_001 proxy and its 10-second inspect proof (GAME_LANE GL-18).

Run headless with the workstation Blender (5.1.2):
    blender -b --factory-startup --python build_PROP_TAPE_001_proxy_v001.py -- <new-output-dir>

Starts from an empty file: no Room 14 file, Unreal project or third-party mesh is opened.
Writes the .blend, five 480p review stills and a receipt JSON into the output directory,
which must not exist yet. Asset class A (proxy): original OVS geometry that proves the
inspect interaction. It is not final art and it is not an Unreal interaction.
"""
import hashlib
import json
import math
import os
import sys

import bpy  # first: the standalone bpy module only provides bmesh after it loads
import bmesh

ASSET_ID = "PROP_TAPE_001"
PROXY_NAME = "PROP_TAPE_001_PROXY"
PIVOT_NAME = "PROP_TAPE_001_INSPECT_PIVOT"
SCENE_NAME = "INSPECT_STAGE"
# Compact cassette shell, nominal outer size. From reference knowledge of IEC 60094-7;
# not yet checked against a copy of the standard (recorded as such in the receipt).
NOMINAL_MM = (100.4, 63.8, 12.0)
TOLERANCE_MM = 0.1
FPS = 24
FRAME_END = 240  # 10.0 s
STILLS = (1, 60, 120, 180, 240)
RESOLUTION = (854, 480)

# (frame, pivot location in m, pivot rotation in degrees XYZ). Rest -> lift and face the
# camera -> 360 deg about the long (X) axis -> 180 deg to the back -> return to rest.
KEYS = (
    (1, (0.0, 0.0, 0.006), (0, 0, 0)),
    (60, (0.0, -0.08, 0.16), (90, 0, 0)),
    (150, (0.0, -0.08, 0.16), (450, 0, 0)),
    (180, (0.0, -0.08, 0.16), (450, 0, 180)),
    (240, (0.0, 0.0, 0.006), (360, 0, 360)),
)


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def node_material(name, rgb, roughness):
    mat = bpy.data.materials.new(name)
    if mat.node_tree is None:  # older versions create materials without nodes
        mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    mat.diffuse_color = (*rgb, 1.0)
    return mat


def build_proxy_mesh():
    sx, sy, sz = (d / 1000.0 for d in NOMINAL_MM)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for vert in bm.verts:
        vert.co.x *= sx
        vert.co.y *= sy
        vert.co.z *= sz
    bm.normal_update()
    # A shallow label recess on +Z makes the orientation readable while it rotates.
    top = max(bm.faces, key=lambda face: face.calc_center_median().z)
    bmesh.ops.inset_individual(bm, faces=[top], thickness=0.008, depth=-0.0015)
    mesh = bpy.data.meshes.new(PROXY_NAME)
    bm.to_mesh(mesh)
    bm.free()
    return mesh


def look_at(obj, target):
    direction = (target - obj.location).normalized()
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def pivot_fcurves(pivot):
    anim = pivot.animation_data
    if anim is None or anim.action is None:
        return []
    action = anim.action
    if hasattr(action, "fcurves"):  # Blender 4.x legacy API
        return list(action.fcurves)
    from bpy_extras import anim_utils  # Blender 4.4+ slotted actions
    channelbag = anim_utils.action_get_channelbag_for_slot(action, anim.action_slot)
    return list(channelbag.fcurves) if channelbag else []


def build(out_dir):
    from mathutils import Vector

    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.name = SCENE_NAME
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    scene.render.fps = FPS
    scene.frame_start, scene.frame_end = 1, FRAME_END

    proxy = bpy.data.objects.new(PROXY_NAME, build_proxy_mesh())
    proxy.data.materials.append(node_material("M_PROP_TAPE_001_PROXY", (0.55, 0.55, 0.55), 0.6))
    proxy["canon_id"] = ASSET_ID
    proxy["ovs_asset_class"] = "A_PROXY"
    proxy["rights"] = "ORIGINAL_OVS"
    proxy["nominal_mm"] = list(NOMINAL_MM)

    pivot = bpy.data.objects.new(PIVOT_NAME, None)
    pivot.empty_display_type = "ARROWS"
    pivot.empty_display_size = 0.05
    proxy.parent = pivot

    bpy.ops.mesh.primitive_plane_add(size=3.0, location=(0.0, 0.0, 0.0))
    table = bpy.context.active_object
    table.name = "INSPECT_TABLE"
    table.data.materials.append(node_material("M_INSPECT_TABLE", (0.18, 0.18, 0.18), 0.8))

    for obj in (pivot, proxy):
        scene.collection.objects.link(obj)

    camera = bpy.data.objects.new("INSPECT_CAMERA", bpy.data.cameras.new("INSPECT_CAMERA"))
    camera.data.lens = 50.0
    camera.location = (0.0, -0.75, 0.22)
    scene.collection.objects.link(camera)
    look_at(camera, Vector((0.0, -0.04, 0.095)))
    scene.camera = camera

    sun = bpy.data.objects.new("INSPECT_KEY", bpy.data.lights.new("INSPECT_KEY", "SUN"))
    sun.data.energy = 3.0
    sun.rotation_euler = (math.radians(50), 0.0, math.radians(30))
    scene.collection.objects.link(sun)

    world = bpy.data.worlds.new("INSPECT_WORLD")
    if world.node_tree is None:
        world.use_nodes = True
    background = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    background.inputs["Color"].default_value = (0.05, 0.05, 0.05, 1.0)
    background.inputs["Strength"].default_value = 1.0
    scene.world = world

    for frame, location, rotation in KEYS:
        pivot.location = location
        pivot.rotation_euler = tuple(math.radians(a) for a in rotation)
        pivot.keyframe_insert("location", frame=frame)
        pivot.keyframe_insert("rotation_euler", frame=frame)

    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 16
    scene.render.resolution_x, scene.render.resolution_y = RESOLUTION
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"

    blend_path = os.path.join(out_dir, "LKN_PROP_TAPE_001_PROXY_V001.blend")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)

    stills = []
    for frame in STILLS:
        scene.frame_set(frame)
        scene.render.filepath = os.path.join(out_dir, f"PROP_TAPE_001_PROXY_V001_f{frame:03d}.png")
        bpy.ops.render.render(write_still=True)
        stills.append(scene.render.filepath)
    return blend_path, stills


def verify(blend_path):
    bpy.ops.wm.open_mainfile(filepath=blend_path)
    scene = bpy.data.scenes.get(SCENE_NAME)
    proxy = bpy.data.objects.get(PROXY_NAME)
    pivot = bpy.data.objects.get(PIVOT_NAME)
    coords = [v.co for v in proxy.data.vertices]
    bbox_mm = [round((max(c[i] for c in coords) - min(c[i] for c in coords)) * 1000.0, 4) for i in range(3)]
    fcurves = pivot_fcurves(pivot)
    paths = sorted({fc.data_path for fc in fcurves})
    checks = {
        "reopened": scene is not None and proxy is not None and pivot is not None,
        "bbox_within_tolerance": all(abs(m - n) <= TOLERANCE_MM for m, n in zip(bbox_mm, NOMINAL_MM)),
        "scale_applied": tuple(round(s, 6) for s in proxy.scale) == (1.0, 1.0, 1.0),
        "parented_to_pivot": proxy.parent is pivot,
        "editable_fcurves": len(fcurves) >= 6 and paths == ["location", "rotation_euler"]
        and all(len(fc.keyframe_points) == len(KEYS) for fc in fcurves),
        "frame_range": (scene.frame_start, scene.frame_end, scene.render.fps) == (1, FRAME_END, FPS),
        "custom_properties": proxy.get("canon_id") == ASSET_ID and proxy.get("ovs_asset_class") == "A_PROXY"
        and proxy.get("rights") == "ORIGINAL_OVS",
    }
    return {"bbox_mm": bbox_mm, "fcurves": len(fcurves), "fcurve_paths": paths,
            "triangles": sum(len(p.vertices) - 2 for p in proxy.data.polygons), "checks": checks}


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if len(argv) != 1:
        raise SystemExit("usage: blender -b --factory-startup --python <this> -- <new-output-dir>")
    out_dir = os.path.abspath(argv[0])
    os.makedirs(out_dir, exist_ok=False)

    blend_path, stills = build(out_dir)
    result = verify(blend_path)
    receipt = {
        "gate": "GL-18",
        "asset_id": ASSET_ID,
        "asset_class": "A_PROXY",
        "rights": "ORIGINAL_OVS",
        "status": "PASS" if all(result["checks"].values()) else "FAIL",
        "scope": "Blender proof only, not an Unreal interaction",
        "blender_version": bpy.app.version_string,
        "script_sha256": sha256(os.path.abspath(__file__)) if os.path.exists(__file__) else None,
        "nominal_mm": list(NOMINAL_MM),
        "dimension_source": "IEC 60094-7 compact cassette nominal outer size, from reference knowledge; not checked against a copy of the standard",
        "animation": {"fps": FPS, "frames": [1, FRAME_END], "seconds": FRAME_END / FPS,
                      "keys": [{"frame": f, "location_m": list(l), "rotation_deg": list(r)} for f, l, r in KEYS]},
        "outputs": {os.path.basename(p): sha256(p) for p in [blend_path, *stills]},
        **result,
        "not_opened": ["Room 14 .blend files", "Unreal projects", "third-party meshes"],
    }
    receipt_path = os.path.join(out_dir, "PROP_TAPE_001_PROXY_V001_RECEIPT.json")
    with open(receipt_path, "x", encoding="utf-8") as handle:
        json.dump(receipt, handle, indent=2)
    print("RECEIPT=" + receipt_path)
    print("STATUS=" + receipt["status"])
    if receipt["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
