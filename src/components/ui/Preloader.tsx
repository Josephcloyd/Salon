"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { markIntroReady } from "@/lib/intro";

/**
 * 1.5s intro: the "SM" monogram is drawn as a gold line, then the screen
 * parts like a curtain. Skipped entirely for reduced-motion users (CSS + JS).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useGSAP(
    () => {
      const release = () => {
        document.documentElement.classList.remove("is-loading");
        markIntroReady();
      };

      if (window.matchMedia(MOTION.reduce).matches) {
        release();
        setIsDone(true);
        return;
      }

      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const strokes = gsap.utils.toArray<SVGPathElement>("[data-draw]");
      strokes.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap
        .timeline({ onComplete: () => setIsDone(true) })
        .to(strokes, { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut", stagger: 0.1 })
        .to("[data-mono-fill]", { opacity: 1, duration: 0.4, ease: "power1.out" }, "-=0.35")
        .to("[data-mono]", { opacity: 0, scale: 0.94, duration: 0.4, ease: "power2.in" }, "+=0.05")
        .addLabel("part")
        .to("[data-curtain='left']", { xPercent: -100, duration: 1.1, ease: "expo.inOut" }, "part")
        .to("[data-curtain='right']", { xPercent: 100, duration: 1.1, ease: "expo.inOut" }, "part")
        .call(release, [], "part+=0.35");
    },
    { scope: root },
  );

  if (isDone) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[100] pointer-events-none" aria-hidden="true">
      <div data-curtain="left" className="absolute inset-y-0 left-0 w-1/2 bg-espresso" />
      <div data-curtain="right" className="absolute inset-y-0 right-0 w-1/2 bg-espresso" />
      <div data-mono className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="h-28 w-28 md:h-36 md:w-36" fill="none">
          <defs>
            <linearGradient id="mono-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8f6b38" />
              <stop offset="50%" stopColor="#ecd6a8" />
              <stop offset="100%" stopColor="#c9a66b" />
            </linearGradient>
          </defs>
          <g stroke="url(#mono-gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path data-draw d="M80 6 A74 74 0 1 1 79.9 6" />
            <path data-draw d="M71 55 C 66 45, 46 43, 43 56 C 40 69, 71 71, 71 89 C 71 107, 46 110, 38 98" />
            <path data-draw d="M84 106 L 84 52 L 102 86 L 120 52 L 120 106" />
          </g>
          <text data-mono-fill x="80" y="136" textAnchor="middle" fill="#c9a66b" opacity="0" fontSize="7" letterSpacing="3.5" fontFamily="var(--font-body)">
            MARAHUYO
          </text>
        </svg>
      </div>
    </div>
  );
}
