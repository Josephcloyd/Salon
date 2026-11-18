"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { fadeIn, revealUp } from "@/lib/animations";
import { services } from "@/data/salon";
import { ServiceCard } from "./ServiceCard";

/** Desktop: pinned horizontal gallery. Mobile / reduced motion: vertical reveals. */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        const trackEl = track.current;
        if (!trackEl) return;
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

        const horizontal = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: viewport.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card) => {
          gsap.fromTo(
            card.querySelector("[data-service-img]"),
            { scale: 1.28 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true } },
          );
        });
        revealUp("[data-services-intro] > *", root.current!, { stagger: 0.12 });
      });

      mm.add(MOTION.mobile, () => {
        revealUp("[data-services-intro] > *", root.current!, { stagger: 0.12 });
        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card) => {
          revealUp(card, card, { y: 60 });
          gsap.fromTo(
            card.querySelector("[data-service-img]"),
            { scale: 1.2 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });

      mm.add(MOTION.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card) => fadeIn(card, card));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="relative bg-espresso py-24 lg:py-0">
      <div ref={viewport} className="overflow-hidden lg:motion-safe:flex lg:motion-safe:h-[100svh] lg:motion-safe:items-center">
        <div
          ref={track}
          className="gutter flex flex-col gap-10 lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-[3vw] lg:motion-safe:pr-[12vw] lg:motion-reduce:grid lg:motion-reduce:grid-cols-3 lg:motion-reduce:py-32"
        >
          <header data-services-intro className="shrink-0 lg:motion-safe:w-[34vw] lg:motion-safe:pr-[4vw] lg:motion-reduce:col-span-3">
            <p className="eyebrow text-gold">Services · 01–06</p>
            <h2 id="services-title" className="headline mt-6 text-cream">
              The art of <em className="text-gold-light">being seen.</em>
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-cream/75">
              Six disciplines under one roof, each led by a specialist. Every visit begins with a free consultation, never a script.
            </p>
            <p className="eyebrow mt-10 hidden items-center gap-4 text-cream/60 lg:motion-safe:flex" aria-hidden="true">
              Keep scrolling <span className="block h-px w-16 bg-gold/60" />
            </p>
          </header>

          {services.map((service, i) => (
            <ServiceCard key={service.categoryId} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
