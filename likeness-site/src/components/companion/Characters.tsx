"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CHARACTERS, CHARACTER_PROFILES, streetSightingsFor } from "@/lib/registry";
import { asset } from "@/lib/base";
import { CompanionShell } from "./CompanionShell";

export function Characters() {
  return (
    <CompanionShell
      eyebrow="§ 08 // CHARACTER SYSTEM"
      title="Identity, locked."
      intro="Two people, and the wrong double answering for them. Every character is a registry item with an identity lock and a drift risk — recognizable in gameplay, cinematics, posters, and here. The threat is not only the double. The threat is that your memory might be the edited copy."
    >
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {CHARACTERS.map((c, i) => {
          const sightings = streetSightingsFor(c.id);
          const profile = CHARACTER_PROFILES.find((p) => p.characterId === c.id);
          const topMatch = sightings.reduce(
            (m, s) => Math.max(m, s.matchNum),
            0,
          );
          return (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 85, damping: 20, delay: i * 0.07 }}
            className={`hud-frame glass group overflow-hidden rounded-md ${
              c.isDouble ? "ring-1 ring-accent/40" : ""
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {c.image ? (
                <Image
                  src={asset(c.image)}
                  alt={c.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    c.isDouble ? "grayscale-[0.4] contrast-110" : ""
                  }`}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-steel to-background" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <span
                className={`mono absolute right-4 top-4 rounded-sm px-2.5 py-1 text-[9px] font-semibold tracking-[0.15em] ${
                  c.isDouble ? "bg-accent/90 text-black" : "bg-teal/80 text-black"
                }`}
              >
                {c.status}
              </span>
              <div className="absolute bottom-0 left-0 p-5">
                <span className="mono text-[10px] tracking-[0.3em] text-teal">
                  {c.id}
                </span>
                <h2 className="glow-accent text-3xl font-extrabold tracking-tight md:text-4xl">
                  {c.name}
                </h2>
                <p className="mt-1 max-w-[34ch] text-xs leading-snug text-muted">
                  {c.role}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <span className="mono block text-[9px] tracking-[0.3em] text-teal">
                  IDENTITY LOCK
                </span>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {c.identityLock}
                </p>
              </div>
              <div>
                <span className="mono block text-[9px] tracking-[0.3em] text-accent/80">
                  DRIFT RISK
                </span>
                <p className="mono mt-1 text-[11px] leading-relaxed text-muted/80">
                  {c.driftRisk}
                </p>
              </div>
              {sightings.length > 0 && (
                <Link
                  href="/street"
                  className="mono group/st flex items-center justify-between rounded-sm border border-teal/25 bg-teal/[0.04] px-3 py-2 text-[10px] tracking-[0.2em] text-teal transition-colors hover:border-teal/50"
                >
                  <span>
                    SEEN ON THE STREET · {sightings.length}× · {topMatch}% LOCK
                  </span>
                  <span className="transition-transform group-hover/st:translate-x-1">
                    →
                  </span>
                </Link>
              )}
              {profile && (
                <Link
                  href={`/characters/${profile.slug}`}
                  className="mono mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-[11px] tracking-[0.16em] text-accent transition-colors hover:text-foreground"
                >
                  <span>OPEN FULL DOSSIER</span><span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </motion.article>
          );
        })}
      </div>
    </CompanionShell>
  );
}
