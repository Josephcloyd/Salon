"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import type { Transformation } from "@/data/salon";

interface BeforeAfterProps {
  item: Transformation;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** Draggable / keyboard-operable before–after comparison with a gold handle. */
export function BeforeAfter({ item }: BeforeAfterProps) {
  const frame = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const sweep = useRef<gsap.core.Timeline | null>(null);
  const [pos, setPos] = useState(50);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const state = { v: 50 };
        const tl = gsap
          .timeline({ paused: true, onUpdate: () => setPos(state.v) })
          .to(state, { v: 82, duration: 1.1, ease: "power2.inOut" })
          .to(state, { v: 18, duration: 1.5, ease: "power2.inOut" })
          .to(state, { v: 50, duration: 1.1, ease: "power2.inOut" });
        sweep.current = tl;
        ScrollTrigger.create({ trigger: frame.current, start: "top 70%", once: true, onEnter: () => tl.play() });
      });
    },
    { scope: frame },
  );

  const stopSweep = () => {
    sweep.current?.kill();
    sweep.current = null;
  };

  const moveTo = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    stopSweep();
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 };
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      stopSweep();
      setPos(e.key === "Home" ? 0 : 100);
      return;
    }
    if (!(e.key in deltas)) return;
    e.preventDefault();
    stopSweep();
    setPos((p) => clamp(p + deltas[e.key]));
  };

  return (
    <figure>
      <div
        ref={frame}
       
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => isDragging.current && moveTo(e.clientX)}
        onPointerUp={() => (isDragging.current = false)}
        onPointerCancel={() => (isDragging.current = false)}
        className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden bg-espresso-soft"
      >
        <Image src={item.after.src} alt={item.after.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={item.before.src}
            alt={item.before.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className={`object-cover ${item.simulateBefore ? "simulate-before" : ""}`}
            draggable={false}
          />
        </div>

        <span className="eyebrow absolute left-4 top-4 rounded-full bg-espresso/70 px-3 py-1.5 text-[0.6rem] text-cream backdrop-blur">Before</span>
        <span className="eyebrow absolute right-4 top-4 rounded-full bg-gold/90 px-3 py-1.5 text-[0.6rem] text-espresso">After</span>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-[2px] bg-gradient-to-b from-gold/0 via-gold to-gold/0" />
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Before and after comparison: ${item.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)}% before`}
            onKeyDown={handleKey}
            className="pointer-events-auto absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-light bg-gold text-espresso shadow-[0_10px_40px_-10px_rgb(201_166_107/0.9)]"
          >
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
              <path d="M6 1 1 6l5 5M16 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <figcaption className="mt-5 flex items-baseline justify-between gap-4">
        <span className="font-serif text-2xl text-cream">{item.title}</span>
        <span className="eyebrow text-right text-[0.6rem] text-gold-light">
          {item.service} · {item.artist}
        </span>
      </figcaption>
    </figure>
  );
}
