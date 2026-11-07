"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const routes = [
  { label: "Works", href: "/works" },
  { label: "Studio", href: "/studio" },
  { label: "Universe", href: "/universe" },
  { label: "Characters", href: "/characters" },
  { label: "The Street", href: "/street" },
  { label: "Wardrobe", href: "/wardrobe" },
  { label: "Score", href: "/score" },
  { label: "Journey", href: "/journey" },
  { label: "Room Testifies", href: "/room-testifies" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
          scrolled || open ? "py-3" : "py-5"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-md px-5 py-2.5 transition-all duration-300 ${
            scrolled || open ? "glass" : "bg-transparent"
          }`}
          style={{ width: "calc(100% - 2rem)" }}
        >
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5"
          >
            <span className="grid h-6 w-6 place-items-center rounded-sm bg-accent text-[11px] font-bold text-black">
              ◊
            </span>
            <span className="mono text-sm font-bold tracking-[0.35em]">OVS</span>
            <span className="mono hidden text-[10px] tracking-[0.3em] text-muted sm:inline">
              {"// TAPE-03"}
            </span>
          </a>

          {/* desktop links */}
          <div className="hidden items-center gap-x-4 gap-y-1 lg:flex">
            {routes.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="mono text-[11px] tracking-[0.15em] text-teal/80 uppercase transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/prompts"
              className="mono hidden rounded-sm bg-accent px-5 py-2 text-[11px] font-semibold tracking-[0.15em] text-black uppercase transition-transform hover:scale-105 lg:inline-block"
            >
              Prompt Library
            </Link>

            {/* mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative grid h-9 w-9 place-items-center rounded-sm border border-white/15 lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <span className="relative flex h-3.5 w-4 flex-col justify-between">
                <span
                  className={`h-px w-full bg-foreground transition-all duration-300 ${
                    open ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-foreground transition-all duration-300 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-foreground transition-all duration-300 ${
                    open ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* mobile overlay menu */}
      <div
        className={`grain fixed inset-0 z-[90] flex flex-col bg-background/97 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mt-24 flex flex-1 flex-col overflow-y-auto px-8 pb-10">
          <span className="mono mb-6 text-[10px] tracking-[0.4em] text-accent">
            LIKENESS UNIVERSE // INDEX
          </span>
          <nav className="flex flex-col">
            {routes.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`group flex items-baseline justify-between border-b border-white/10 py-4 transition-colors ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{
                  transition: `opacity 400ms ${i * 40}ms, transform 400ms ${
                    i * 40
                  }ms, color 200ms`,
                }}
              >
                <span className="text-2xl font-extrabold tracking-tight text-foreground group-hover:text-accent">
                  {l.label}
                </span>
                <span className="mono text-[10px] tracking-[0.2em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>
          <Link
            href="/prompts"
            onClick={() => setOpen(false)}
            className="mono mt-8 rounded-sm bg-accent px-5 py-3 text-center text-[11px] font-semibold tracking-[0.2em] text-black uppercase"
          >
            Open the Prompt Library
          </Link>
        </div>
      </div>
    </>
  );
}
