"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, MOTION } from "@/lib/gsap";
import { isIntroReady, onIntroReady } from "@/lib/intro";

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null when reduced motion is on (native scroll). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/** Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia(MOTION.reduce).matches) return;

    const instance = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (!isIntroReady()) instance.stop();
    const unsubscribe = onIntroReady(() => instance.start());
    setLenis(instance);

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
