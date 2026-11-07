"use client";

// THE STREET — the exterior the game never lets you reach.
// A cinematic, scroll-driven street-cast editorial recustomized into the OVS
// dark system: surveillance sweep, kinetic type, a lookbook of strangers who
// keep testing positive for your face. Recreated from an award-winning brand
// "street" experience and rebuilt to LIKENESS lore (identity, doubles, the
// record). Fully self-contained; reads only the shared frame + asset helpers.

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { asset } from "@/lib/base";
import { HERO } from "@/lib/frames";
import { STREET_SUBJECTS } from "@/lib/registry";
import { Scanlines, RuptureField } from "@/components/atmos/Atmos";
import { useScrollCanvas } from "@/components/atmos/useScrollCanvas";

// ---- Scroll beats over the surveillance sweep ----
type StreetBeat = {
  id: string;
  show: number;
  hide: number;
  index: string;
  title: string;
  quote: string;
  source: string;
};

const STREET_BEATS: StreetBeat[] = [
  {
    id: "st-1",
    show: 0.1,
    hide: 0.3,
    index: "01",
    title: "OUTSIDE",
    quote: "The door opens onto a street the room swears was never there.",
    source: "OVS // EXT. DELLWOOD · 03:14",
  },
  {
    id: "st-2",
    show: 0.38,
    hide: 0.58,
    index: "02",
    title: "TRAFFIC",
    quote: "Every stranger walks like they rehearsed being you.",
    source: "OVS // STREET CAM · PASS 07",
  },
  {
    id: "st-3",
    show: 0.64,
    hide: 0.84,
    index: "03",
    title: "MATCH",
    quote: "The camera keeps flagging faces that are already inside.",
    source: "OVS // FACE-LOCK · 98.6% CONFIDENCE",
  },
];

// ---- Street cast — strangers caught on the exterior cameras.
// Sourced from the shared registry so the site and the game speak the same
// language: the high-confidence subjects resolve to locked identities. ----
const STREET_CAST = STREET_SUBJECTS;

// Existing LIKENESS archive stills, not source-unknown superhero frames.
const CONTACT = Array.from({ length: HERO.count }, (_, i) => HERO.path(i + 1));

