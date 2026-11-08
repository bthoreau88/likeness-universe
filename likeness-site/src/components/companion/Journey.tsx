"use client";

// THE JOURNEY OF TAPE 03 — a scroll-driven, pinned-chapter journey following
// one object through the LIKENESS universe: street → threshold → room → deck →
// memory. An original homage to the "immersive scroll journey" form (a tea
// leaf from mountain to cup), rebuilt to LIKENESS lore and the OVS dark system,
// native to this static site. Reuses only the shared asset helper.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/base";
import { Scanlines } from "@/components/atmos/Atmos";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

type Stage = {
  n: string;
  key: string;
  title: string;
  place: string;
  line: string;
  body: string;
  image: string;
  tone: "teal" | "accent";
};

const STAGES: Stage[] = [
  {
    n: "I",
    key: "street",
    title: "Found",
    place: "EXT · THE STREET",
    line: "A cassette on the pavement outside Room 14.",
    body: "No case, no label the light will hold still long enough to read. The exterior cameras logged it at 03:14 — and again a minute before, which the timestamp refuses to explain.",
    image: "/frames/frame_0012.jpg",
    tone: "teal",
  },
  {
    n: "II",
    key: "threshold",
    title: "Carried",
    place: "INT · THE THRESHOLD",
    line: "Through the door that only opens the one way.",
    body: "Down the hallway that repeats a beat too long, past the office ledger with your name already signed. The tape gets warmer the closer it comes to the room.",
    image: "/stills/hallway-door14.png",
    tone: "teal",
  },
  {
    n: "III",
    key: "room",
    title: "Set Down",
    place: "INT · ROOM 14",
    line: "Placed on the desk beside the bed, still ticking.",
    body: "The room takes inventory of it the way it takes inventory of you. Objects rearrange to make space the tape did not ask for. Everything in here remembers a different version of the night.",
    image: "/stills/thoreau-desk.png",
    tone: "teal",
  },
  {
    n: "IV",
    key: "deck",
    title: "Played",
    place: "INT · THE DECK",
    line: "You press play. The room edits itself behind you.",
    body: "Recorded truth turns out unreliable. A voice that is your own is already mid-sentence. The reflection answers late; the walls agree to a story you don't remember telling.",
    image: "/stills/three-tapes.png",
    tone: "accent",
  },
  {
    n: "V",
    key: "memory",
    title: "Kept",
    place: "INT · THE MEMORY",
    line: "Now you can't tell which take was true.",
    body: "The journey ends where it started — the door, the key, the record in your hand. You take it back out to the street carrying a question, not an answer. Somewhere a second copy is already walking your way.",
    image: "/stills/thoreau-mirror.png",
    tone: "accent",
  },
];

