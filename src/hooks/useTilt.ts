"use client";

import { useEffect, type RefObject } from "react";
import { gsap, MOTION } from "@/lib/gsap";

const TILT_QUERY = `(min-width: 1024px) and ${MOTION.finePointer} and ${MOTION.ok}`;

/** Subtle 3D tilt that follows the cursor. Desktop + fine pointer + motion-OK only. */
export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, maxDegrees = 6): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(TILT_QUERY).matches) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
    const rx = gsap.quickTo(el, "rotationX", { duration: 1, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 1, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * maxDegrees * 2);
      rx(-py * maxDegrees * 2);
    };
    const handleLeave = () => {
      rx(0);
      ry(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, [ref, maxDegrees]);
}
