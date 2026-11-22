"use client";

import { motion } from "framer-motion";
import { ConceptTile } from "@/components/atmos/Atmos";

const TILES = [
  { variant: "hallway", label: "Hallway — six doors where there were five", code: "RUPTURE · C·06" },
  { variant: "tape", label: "Tape 01 — Brandon, eight days prior, sepia-umber", code: "TAPE · E·01" },
  { variant: "mirror", label: "Mirror · no reflection — the body that isn't there", code: "RUPTURE · F·03" },
] as const;

export function ConceptFrames() {
  return (
    <section
      id="concept"
      className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mono text-xs tracking-[0.4em] text-accent">
            VOLUME 02 // FRAMES STILL TO SHOOT
          </span>
          <h2 className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Fifty-two shot orders. Not mood requests.
          </h2>
        </div>
      </div>
      <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-muted md:text-base">
        These graded fields are authored placeholders — the bible&apos;s
        identity lock means photoreal likeness frames are generated in the OVS
        pipeline (Midjourney / Flux / Seedance), never fabricated here.
      </p>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TILES.map((t) => (
          <motion.div
            key={t.code}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 90, damping: 20 },
              },
            }}
          >
            <ConceptTile variant={t.variant} label={t.label} code={t.code} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