export function Street() {
  const {
    sectionRef, canvasRef, introRef, outroRef, barRef, seqRef, visible,
  } = useScrollCanvas({ frames: HERO, beats: STREET_BEATS, prefix: "CAM" });

  return (
    <div className="relative">
      {/* Back link, floating over the sweep */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 px-6 pt-7 md:px-10">
        <Link
          href="/"
          className="mono pointer-events-auto text-[11px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-foreground"
        >
          ← OVS // LIKENESS
        </Link>
      </div>

      {/* ============ ACT I — the surveillance sweep ============ */}
      <section ref={sectionRef} className="scroll-animation ovs-scroll relative">
        <div className="grain ovs-sticky sticky top-0 h-screen overflow-hidden bg-background">
          <Image
            src={HERO.path(1)}
            alt="LIKENESS exterior archive still"
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale-[0.65] opacity-60"
          />
          <canvas
            aria-hidden="true"
            ref={canvasRef}
            className="block h-full w-full"
            style={{ filter: "grayscale(0.72) contrast(1.08) brightness(0.8)" }}
          />
          {/* street-lamp sodium wash + crushed edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
          <RuptureField side="right" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 220px 40px rgba(0,0,0,0.7)" }}
          />

          {/* intro kinetic title */}
          <div
            ref={introRef}
            className="ovs-motion-only absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <span className="mono mb-5 text-xs tracking-[0.5em] text-accent">
              OVS&nbsp;//&nbsp;EXT.&nbsp;FILE
            </span>
            <h1 className="glow-accent text-[19vw] font-extrabold leading-[0.82] tracking-tighter md:text-[15vw]">
              THE STREET
            </h1>
            <p className="mono mt-6 max-w-[42ch] text-[11px] leading-relaxed tracking-[0.15em] text-muted uppercase">
              The one location the game never lets you reach. Scroll to run the
              exterior tape.
            </p>
            <span className="mono mt-10 animate-pulse text-[10px] tracking-[0.4em] text-teal">
              ▼ SCRUB
            </span>
          </div>

          {/* beat cards */}
          {STREET_BEATS.map((b) => {
            const isVisible = visible.includes(b.id);
            return (
              <div
                key={b.id}
                className={`ovs-motion-only absolute left-6 top-1/2 max-w-sm -translate-y-1/2 transition-all duration-500 md:left-16 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
              >
                <div className="glass hud-frame rounded-[20px] p-7">
                  <span className="mono text-xs tracking-[0.3em] text-accent">
                    {b.index} — {b.title}
                  </span>
                  <p className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">
                    &ldquo;{b.quote}&rdquo;
                  </p>
                  <span className="mono mt-5 block text-[10px] tracking-[0.25em] text-muted">
                    {b.source}
                  </span>
                </div>
              </div>
            );
          })}

          {/* outro CTA */}
          <div
            ref={outroRef}
            className="ovs-motion-only absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0 transition-opacity duration-500"
          >
            <span className="mono mb-3 text-xs tracking-[0.4em] text-teal">
              NOBODY OUT HERE IS A STRANGER
            </span>
            <h2 className="glow-accent text-5xl font-extrabold tracking-tight md:text-7xl">
              THEY ALL HAVE YOUR FACE.
            </h2>
            <a
              href="#cast"
              className="mono mt-8 rounded-sm bg-accent px-8 py-3 text-xs font-semibold tracking-[0.15em] text-black uppercase transition-transform hover:scale-105"
            >
              Run the street cast
            </a>
          </div>

          {/* HUD readout */}
          <div className="ovs-motion-only pointer-events-none absolute right-0 bottom-6 left-0 px-6 md:px-16">
            <div className="mono mb-2 flex items-center justify-between text-[10px] tracking-[0.25em] text-muted">
              <span ref={seqRef}>CAM 001 / {HERO.count}</span>
              <span className="text-teal">● REC · EXT · DELLWOOD BLOCK</span>
            </div>
            <div className="h-px w-full bg-white/10">
              <div
                ref={barRef}
                className="h-full origin-left bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="ovs-reduced-only relative mx-auto max-w-4xl px-6 py-12">
        <p className="mono text-xs tracking-[0.2em] text-teal">
          EXT. DELLWOOD // ACCESSIBLE TAPE
        </p>
        <h2 className="mt-4 text-3xl font-extrabold">The Street</h2>
        <ol className="mt-8 space-y-7">
          {STREET_BEATS.map((beat) => (
            <li key={beat.id} className="border-l border-teal/40 pl-5">
              <span className="mono text-xs tracking-[0.2em] text-accent">
                {beat.index} · {beat.title}
              </span>
              <p className="mt-2 text-lg">{beat.quote}</p>
              <span className="mono text-xs text-muted">{beat.source}</span>
            </li>
          ))}
        </ol>
        <a href="#cast" className="mono mt-10 inline-flex border border-teal/40 px-5 py-3 text-xs text-teal">
          Run the street cast
        </a>
      </div>

      {/* ============ kinetic marquee band ============ */}
      <div className="grain relative overflow-hidden border-y border-white/10 bg-steel/40 py-5">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, r) => (
            <span
              key={r}
              className="mono flex items-center text-4xl font-extrabold tracking-tight text-foreground/90 md:text-6xl"
            >
              {Array.from({ length: 4 }).map((__, i) => (
                <span key={i} className="flex items-center">
                  EVERYONE OUT HERE IS WEARING SOMEONE&rsquo;S FACE
                  <span className="mx-8 text-accent">◊</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ ACT II — street cast lookbook ============ */}
      <section
        id="cast"
        className="grain relative mx-auto max-w-[1400px] px-6 py-24 md:px-8 md:py-32"
      >
        <span className="mono text-xs tracking-[0.4em] text-accent">
          § EXT-01 // STREET CAST
        </span>
        <h2 className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
          Six strangers. One face, over and over.
        </h2>
        <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-muted md:text-base">
          The exterior cameras run a face-lock against the two subjects inside
          Room&nbsp;14. It keeps returning matches on people who were never
          cast. Higher confidence means a closer double. The last three do not
          register as strangers at all.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STREET_CAST.map((s, i) => (
            <motion.article
              key={s.code}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 20,
                delay: (i % 3) * 0.07,
              }}
              className={`hud-frame glass group overflow-hidden rounded-md ${
                s.double ? "ring-1 ring-accent/40" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <Image
                  src={asset(s.image)}
                  alt={s.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 440px"
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    s.double ? "grayscale-[0.35] contrast-110" : "grayscale-[0.6]"
                  }`}
                />
                <Scanlines />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <span
                  className={`mono absolute top-4 right-4 rounded-sm px-2.5 py-1 text-[9px] font-semibold tracking-[0.15em] ${
                    s.double
                      ? "bg-accent/90 text-black"
                      : "bg-teal/80 text-black"
                  }`}
                >
                  {s.matchNum}% MATCH
                </span>
                <span className="mono absolute top-4 left-4 text-[9px] tracking-[0.3em] text-teal/90">
                  {s.code}
                </span>
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="mono text-[10px] tracking-[0.3em] text-muted">
                    {s.loc}
                  </span>
                  <h3 className="glow-accent text-2xl font-extrabold tracking-tight md:text-3xl">
                    {s.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[13px] leading-relaxed text-muted">
                  {s.note}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============ ACT III — editorial statement ============ */}
      <section className="grain relative border-y border-white/10 px-6 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-[1100px]">
          <span className="mono text-xs tracking-[0.4em] text-teal">
            § EXT-02 // FIELD NOTE
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
            className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl"
          >
            A street is just a room{" "}
            <span className="glow-accent text-accent">with the walls</span>{" "}
            walked away.
          </motion.h2>
          <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-muted md:text-base">
            The brand version of this page put real people on the pavement and
            let the city cast them. Ours does the same — except the city keeps
            handing us the same two faces, dressed as everyone else. You can
            leave Room&nbsp;14. You cannot leave the likeness. The exterior is
            not an escape; it is the widest shot of the same argument.
          </p>
          <div className="mono mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-6 text-[11px] tracking-[0.2em] text-muted">
            <span>GRADE · SODIUM VS THRESHOLD TEAL</span>
            <span>CAMERA · FIXED, PATIENT, UNBLINKING</span>
            <span className="text-accent">RULE · EVIDENCE, NOT EXPLANATION</span>
          </div>
        </div>
      </section>

      {/* ============ contact sheet ============ */}
      <section className="grain relative mx-auto max-w-[1400px] px-6 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mono text-xs tracking-[0.4em] text-accent">
              § EXT-03 // CONTACT SHEET
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              What the block gave back.
            </h2>
          </div>
          <span className="mono text-[11px] tracking-[0.2em] text-muted">
            08 STILLS · OVS ARCHIVE
          </span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CONTACT.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="hud-frame relative overflow-hidden rounded-sm border border-white/10 bg-black"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={src}
                  alt={`LIKENESS archive still ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover grayscale-[0.75] contrast-110 brightness-90 transition duration-700 hover:grayscale-0"
                />
                <Scanlines />
                <span className="mono absolute bottom-1.5 left-2 text-[8px] tracking-[0.2em] text-teal/80">
                  EXT · {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ============ closing CTA ============ */}
      <footer className="grain relative border-t border-white/10 px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <span className="mono text-xs tracking-[0.4em] text-accent">
            OVS // EXT · CLOSE
          </span>
          <h2 className="glow-accent mt-4 max-w-[16ch] text-5xl font-extrabold leading-[0.92] tracking-tighter md:text-8xl">
            Go back inside.
          </h2>
          <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <p className="max-w-[46ch] text-sm text-muted">
              The tape ends where it started: the door, the key, the room that
              remembers what love edited out. The street was never the way out.
              It was the establishing shot.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/universe"
                className="mono rounded-sm bg-accent px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-black uppercase transition-transform hover:scale-105"
              >
                Enter the archive
              </Link>
              <Link
                href="/motel"
                className="mono rounded-sm border border-white/15 px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase transition-colors hover:text-foreground"
              >
                The motel map
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
            <span>© {2026} Omnia Vanitas Studios — LIKENESS // THE STREET</span>
            <span>THE BLOCK REMEMBERS EVERY FACE THAT PASSED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
