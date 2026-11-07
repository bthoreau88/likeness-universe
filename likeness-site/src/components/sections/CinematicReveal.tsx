"use client";

import Image from "next/image";
import { BEATS, CINE } from "@/lib/frames";
import { useScrollCanvas } from "@/components/atmos/useScrollCanvas";

export function CinematicReveal() {
  const {
    sectionRef, canvasRef, introRef, outroRef, barRef, seqRef, visible,
  } = useScrollCanvas({ frames: CINE, beats: BEATS, prefix: "SEQ" });

  return (
    <section ref={sectionRef} className="scroll-animation ovs-scroll relative">
      <div className="grain ovs-sticky sticky top-0 h-screen overflow-hidden bg-background">
        {/* NOTE: graded to the OVS look. Swap /public/frames2 with a DRYA /
            THOREAU turntable or a Room-14 push-in and the grade can ease back. */}
        <Image
          src={CINE.path(1)}
          alt="THOREAU in the LIKENESS archive"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <canvas
          aria-hidden="true"
          ref={canvasRef}
          className="block h-full w-full"
          style={{ filter: "grayscale(0.7) contrast(1.06) brightness(0.82)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

        {/* intro headline */}
        <div
          ref={introRef}
          className="ovs-motion-only absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="mb-4 font-mono text-xs tracking-[0.4em] text-accent">
            OVS&nbsp;//&nbsp;TAPE-03
          </span>
          <h2 className="max-w-[18ch] text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            When the likeness takes hold, who is left underneath?
          </h2>
        </div>

        {/* beat cards */}
        {BEATS.map((b) => {
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
              <div className="glass rounded-[20px] p-7">
                <span className="font-mono text-xs tracking-[0.3em] text-accent">
                  {b.index} — {b.title}
                </span>
                <p className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">
                  “{b.quote}”
                </p>
                <span className="mt-5 block font-mono text-[10px] tracking-[0.25em] text-muted">
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
            EVIDENCE · NOT EXPLANATION
          </span>
          <h2 className="glow-accent text-5xl font-extrabold tracking-tight md:text-7xl">
            THE RECORD REMAINS.
          </h2>
          <a
            href="#subjects"
            className="mono mt-8 rounded-sm bg-accent px-8 py-3 text-xs font-semibold tracking-[0.15em] text-black uppercase transition-transform hover:scale-105"
          >
            Meet the two
          </a>
        </div>

        {/* HUD: sequence readout + progress bar */}
        <div className="ovs-motion-only pointer-events-none absolute bottom-6 left-0 right-0 px-6 md:px-16">
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-muted">
            <span ref={seqRef}>SEQ 001 / {CINE.count}</span>
            <span>OVS ARCHIVE · THE ROOM REMEMBERS</span>
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
      <div className="ovs-reduced-only relative mx-auto max-w-4xl px-6 py-12">
        <p className="mono text-[11px] tracking-[0.3em] text-teal">
          OVS // ARCHIVE · ACCESSIBLE SEQUENCE
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
          The likeness takes hold.
        </h2>
        <ol className="mt-8 space-y-8">
          {BEATS.map((beat) => (
            <li key={beat.id} className="border-l border-teal/40 pl-5">
              <span className="mono text-xs tracking-[0.2em] text-accent">
                {beat.index} · {beat.title}
              </span>
              <p className="mt-2 text-lg">{beat.quote}</p>
              <span className="mono text-xs text-muted">{beat.source}</span>
            </li>
          ))}
        </ol>
        <a href="#subjects" className="mono mt-10 inline-flex border border-teal/40 px-5 py-3 text-xs text-teal">
          Meet the characters
        </a>
      </div>
    </section>
  );
}
