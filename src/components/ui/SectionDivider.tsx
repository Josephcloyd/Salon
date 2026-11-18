"use client";

import { useEffect, useRef, useState } from "react";
import { formatChapter } from "@/lib/format";

interface SectionDividerProps {
  chapter: number;
  label: string;
}

/**
 * Editorial chapter break: two gold hairlines draw outward from a centred
 * chapter number when the divider scrolls into view. One IntersectionObserver,
 * CSS transforms only, so it costs nothing while scrolling.
 */
export function SectionDivider({ chapter, label }: SectionDividerProps) {
  const root = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="chapter-divider gutter" data-visible={isVisible} aria-hidden="true">
      <span className="chapter-divider__line chapter-divider__line--left" />
      <span className="chapter-divider__mark">
        <span className="font-serif text-2xl italic text-gold">{formatChapter(chapter)}</span>
        <span className="eyebrow text-[0.6rem] text-cream/60">{label}</span>
      </span>
      <span className="chapter-divider__line chapter-divider__line--right" />
    </div>
  );
}
