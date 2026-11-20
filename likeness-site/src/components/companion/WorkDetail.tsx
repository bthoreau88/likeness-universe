import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/base";
import { NORTH_STAR, WORKS, WORK_COVERS, WORK_FEATURES } from "@/lib/registry";

export function WorkDetail({ workId }: { workId: string }) {
  const work = WORKS.find((item) => item.id === workId);
  const feature = WORK_FEATURES.find((item) => item.id === workId);
  if (!work || !feature) return null;
  const index = WORKS.findIndex((item) => item.id === workId);
  const next = WORKS[(index + 1) % WORKS.length];
  const nextFeature = WORK_FEATURES.find((item) => item.id === next.id);
  const cover = WORK_COVERS[work.id];

  return (
    <article className="grain min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-8 md:px-10">
        <header className="mono flex items-center justify-between gap-4 text-xs tracking-[0.2em] uppercase">
          <Link href="/works" className="text-teal hover:text-foreground">← All works</Link>
          <Link href="/" className="text-muted hover:text-foreground">OVS // LIKENESS</Link>
        </header>

        <div className="pb-14 pt-24 text-center md:pb-20">
          <span className="mono text-xs tracking-[0.3em] text-accent">
            {work.kind} / {work.status}
          </span>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-5xl font-black leading-[0.92] tracking-tighter md:text-8xl">
            {work.title}
          </h1>
          <p className="mono mt-8 text-xs tracking-[0.18em] text-teal">{work.setting}</p>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-steel sm:aspect-[16/9]">
          <Image src={asset(cover)} alt={`${work.title} hero art`} fill priority
            sizes="(max-width: 640px) 100vw, 1300px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
        </div>

        <section className="mx-auto grid max-w-5xl gap-10 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:py-32">
          <div className="mono space-y-4 text-xs tracking-[0.12em] text-muted">
            <p>WORK ID / {work.id}</p>
            <p>DISCIPLINE / {work.kind}</p>
            <p>STATUS / {work.status}</p>
            <p>STUDIO / {NORTH_STAR.studio}</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">The work.</h2>
            <p className="mt-7 text-lg leading-relaxed text-foreground/85 md:text-2xl">
              {work.blurb}
            </p>
            {work.route && (
              <Link href={work.route}
                className="mono mt-10 inline-flex border-b border-accent pb-2 text-xs tracking-[0.2em] text-accent hover:text-foreground">
                EXPLORE THE LIVE COMPANION PAGE →
              </Link>
            )}
          </div>
        </section>

        <section aria-labelledby="frames-title" className="space-y-20">
          <div className="border-t border-white/15 pt-7">
            <span className="mono text-xs tracking-[0.25em] text-teal">OVS // VISUAL ARCHIVE</span>
            <h2 id="frames-title" className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              Selected frames.
            </h2>
            <p className="mt-4 text-sm text-muted">Existing LIKENESS source imagery. Not proof of completed gameplay or release.</p>
          </div>
          {feature.media.map((item, i) => (
            <figure key={item.image}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-steel sm:aspect-[16/9]">
                <Image src={asset(item.image)} alt={item.label} fill
                  sizes="(max-width: 640px) 100vw, 1300px" className="object-cover" />
              </div>
              <figcaption className="mono mt-4 flex flex-wrap items-center justify-between gap-3 text-xs tracking-[0.14em] text-muted">
                <span>{String(i + 1).padStart(2, "0")} / {String(feature.media.length).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <footer className="mt-28 border-t border-white/15 pt-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mono text-xs tracking-[0.3em] text-accent">NEXT / SELECTED WORKS</span>
              <h2 className="mt-4 max-w-[18ch] text-4xl font-extrabold tracking-tight md:text-6xl">
                {next.title}
              </h2>
              {nextFeature && (
                <Link href={`/works/${nextFeature.slug}`} className="mono mt-5 inline-block border-b border-teal pb-2 text-xs tracking-[0.2em] text-teal">
                  VIEW NEXT WORK →
                </Link>
              )}
            </div>
            <Link href="/works" className="mono border border-white/20 px-6 py-4 text-xs tracking-[0.2em] text-muted hover:text-foreground">
              ALL PROJECTS
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
