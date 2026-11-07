"use client";

import { useEffect, useRef, useState } from "react";

type FrameSet = { count: number; path: (frame: number) => string };
type TimedBeat = { id: string; show: number; hide: number };

// The canvas is purely decorative: narrative text remains in the DOM.
// Load only the active source still and its neighbor, not an entire sequence.
// The original 169-frame superhero demo must never be requested by this hook.
export function useScrollCanvas({
  frames,
  beats,
  prefix,
}: {
  frames: FrameSet;
  beats: readonly TimedBeat[];
  prefix: "SEQ" | "CAM";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || frames.count < 1) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: Array<HTMLImageElement | undefined> = [];
    let stopped = false;
    let raf = 0;
    let lastVisible = "";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const cover = (img: HTMLImageElement, alpha: number) => {
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ratio = img.naturalWidth / img.naturalHeight;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const zoom = w <= 768 ? 1.12 : 1;
      const dw = img.naturalWidth * scale * zoom;
      const dh = img.naturalHeight * scale * zoom;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    const render = () => {
      const maxScroll = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = motion.matches
        ? 0
        : Math.min(1, Math.max(0, -section.getBoundingClientRect().top / maxScroll));
      const phase = progress * Math.max(0, frames.count - 1);
      const index = Math.min(frames.count - 1, Math.floor(phase));
      const next = Math.min(frames.count - 1, index + 1);
      const blend = phase - index;

      const getImage = (at: number) => {
        if (!images[at]) {
          const img = new window.Image();
          images[at] = img;
          img.onload = () => { if (!stopped) requestAnimationFrame(render); };
          img.onerror = () => { if (!stopped) requestAnimationFrame(render); };
          img.src = frames.path(at + 1);
        }
        return images[at];
      };

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const a = getImage(index);
      const b = getImage(next);
      if (a) cover(a, 1);
      if (next !== index && b) cover(b, blend);

      if (introRef.current) {
        introRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.06));
      }
      if (outroRef.current) {
        const show = progress >= 0.86;
        outroRef.current.style.opacity = show ? "1" : "0";
        outroRef.current.style.pointerEvents = show ? "auto" : "none";
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      if (seqRef.current) {
        seqRef.current.textContent =
          `${prefix} ${String(index + 1).padStart(3, "0")} / ${frames.count}`;
      }

      const active = beats.filter((b) => progress >= b.show && progress < b.hide)
        .map((b) => b.id);
      const key = active.join(",");
      if (key !== lastVisible) {
        lastVisible = key;
        setVisible(active);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        render();
      });
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", resize);
    return () => {
      stopped = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", resize);
    };
  }, [frames, beats, prefix]);

  return {
    sectionRef, canvasRef, introRef, outroRef, barRef, seqRef, visible,
  };
}
