// OVS INTAKE — the site-wide follow / wishlist call-to-action.
// Driven entirely by INTAKE in src/lib/registry.ts: each channel renders only
// when its value is set, so links can be swapped in one place. The email form
// is a plain POST (works in the static export — no client JS required).

import { INTAKE } from "@/lib/registry";

function Buttons() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {INTAKE.steam && (
        <a
          href={INTAKE.steam}
          target="_blank"
          rel="noopener noreferrer"
          className="mono rounded-sm bg-accent px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-black uppercase transition-transform hover:scale-105"
        >
          Wishlist on Steam
        </a>
      )}
      {INTAKE.discord && (
        <a
          href={INTAKE.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="mono rounded-sm border border-teal/50 px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-teal uppercase transition-colors hover:bg-teal hover:text-black"
        >
          Join the Discord
        </a>
      )}
      {INTAKE.github && (
        <a
          href={INTAKE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex min-h-11 items-center rounded-sm border border-white/20 px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase transition-colors hover:text-foreground"
        >
          Follow development
        </a>
      )}
    </div>
  );
}

function EmailForm({ compact = false }: { compact?: boolean }) {
  if (!INTAKE.newsletterAction) return null;
  return (
    <form
      action={INTAKE.newsletterAction}
      method="POST"
      target="_blank"
      className={`flex w-full max-w-md gap-2 ${compact ? "" : "mt-6"}`}
    >
      <input
        type="email"
        name="email"
        required
        placeholder="you@aftertheroom.com"
        aria-label="Email address"
        className="mono min-w-0 flex-1 rounded-sm border border-white/15 bg-white/[0.03] px-4 py-3 text-[12px] tracking-[0.1em] text-foreground placeholder:text-muted/60 focus:border-teal/60 focus:outline-none"
      />
      <button
        type="submit"
        className="mono shrink-0 rounded-sm bg-accent px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-black uppercase transition-transform hover:scale-105"
      >
        Get TAPE-04
      </button>
    </form>
  );
}

export function FollowCTA({ variant = "band" }: { variant?: "band" | "compact" }) {
  if (variant === "compact") {
    return (
      <section className="grain relative border-t border-white/10 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mono text-[10px] tracking-[0.4em] text-accent">
              OVS // INTAKE
            </span>
            <p className="mt-2 max-w-[42ch] text-sm text-muted">
              LIKENESS is in development. Follow the build and be first through
              the door.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Buttons />
            <EmailForm compact />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="intake"
      className="grain relative border-t border-white/10 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <span className="mono text-xs tracking-[0.4em] text-accent">
          OVS // INTAKE
        </span>
        <h2 className="glow-accent mt-4 max-w-[16ch] text-4xl font-extrabold leading-[0.95] tracking-tighter md:text-6xl">
          Don&rsquo;t let the tape go quiet.
        </h2>
        <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-muted md:text-base">
          LIKENESS : THE GAME is in development at Omnia Vanitas Studios. Follow
          the build, and be first through the door when Room 14 opens.
        </p>
        <div className="mt-8">
          <Buttons />
          <EmailForm />
        </div>
      </div>
    </section>
  );
}
