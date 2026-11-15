"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EVIDENCE } from "@/lib/registry";
import { asset } from "@/lib/base";
import { CompanionShell } from "./CompanionShell";

const TONE_COLOR: Record<string, number> = {
  key: 0xa76e37,
  study: 0x6fc6d6,
  tape: 0xa78c5a,
  mirror: 0x8aa0a6,
  door: 0x7f2921,
};

export function Room14() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [webglOk, setWebglOk] = useState(true);
  const selectedEvidence = EVIDENCE.find((e) => e.id === selected) ?? null;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080809);
    scene.fog = new THREE.FogExp2(0x080809, 0.085);

    const camera = new THREE.PerspectiveCamera(
      62,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      // WebGL unavailable (blocked, software-disabled, or unsupported):
      // fall back to the keyboard-accessible evidence index below. Deferred so
      // the update doesn't run synchronously inside the effect body.
      queueMicrotask(() => setWebglOk(false));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    // ---- Room box (inward-facing) ----
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(9, 3.4, 9),
      new THREE.MeshStandardMaterial({
        color: 0x15140f,
        roughness: 0.95,
        metalness: 0,
        side: THREE.BackSide,
      })
    );
    room.position.y = 1.5;
    scene.add(room);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.MeshStandardMaterial({ color: 0x0c0b09, roughness: 1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.2;
    scene.add(floor);

    // ---- Lights ----
    scene.add(new THREE.AmbientLight(0x141a1e, 0.6));
    const lamp = new THREE.PointLight(0xffb066, 9, 16, 2);
    lamp.position.set(-2.4, 2.2, -1.4);
    scene.add(lamp);
    const teal = new THREE.PointLight(0x6fc6d6, 4.5, 14, 2);
    teal.position.set(2.8, 1.4, 2.6);
    scene.add(teal);

    // ---- Inspectable objects ----
    const loader = new THREE.TextureLoader();
    const objects: THREE.Mesh[] = [];
    const count = EVIDENCE.length;

    EVIDENCE.forEach((e, i) => {
      // spread across a front arc
      const angle = -1.0 + (i / (count - 1)) * 2.0; // radians, ~ -57°..+57°
      const radius = 3.4;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius;
      const y = 1.0 + (i % 2 === 0 ? 0.15 : -0.1);

      const baseColor = TONE_COLOR[e.tone ?? "study"] ?? 0x6fc6d6;
      const mat = new THREE.MeshStandardMaterial({
        color: e.image ? 0xffffff : baseColor,
        roughness: 0.8,
        emissive: new THREE.Color(e.image ? 0x000000 : baseColor),
        emissiveIntensity: e.image ? 0 : 0.25,
        transparent: true,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), mat);
      mesh.position.set(x, y, z);
      mesh.lookAt(camera.position);
      mesh.userData = { id: e.id, baseY: y };
      scene.add(mesh);
      objects.push(mesh);

      // thin frame
      const frame = new THREE.Mesh(
        new THREE.PlaneGeometry(1.33, 1.33),
        new THREE.MeshBasicMaterial({ color: 0x6fc6d6, transparent: true, opacity: 0.18 })
      );
      frame.position.copy(mesh.position);
      frame.position.z -= Math.cos(angle) * 0.01;
      frame.lookAt(camera.position);
      frame.translateZ(-0.02);
      scene.add(frame);

      if (e.image) {
        loader.load(asset(e.image), (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          mat.needsUpdate = true;
          const img = tex.image as { width: number; height: number };
          const aspect = img.width / img.height;
          mesh.scale.set(aspect >= 1 ? 1 : aspect, aspect >= 1 ? 1 / aspect : 1, 1);
          frame.scale.copy(mesh.scale).multiplyScalar(1.06);
        });
      }
    });

    // ---- Look controls (drag to orbit the view) ----
    let yaw = 0;
    let pitch = 0;
    let dragging = false;
    let moved = false;
    let px = 0;
    let py = 0;
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = false;
      px = e.clientX;
      py = e.clientY;
      const r = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      yaw -= dx * 0.0035;
      pitch -= dy * 0.0025;
      pitch = Math.max(-0.5, Math.min(0.5, pitch));
    };
    const onUp = () => {
      renderer.domElement.style.cursor = "grab";
      if (dragging && !moved) {
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(objects, false)[0];
        if (hit) setSelected((hit.object.userData as { id: string }).id);
        else setSelected(null);
      }
      dragging = false;
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // ---- Resize ----
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ---- Loop ----
    let raf = 0;
    const clock = new THREE.Clock();
    const target = new THREE.Vector3();
    const animate = () => {
      const t = clock.getElapsedTime();
      // gentle auto-drift + drag yaw/pitch (auto-drift suppressed under reduced motion)
      const lookYaw = yaw + (reduceMotion ? 0 : Math.sin(t * 0.08) * 0.06);
      target.set(
        Math.sin(lookYaw) * Math.cos(pitch),
        1.2 + Math.sin(pitch),
        -Math.cos(lookYaw) * Math.cos(pitch)
      );
      camera.lookAt(target);
      // lamp flicker (held steady under reduced motion)
      lamp.intensity = reduceMotion
        ? 8.8
        : 8.4 + Math.sin(t * 9) * 0.4 + Math.sin(t * 23) * 0.2;
      // object bob (held still under reduced motion)
      objects.forEach((o, i) => {
        o.position.y =
          (o.userData.baseY as number) +
          (reduceMotion ? 0 : Math.sin(t * 0.7 + i) * 0.03);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <CompanionShell
      eyebrow="§ 11 // ROOM 14 · DIORAMA ALPHA"
      title="Step inside the room."
      intro="A lightweight web-exploration scene — drag to look around, tap an object to inspect it. The five pieces of evidence float where memory left them. This is the bible's fallback diorama; the full Gaussian-splat / GLB Room 14 drops in here when the reference packs become models."
    >
      <div className="relative mt-12">
        {webglOk ? (
          <>
            <div
              ref={mountRef}
              aria-hidden="true"
              className="hud-frame relative aspect-[16/10] w-full overflow-hidden rounded-md border border-white/10 bg-[#080809]"
            />
            {/* filmic overlays (decorative) */}
            <div
              className="grain pointer-events-none absolute inset-0 rounded-md"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              aria-hidden="true"
              style={{ boxShadow: "inset 0 0 160px 40px rgba(0,0,0,0.7)" }}
            />
            <span
              className="mono pointer-events-none absolute left-4 top-4 text-[10px] tracking-[0.3em] text-teal/80"
              aria-hidden="true"
            >
              OVS // ROOM 14 · DRAG TO LOOK · TAP TO INSPECT
            </span>
          </>
        ) : (
          <div className="hud-frame relative flex aspect-[16/10] w-full items-center justify-center rounded-md border border-white/10 bg-[#080809] p-6 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              The interactive 3D diorama needs WebGL, which isn&rsquo;t available
              in this browser. Use the evidence index below to inspect each
              piece.
            </p>
          </div>
        )}

        {/* inspect overlay — shared by pointer and keyboard selection */}
        {selectedEvidence && (
          <div
            aria-live="polite"
            className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:right-4 sm:max-w-sm"
          >
            <div className="glass hud-frame rounded-md border border-white/15 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="mono text-[10px] tracking-[0.3em] text-teal">
                    {selectedEvidence.id}
                  </span>
                  <h3 className="mt-0.5 text-lg font-bold tracking-tight">
                    {selectedEvidence.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close inspector"
                  className="mono rounded-sm border border-white/15 px-2 py-1 text-[10px] text-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  ✕
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {selectedEvidence.note}
              </p>
              <p className="mono mt-3 border-t border-white/10 pt-3 text-[10px] leading-relaxed tracking-[0.05em] text-muted/70">
                {selectedEvidence.status} · QC — {selectedEvidence.qc}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* keyboard + screen-reader accessible evidence index —
          mirrors the drag/tap canvas interaction for non-pointer users */}
      <nav aria-label="Room 14 evidence" className="mt-5">
        <h3 className="mono text-[10px] tracking-[0.3em] text-teal/80">
          EVIDENCE INDEX
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {EVIDENCE.map((e) => {
            const active = selected === e.id;
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelected((cur) => (cur === e.id ? null : e.id))
                  }
                  aria-pressed={active}
                  className={`mono inline-flex min-h-11 items-center rounded-sm border px-3 py-2 text-[11px] tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    active
                      ? "border-accent/60 text-foreground"
                      : "border-white/15 text-muted hover:text-foreground"
                  }`}
                >
                  {e.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </CompanionShell>
  );
}
