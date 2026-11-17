"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1.2 });
}

/** Media queries used with gsap.matchMedia() so every effect respects reduced motion. */
export const MOTION = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

/** Slow, luxurious curves. Nothing bouncy. */
export const EASE = {
  luxe: "expo.out",
  soft: "power3.out",
  inOut: "expo.inOut",
  drift: "power2.inOut",
} as const;

export { gsap, ScrollTrigger, useGSAP };
