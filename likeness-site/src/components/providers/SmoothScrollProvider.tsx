"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

/**
 * Lenis physics-based smooth scroll. Safari-safe defaults:
 * higher lerp, no syncTouch (prevents iOS stutter).
 *
 * Reduced motion: wheel smoothing is switched off, so Lenis passes wheel
 * events straight to native scrolling (no inertia). MotionConfig
 * reducedMotion="user" makes every framer-motion animation on the site skip
 * transform/layout movement for those visitors while keeping fades.
 * Neither wrapper renders DOM, so the tree is identical either way.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPref();
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: 0.1,
          smoothWheel: !reduced,
          syncTouch: false,
          wheelMultiplier: 1,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
