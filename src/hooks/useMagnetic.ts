"use client";

import { useEffect, type RefObject } from "react";
import { gsap, MOTION } from "@/lib/gsap";

/**
 * Pulls an element gently toward the cursor while hovered.
 * Fine pointers + motion-OK only; resets with a slow, non-bouncy ease.
 */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.3): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(`${MOTION.finePointer} and ${MOTION.ok}`).matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength]);
}
