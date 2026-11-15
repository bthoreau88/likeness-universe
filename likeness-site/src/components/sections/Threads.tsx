"use client";

// Home-page anthology band — surfaces the companion threads (Street, Wardrobe,
// Score) so the front door leads into them, not just the navbar. Same OVS dark
// system; links out to the immersive routes.

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { asset } from "@/lib/base";
import { Scanlines } from "@/components/atmos/Atmos";

type Thread = {
  code: string;
  title: string;
  blurb: string;
  href: string;
  image: string;
  accent?: boolean;
};

const THREADS: Thread[] = [
  {
    code: "EXT · SURVEILLANCE",
    title: "The Street",
    blurb:
      "The exterior the game never lets you reach — a street cast where every stranger keeps testing positive for your face.",
    href: "/street",
    image: "/stills/thoreau-watching.png",
    accent: true,
  },
  {
    code: "COSTUME DEPT",
    title: "Wardrobe",
    blurb:
      "The motel-noir lookbook. Lived-in, restrained, identity-locked — clothes the double has to wear right.",
    href: "/wardrobe",
    image: "/stills/fabric.png",
  },
  {
    code: "SOUND DEPT",
    title: "Score",
    blurb:
      "Room tone as music. Tape hiss, a fluorescent hum, a detuned piano under a drone — the sound the room edits you with.",
    href: "/score",
    image: "/stills/three-tapes.png",
  },
];

export function Threads() {
  return (
    <section
      id="threads"
      className="grain relative mx-auto max-w-[1400px] px-6 py-24 md:px-8 md:py-32"
    >
      <span className="mono text-xs tracking-[0.4em] text-accent">
        § 17 // THE THREADS
      </span>
      <h2 className="mt-4 max-w-[20ch] text-4xl font-bold leading-[1.03] tracking-tight md:text-6xl">
        One universe, several tapes.
      </h2>
      <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-muted md:text-base">
        The game is the flagship, but the world spills past it. Three threads
        run alongside Room 14 — the street outside it, the wardrobe inside it,
        and the score it keeps time with.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {THREADS.map((t, i) => (
          <motion.div
            key={t.href}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 85,
              damping: 20,
              delay: i * 0.08,
            }}
          >
            <Link
              href={t.href}
              className={`hud-frame glass group block h-full overflow-hidden rounded-md transition-colors ${
                t.accent ? "ring-1 ring-accent/30" : ""
              } hover:border-white/20`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <Image
                  src={asset(t.image)}
                  alt={t.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover grayscale-[0.55] contrast-105 transition-transform duration-700 group-hover:scale-105"
                />
                <Scanlines />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <span className="mono absolute top-4 left-4 text-[9px] tracking-[0.3em] text-teal/90">
                  {t.code}
                </span>
                <h3 className="glow-accent absolute bottom-3 left-5 text-3xl font-extrabold tracking-tight">
                  {t.title}
                </h3>
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <p className="max-w-[34ch] text-[13px] leading-relaxed text-muted">
                  {t.blurb}
                </p>
                <span className="mono mt-1 shrink-0 text-[11px] tracking-[0.2em] text-accent transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
