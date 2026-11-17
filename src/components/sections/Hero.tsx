"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION, EASE } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";
import { hero, salon } from "@/data/salon";
import { SplitLetters } from "@/components/ui/SplitLetters";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
        gsap.set(letters, { yPercent: 115 });
        gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 24 });

        const intro = gsap
          .timeline({ paused: true })
          .to(letters, { yPercent: 0, duration: 1.5, ease: EASE.luxe, stagger: 0.035 })
          .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE.luxe, stagger: 0.18 }, "-=1.1");

        const unsubscribe = onIntroReady(() => {
          intro.play();
          if (hero.video) setIsVideoOn(true);
        });

        // Pull back from 1.3x as the user scrolls
        gsap.fromTo(
          "[data-hero-media]",
          { scale: 1.3 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } },
        );
        gsap.to("[data-hero-content]", {
          yPercent: -25,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
        });

        // Letterbox bars part on the first scroll, like a film starting
        const bars = gsap
          .timeline({ paused: true })
          .to("[data-letterbox='top']", { yPercent: -100, duration: 1.6, ease: EASE.inOut })
          .to("[data-letterbox='bottom']", { yPercent: 100, duration: 1.6, ease: EASE.inOut }, "<");
        ScrollTrigger.create({
          trigger: root.current,
          start: "top+=2 top",
          onEnter: () => bars.play(),
          onLeaveBack: () => bars.reverse(),
        });

        return unsubscribe;
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-strand="loose"
      data-strand-x="0.8"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-espresso"
    >
      <div data-hero-media className="absolute inset-0 will-change-transform motion-safe:scale-[1.3]">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%] [filter:sepia(0.45)_saturate(0.85)_hue-rotate(12deg)_brightness(0.72)_contrast(1.05)]"
        />
        {isVideoOn && hero.video && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src={hero.video.src} type={hero.video.type} />
          </video>
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(28_20_18/0.55)_0%,rgb(28_20_18/0.05)_40%,rgb(28_20_18/0.35)_70%,#1c1412_100%)]" />
      <div className="light-leak" aria-hidden="true" />

      <div data-hero-content className="gutter relative z-10 flex h-full flex-col justify-end pb-[17svh]">
        <p data-hero-fade className="eyebrow text-gold-light">
          {salon.name} <span className="mx-2 text-gold">·</span> {salon.locationLabel}
        </p>
        <h1 id="hero-title" className="headline-xl mt-6 max-w-[11ch] text-cream">
          <span className="sr-only">{salon.tagline}</span>
          <SplitLetters segments={[{ text: "Where beauty finds its" }, { text: "light.", className: "italic text-gold-light" }]} />
        </h1>
        <div data-hero-fade className="mt-12 flex items-end justify-between gap-8">
          <a href="#philosophy" className="group flex items-center gap-4 text-cream/80">
            <span className="relative block h-14 w-px overflow-hidden bg-cream/20">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/3 bg-gold" />
            </span>
            <span className="eyebrow transition-colors duration-500 group-hover:text-gold">Scroll to begin</span>
          </a>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-cream/70 md:block">
            Hair, color, nails, lashes and bridal artistry on 9th Avenue, Bonifacio Global City.
          </p>
        </div>
      </div>

      <div data-letterbox="top" aria-hidden="true" className="absolute inset-x-0 top-0 z-20 h-[10svh] bg-black motion-reduce:hidden" />
      <div data-letterbox="bottom" aria-hidden="true" className="absolute inset-x-0 bottom-0 z-20 h-[10svh] bg-black motion-reduce:hidden" />
    </section>
  );
}
