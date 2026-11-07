import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/base";
import { CHARACTERS, CHARACTER_PROFILES, streetSightingsFor } from "@/lib/registry";

export function CharacterDetail({ slug }: { slug: string }) {
  const entry = CHARACTER_PROFILES.find((profile) => profile.slug === slug);
  const character = CHARACTERS.find((c) => c.id === entry?.characterId);
  if (!entry || !character) return null;
  const index = CHARACTER_PROFILES.findIndex((c) => c.slug === slug);
  const next = CHARACTER_PROFILES[(index + 1) % CHARACTER_PROFILES.length];
  const nextCharacter = CHARACTERS.find((c) => c.id === next.characterId);
  const sightings = streetSightingsFor(character.id);

  return (
    <article className="grain min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 pt-8 md:px-10">
        <header className="mono flex items-center justify-between gap-4 text-xs tracking-[0.2em]">
          <Link href="/characters" className="text-teal hover:text-foreground">← CHARACTER ROSTER</Link>
          <Link href="/" className="text-muted hover:text-foreground">OVS // LIKENESS</Link>
        </header>
      </div>

      <section className="relative mx-auto mt-8 min-h-[80svh] max-w-[1400px] overflow-hidden rounded-sm bg-steel md:mt-10 md:min-h-[90svh]">
        {character.image ? (
          <Image src={asset(character.image)} alt={`Portrait of ${character.name}`} fill priority
            sizes="(max-width: 1000px) 100vw, 1400px"
            className="object-cover object-center" />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/20" />
        <div className="absolute inset-x-6 bottom-12 z-10 md:inset-x-12 md:bottom-20">
          <span className="mono text-xs tracking-[0.3em] text-teal">
            OVS // CHARACTER AUTHORITY · {entry.edition}
          </span>
          <h1 className="glow-accent mt-5 text-[15vw] font-black leading-[0.82] tracking-tighter md:text-[10vw]">
            {character.name}
          </h1>
          <p className="mt-7 max-w-[50ch] text-base leading-relaxed text-foreground/85 md:text-xl">
            {character.role}
          </p>
        </div>
        <nav aria-label="Select a character"
          className="absolute right-4 top-6 z-20 flex gap-2 md:right-8 md:top-8 md:flex-col">
          {CHARACTER_PROFILES.map((profile) => {
            const c = CHARACTERS.find((item) => item.id === profile.characterId);
            return c ? (
              <Link key={profile.slug} href={`/characters/${profile.slug}`}
                aria-label={`View ${c.name} dossier`}
                aria-current={profile.slug === slug ? "page" : undefined}
                className={`relative block h-16 w-14 overflow-hidden rounded-sm border-2 bg-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal md:h-24 md:w-20 ${profile.slug === slug ? "border-accent" : "border-white/20 hover:border-teal"}`}>
                {c.image && <Image src={asset(c.image)} alt="" fill
                  sizes="80px" className="object-cover" />}
              </Link>
            ) : null;
          })}
        </nav>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 pb-32 md:px-10">
        <section className="grid gap-12 border-b border-white/15 py-20 md:grid-cols-[1fr_2fr] md:gap-20 md:py-28">
          <div className="mono space-y-5 text-xs tracking-[0.12em] text-muted">
            <p>CHARACTER ID / {character.id}</p>
            <p>PRODUCTION STATUS / {character.status}</p>
            <p>POSITION / {entry.edition}</p>
            {character.isDouble && <p className="text-accent">DOUBLE AUTHORITY / ORIGINAL IDENTITY</p>}
          </div>
          <div>
            <span className="mono text-xs tracking-[0.3em] text-accent">§ 01 // IDENTITY</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              A face to recognize.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/85 md:text-2xl">
              {character.identityLock}
            </p>
          </div>
        </section>

        <section className="grid gap-12 border-b border-white/15 py-20 md:grid-cols-[1fr_2fr] md:gap-20 md:py-28">
          <div className="mono text-xs tracking-[0.12em] text-muted">
            § 02 // PRODUCTION CONTROL
          </div>
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              What must not drift.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/85">
              {character.driftRisk}
            </p>
            <p className="mono mt-8 text-xs leading-relaxed text-muted">
              This is an OVS source-authority dossier, not a playable-character stat screen.
            </p>
          </div>
        </section>

        {sightings.length > 0 && (
          <section className="py-20 md:py-28">
            <span className="mono text-xs tracking-[0.3em] text-teal">§ 03 // EXTERIOR RECORDS</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">Seen outside.</h2>
            <div className="mt-10 space-y-8">
              {sightings.map((s) => (
                <div key={s.code} className="grid gap-2 border-t border-white/15 pt-6 md:grid-cols-[1fr_2fr]">
                  <p className="mono text-xs text-teal">{s.code} / {s.loc}</p>
                  <div>
                    <h3 className="text-2xl font-bold">{s.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/street" className="mono mt-10 inline-block border-b border-accent pb-2 text-xs tracking-[0.2em] text-accent">
              OPEN THE STREET RECORD →
            </Link>
          </section>
        )}

        <footer className="mt-14 flex flex-wrap items-end justify-between gap-8 border-t border-white/15 pt-10">
          <Link href="/characters" className="mono text-xs tracking-[0.2em] text-muted hover:text-foreground">
            ← ALL CHARACTERS
          </Link>
          <Link href={`/characters/${next.slug}`} className="text-right">
            <span className="mono block text-xs tracking-[0.3em] text-teal">NEXT IDENTITY →</span>
            <span className="mt-3 block text-3xl font-extrabold md:text-5xl">{nextCharacter?.name}</span>
          </Link>
        </footer>
      </div>
    </article>
  );
}
