// Original LIKENESS source-still scroll sequences. The old 169-frame superhero
// demo sources are retired from all runtime references. These existing site
// stills are a temporary source-authority-safe solution until a dedicated
// approved Thoreau/Drya/Other motion plate is authored.
import { asset } from "./base";
import { SCROLL_SEQUENCES } from "./registry";

export const HERO = {
  count: SCROLL_SEQUENCES.street.length,
  path: (i: number) =>
    asset(SCROLL_SEQUENCES.street[Math.max(0, Math.min(i - 1, SCROLL_SEQUENCES.street.length - 1))]),
};

export const CINE = {
  count: SCROLL_SEQUENCES.home.length,
  path: (i: number) =>
    asset(SCROLL_SEQUENCES.home[Math.max(0, Math.min(i - 1, SCROLL_SEQUENCES.home.length - 1))]),
};

// Scroll "beat" cards shown over the cinematic reveal. show/hide are 0–1 scroll
// progress thresholds. Rewrite the copy to match your game's lore.
export type Beat = {
  id: string;
  show: number;
  hide: number;
  index: string;
  title: string;
  quote: string;
  source: string;
};

export const BEATS: Beat[] = [
  {
    id: "beat-1",
    show: 0.1,
    hide: 0.3,
    index: "01",
    title: "WAKE",
    quote: "You wake at 3:14 with a wound you can't explain.",
    source: "OVS // TAPE-03 · SCENE 01",
  },
  {
    id: "beat-2",
    show: 0.38,
    hide: 0.58,
    index: "02",
    title: "THE OTHER",
    quote: "Someone with your voice is already inside the room.",
    source: "OVS // THE OTHER",
  },
  {
    id: "beat-3",
    show: 0.64,
    hide: 0.84,
    index: "03",
    title: "THE RECORD",
    quote: "The room remembers what you edited out.",
    source: "OVS // THE ROOM TESTIFIES",
  },
];
