"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { asset } from "@/lib/base";
import { WORKS } from "@/lib/registry";

const SENSITIVITY = 0.8;
const SHARE_URL = "https://bthoreau88.github.io/dev-brandon/";

const NAV = [
  { label: "The Game", href: "/#stills" },
  { label: "Characters", href: "/#subjects" },
  { label: "Room Testifies", href: "/room-testifies" },
];

const PILLS = [
  { label: "Wake at 3:14", href: "/#reveal" },
  { label: "Meet the two", href: "/#subjects" },
  { label: "Open the tapes", href: "/#footage" },
];

// Reveal one character at a time after a start delay.
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const to = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(to);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

export function UniverseHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsIn, setPillsIn] = useState(false);
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter(
    "The room remembers what you forgot. Three tapes are still warm. Where do you want to begin?"
  );

  // Pills fade in 400ms after load, independent of the typewriter.
  useEffect(() => {
    const t = setTimeout(() => setPillsIn(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Mouse-scrub the background video horizontally.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMove = (e: MouseEvent) => {
      const dur = video.duration;
      if (!dur || Number.isNaN(dur)) return;
      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      let t = targetTime.current + (delta / window.innerWidth) * SENSITIVITY * dur;
      t = Math.max(0, Math.min(dur - 0.05, t));
      targetTime.current = t;
      if (!seeking.current) {
        seeking.current = true;
        video.currentTime = t;
      }
    };

    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime.current) > 0.01) {
        video.currentTime = targetTime.current;
      } else {
        seeking.current = false;
      }
    };

    window.addEventListener("mousemove", onMove);
    video.addEventListener("seeked", onSeeked);
    return () => {
      window.removeEventListener("mousemove", onMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background video (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
        src={asset("/video/scrub.mp4")}
        poster={asset("/video/study-motion.jpg")}
        muted
        playsInline
        preload="auto"
      />
      {/* Legibility veils */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-background via-background/55 to-background/35" />
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent" />
      <div className="grain fixed inset-0 z-0" />

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="select-none text-[25px] text-accent sm:text-[30px]"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳︎
          </span>
          <span className="text-[21px] font-bold tracking-tight sm:text-[26px]">
            LIKENESS<span className="align-super text-[11px] text-muted">®</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((l, i) => (
            <span key={l.href} className="flex items-center">
              <NavItem href={l.href} label={l.label} />
              {i < NAV.length - 1 && <span className="text-muted">,&nbsp;</span>}
            </span>
          ))}
        </nav>

        <Link
          href="/"
          className="hidden text-[18px] underline underline-offset-2 transition-opacity hover:opacity-60 md:inline lg:text-[20px]"
        >
          Enter the archive
        </Link>

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex flex-col gap-[5px] md:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-foreground transition-all duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-foreground transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-foreground transition-all duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-background/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="text-[32px] font-medium"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium underline underline-offset-4"
        >
          Enter the archive
        </Link>
      </div>

      {/* Hero */}
      <section className="relative z-[1] flex h-screen flex-col justify-end px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none mb-5 select-none sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              filter: "blur(4px)",
            }}
          >
            You&apos;re inside the archive now,
            <br />
            OVS · Omnia Vanitas Studios — the LIKENESS universe
          </div>

          {/* Typewriter */}
          <p
            className="mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: 54,
            }}
          >
            {displayed}
            {!done && (
              <span
                className="ml-[2px] inline-block h-[1.1em] w-[2px] bg-foreground align-middle"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          {/* Pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsIn ? 1 : 0,
              transform: pillsIn ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {PILLS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-accent hover:text-black sm:px-5 sm:text-[15px]"
              >
                {p.label}
              </Link>
            ))}

            {/* Outline copy pill */}
            <button
              onClick={copyLink}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span className="underline underline-offset-1">
                {copied ? "Link copied" : SHARE_URL.replace("https://", "")}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <rect x="3.2" y="3.2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
                <rect x="1.3" y="1.3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>

          {/* Scrub hint */}
          <p className="mono mt-6 hidden text-[10px] tracking-[0.3em] text-muted md:block">
            ◂ MOVE YOUR MOUSE TO SCRUB THE ROOM ▸
          </p>
        </div>
      </section>

      {/* Anthology — the works of the universe */}
      <section className="relative z-[1] border-t border-white/10 bg-background">
        <div className="grain mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
          <span className="mono text-xs tracking-[0.4em] text-accent">
            THE LIKENESS UNIVERSE // WORKS
          </span>
          <h2 className="mt-4 max-w-[20ch] text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            One motel. Many tapes.
          </h2>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted md:text-base">
            An open archive of films, games, and threads that share one world, one
            grade, and one law. The room remembers what love edits out.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {WORKS.map((w) => {
              const card = (
                <div className="hud-frame glass flex h-full flex-col rounded-md p-6 transition-colors hover:border-accent/40">
                  <div className="flex items-center justify-between">
                    <span className="mono rounded-sm border border-teal/40 px-2 py-0.5 text-[9px] tracking-[0.2em] text-teal">
                      {w.kind}
                    </span>
                    <span className="mono text-[9px] tracking-[0.2em] text-muted">
                      {w.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight md:text-2xl">
                    {w.title}
                  </h3>
                  <span className="mono mt-1 text-[10px] tracking-[0.2em] text-muted">
                    {w.setting}
                  </span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {w.blurb}
                  </p>
                  {w.route && (
                    <span className="mono mt-5 text-[10px] tracking-[0.2em] text-accent uppercase">
                      Enter →
                    </span>
                  )}
                </div>
              );
              return w.route ? (
                <Link key={w.id} href={w.route} className="block">
                  {card}
                </Link>
              ) : (
                <div key={w.id} className="opacity-70">
                  {card}
                </div>
              );
            })}
          </div>

          <nav className="mt-10 flex flex-wrap gap-2">
            {[
              ["Characters", "/characters"],
              ["Evidence", "/evidence"],
              ["Tapes", "/tapes"],
              ["Motel Map", "/motel"],
              ["Room 14", "/room-14"],
              ["Devlog", "/devlog"],
              ["Press", "/press"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="mono rounded-sm border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[18px] transition-opacity hover:opacity-60 lg:text-[20px]"
    >
      {label}
    </Link>
  );
}
