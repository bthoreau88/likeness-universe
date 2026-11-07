"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/base";
import { NORTH_STAR, WORKS, WORK_COVERS, WORK_FEATURES } from "@/lib/registry";

type Kind = "ALL" | "GAME" | "TAPE" | "THREAD";
const FILTERS: { value: Kind; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "GAME", label: "Game" },
  { value: "TAPE", label: "Film & Tape" },
  { value: "THREAD", label: "Creative Threads" },
];

export function WorksIndex() {
  const [filter, setFilter] = useState<Kind>("ALL");
  const shown = WORKS.filter((work) => filter === "ALL" || work.kind === filter);

  return (
    <div className="grain min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-8 md:px-10">
        <header className="mono flex items-center justify-between gap-5 text-xs tracking-[0.22em] uppercase">
          <Link href="/" className="text-teal hover:text-foreground">← OVS // LIKENESS</Link>
          <Link href="/studio" className="text-muted hover:text-foreground">The studio</Link>
        </header>

        <section className="pb-16 pt-20 md:pb-24 md:pt-28">
          <p className="mono text-xs tracking-[0.38em] text-accent">§ OVS // SELECTED WORKS</p>
          <h1 className="mt-4 text-[16vw] font-black leading-[0.78] tracking-[-0.075em] md:text-[11vw]">
            WORKS<span className="text-accent">.</span>
          </h1>
          <div className="mt-10 flex max-w-3xl flex-col gap-6 md:mt-16 md:flex-row md:items-end">
            <p className="max-w-[58ch] text-base leading-relaxed text-foreground/80 md:text-xl">
              One universe, different disciplines. Films, characters, a playable
              chamber, the clothes and sounds that hold the evidence.
            </p>
            <p className="mono shrink-0 text-xs leading-relaxed tracking-[0.16em] text-muted">
              {NORTH_STAR.studio}<br />
              {String(WORKS.length).padStart(2, "0")} REGISTERED WORKS
            </p>
          </div>
        </section>

        <nav aria-label="Filter works" className="mb-12 flex flex-wrap gap-x-5 gap-y-4 border-y border-white/15 py-5 md:mb-20">
          {FILTERS.map((item) => {
            const n = item.value === "ALL"
              ? WORKS.length
              : WORKS.filter((work) => work.kind === item.value).length;
            const selected = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={selected}
                className={`mono text-xs tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal ${selected ? "text-accent" : "text-muted hover:text-foreground"}`}
              >
                {item.label} ({n})
              </button>
            );
          })}
        </nav>

        <div className="space-y-24 md:space-y-36">
          {shown.map((work, i) => {
            const feature = WORK_FEATURES.find((f) => f.id === work.id);
            const cover = WORK_COVERS[work.id];
            if (!feature || !cover) return null;
            return (
              <article key={work.id}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="mono text-xs tracking-[0.24em] text-teal">
                      {String(i + 1).padStart(2, "0")} / {work.kind} / {work.status}
                    </span>
                    <h2 className="mt-3 max-w-5xl text-4xl font-extrabold leading-none tracking-tight md:text-7xl">
                      {work.title}
                    </h2>
                  </div>
                  <Link href={`/works/${feature.slug}`}
                    className="mono border-b border-accent pb-1 text-xs tracking-[0.2em] text-accent hover:text-foreground">
                    VIEW PROJECT →
                  </Link>
                </div>
                <Link href={`/works/${feature.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-md bg-steel sm:aspect-[16/10]">
                  <Image src={asset(cover)} alt={`${work.title} editorial artwork`} fill
                    sizes="(max-width: 640px) 100vw, 1200px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="mono absolute bottom-6 left-6 text-xs tracking-[0.2em] text-foreground md:bottom-10 md:left-10">
                    {work.setting}
                  </div>
                </Link>
                <p className="mt-5 max-w-[66ch] text-sm leading-relaxed text-muted md:text-base">
                  {work.blurb}
                </p>
              </article>
            );
          })}
        </div>

        <footer className="mt-32 border-t border-white/15 pt-10">
          <Link href="/characters" className="mono text-xs tracking-[0.22em] text-teal hover:text-foreground">
            NEXT FILE / CHARACTER DOSSIERS →
          </Link>
        </footer>
      </div>
    </div>
  );
}