function Chapter({
  stage,
  index,
  registerEl,
}: {
  stage: Stage;
  index: number;
  registerEl: (i: number, el: HTMLElement | null) => void;
}) {
  const localRef = useRef<HTMLElement>(null);
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      localRef.current = el;
      registerEl(index, el);
    },
    [index, registerEl],
  );
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });
  // parallax + subtle zoom on the pinned background
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.04, 1.12]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.35, 0.7, 0.9],
    [0, 1, 1, 0],
  );
  const textY = useTransform(scrollYProgress, [0.18, 0.4], [40, 0]);
  // Reduced motion: hold the background still and drop the copy's slide-in.
  // The scroll-linked opacity fade stays (a fade is not movement).
  const reduce = useReducedMotionPref();

  return (
    <section ref={setRef} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* pinned parallax background */}
        <motion.div
          style={reduce ? { y: 0, scale: 1 } : { y, scale }}
          className="absolute inset-0"
        >
          <Image
            src={asset(stage.image)}
            alt={stage.title}
            fill
            sizes="100vw"
            className="object-cover grayscale-[0.55] contrast-105 brightness-[0.7]"
          />
        </motion.div>
        <Scanlines />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        {/* chapter copy */}
        <motion.div
          style={{ opacity: textOpacity, y: reduce ? 0 : textY }}
          className="relative mx-auto w-full max-w-[1400px] px-6 md:pr-10 md:pl-44"
        >
          <div className="max-w-[42ch]">
            <div className="flex items-center gap-4">
              <span
                className={`mono text-6xl font-extrabold leading-none md:text-8xl ${
                  stage.tone === "accent" ? "text-accent glow-accent" : "text-teal"
                }`}
              >
                {stage.n}
              </span>
              <span className="mono text-[10px] tracking-[0.35em] text-muted">
                {stage.place}
              </span>
            </div>
            <h2 className="glow-accent mt-6 text-5xl font-extrabold tracking-tighter md:text-7xl">
              {stage.title}
            </h2>
            <p className="mt-4 text-lg font-semibold text-foreground/90 md:text-2xl">
              {stage.line}
            </p>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted md:text-base">
              {stage.body}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Journey() {
  const [active, setActive] = useState(0);

  // chapter DOM elements, reported up via callback refs (no ref reads in render).
  const elsRef = useRef<(HTMLElement | null)[]>([]);
  const registerEl = useCallback((i: number, el: HTMLElement | null) => {
    elsRef.current[i] = el;
  }, []);

  // active = the chapter whose band contains the viewport center. Continuous,
  // so it never goes stale between chapters (any screen size).
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const center = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      elsRef.current.forEach((el, i) => {
        if (el && center >= el.offsetTop) idx = i;
      });
      setActive(idx);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // hero → fade its scroll cue once you start
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProg } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const cueOpacity = useTransform(heroProg, [0, 0.4], [1, 0]);

  return (
    <div className="relative">
      {/* back link */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 px-6 pt-7 md:px-10">
        <Link
          href="/"
          className="mono pointer-events-auto text-[11px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-foreground"
        >
          ← OVS // LIKENESS
        </Link>
      </div>

      {/* mobile progress: top fill bar + current-stage pill */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 md:hidden">
        <div className="h-[3px] w-full bg-white/10">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${((active + 1) / STAGES.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-center pt-3">
          <span className="mono glass rounded-full px-3.5 py-1.5 text-[9px] tracking-[0.25em] text-teal">
            {STAGES[active].n} · {STAGES[active].title.toUpperCase()} ·{" "}
            {active + 1}/{STAGES.length}
          </span>
        </div>
      </div>

      {/* fixed progress rail (desktop) */}
      <div className="pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {STAGES.map((s, i) => (
          <div key={s.key} className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "scale-125 bg-accent"
                  : i < active
                    ? "bg-teal/70"
                    : "bg-white/25"
              }`}
            />
            <span
              className={`mono text-[9px] tracking-[0.25em] transition-colors duration-300 ${
                i === active ? "text-foreground" : "text-muted/50"
              }`}
            >
              {s.n} · {s.title.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={asset("/stills/three-tapes.png")}
            alt="Tape 03"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30 grayscale contrast-110 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
          <Scanlines />
        </div>
        <div className="relative">
          <span className="mono text-xs tracking-[0.5em] text-accent">
            OVS // ONE OBJECT · FIVE ROOMS
          </span>
          <h1 className="glow-accent mt-5 text-[16vw] font-extrabold leading-[0.82] tracking-tighter md:text-[11vw]">
            THE JOURNEY
            <br />
            OF TAPE 03
          </h1>
          <p className="mx-auto mt-6 max-w-[48ch] text-sm leading-relaxed text-muted md:text-base">
            An immersive scroll down the path of one cassette — from the street
            it was found on to the memory it rewrites. Scroll, and follow the
            record home.
          </p>
        </div>
        <motion.span
          style={{ opacity: cueOpacity }}
          className="mono absolute bottom-10 animate-pulse text-[10px] tracking-[0.4em] text-teal"
        >
          ▼ FOLLOW THE RECORD
        </motion.span>
      </section>

      {/* ============ CHAPTERS ============ */}
      {STAGES.map((s, i) => (
        <Chapter key={s.key} stage={s} index={i} registerEl={registerEl} />
      ))}

      {/* ============ closing ============ */}
      <footer className="grain relative border-t border-white/10 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mono text-xs tracking-[0.4em] text-accent">
            OVS // JOURNEY · END
          </span>
          <h2 className="glow-accent mt-4 max-w-[18ch] text-5xl font-extrabold leading-[0.92] tracking-tighter md:text-8xl">
            The record ends where it started.
          </h2>
          <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <p className="max-w-[46ch] text-sm text-muted">
              One object, five rooms, and a night that refuses to stay told the
              same way twice. Play it again and the journey is a little
              different — which is the point.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/tapes"
                className="mono rounded-sm bg-accent px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-black uppercase transition-transform hover:scale-105"
              >
                The tape archive
              </Link>
              <Link
                href="/score"
                className="mono rounded-sm border border-white/15 px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase transition-colors hover:text-foreground"
              >
                Hear the room
              </Link>
              <Link
                href="/room-testifies"
                className="mono rounded-sm border border-teal/40 px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-teal uppercase transition-colors hover:text-foreground"
              >
                The room testifies
              </Link>
            </div>
          </div>
          <div className="mono mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] tracking-[0.2em] text-muted md:flex-row md:justify-between">
            <span>© {2026} Omnia Vanitas Studios — LIKENESS // THE JOURNEY</span>
            <span>YOU TAKE THE RECORD BACK</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
