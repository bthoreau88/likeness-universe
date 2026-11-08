"use client";

import { useSyncExternalStore } from "react";

// Hydration-safe, live `prefers-reduced-motion` flag.
// The server snapshot is always `false`, so the first client render matches the
// static HTML. React then re-renders with the real preference, and keeps
// following it if the visitor changes their OS setting mid-visit.
// (framer-motion's useReducedMotion reads matchMedia during the first render
// and never updates, which risks a hydration mismatch in static export.)
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function useReducedMotionPref(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
