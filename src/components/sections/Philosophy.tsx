"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { fadeIn } from "@/lib/animations";
import { philosophy } from "@/data/salon";

/** Pinned storytelling: three statements crossfade over parallaxing images. */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-layer]");
        const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]");
        gsap.set(layers.slice(1), { autoAlpha: 0 });
        gsap.set(ticks, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: `+=${layers.length * 110}%`,
            pin: true,
            scrub: 1.2,
          },
        });

        layers.forEach((layer, i) => {
          const image = layer.querySelector("[data-parallax]");
          const words = layer.querySelectorAll("[data-word]");
          tl.fromTo(image, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1, duration: 1 }, i);
          tl.to(ticks[i], { scaleX: 1, duration: 1 }, i);
          if (i > 0) {
            tl.to(layer, { autoAlpha: 1, duration: 0.3 }, i - 0.15);
            tl.from(words, { yPercent: 60, autoAlpha: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }, i);
          }
          if (i < layers.length - 1) {
            tl.to(words, { yPercent: -50, autoAlpha: 0, duration: 0.3, stagger: 0.03, ease: "power2.in" }, i + 0.6);
          }
        });
      });

      mm.add(MOTION.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-layer]").forEach((layer) => fadeIn(layer, layer));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="philosophy" data-strand="wave" data-strand-x="0.9" aria-labelledby="philosophy-title" className="relative bg-espresso">
      <div ref={stage} className="relative overflow-hidden motion-safe:h-[100svh]">
        <h2 id="philosophy-title" className="eyebrow gutter absolute left-0 top-24 z-20 text-gold">
          Our Philosophy
        </h2>

        {philosophy.map((item, i) => (
          <div
            key={item.text}
            data-layer
            className="relative flex h-[85svh] items-center justify-center overflow-hidden motion-safe:absolute motion-safe:inset-0 motion-safe:h-full"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div data-parallax className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
                <Image src={item.image.src} alt={item.image.alt} fill sizes="100vw" className="object-cover [filter:sepia(0.3)_saturate(0.85)_brightness(0.62)]" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(28_20_18/0.25),rgb(28_20_18/0.85))]" />
            </div>
            <div className="gutter relative z-10 text-center">
              <p className="headline-xl mx-auto max-w-[13ch] text-cream">
                {item.text.split(" ").map((word, wi) => (
                  <span key={wi} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <span data-word className={`inline-block ${i === philosophy.length - 1 ? "italic text-gold-light" : ""}`}>
                      {word}&nbsp;
                    </span>
                  </span>
                ))}
              </p>
              {item.translation && (
                <p data-word className="eyebrow mt-8 text-cream/75">
                  {item.translation}
                </p>
              )}
            </div>
            <span className="eyebrow gutter absolute bottom-10 right-0 z-10 font-serif text-cream/60" aria-hidden="true">
              0{i + 1} / 0{philosophy.length}
            </span>
          </div>
        ))}

        <div className="gutter absolute bottom-12 left-0 z-20 hidden gap-3 motion-safe:flex" aria-hidden="true">
          {philosophy.map((item) => (
            <span key={item.text} className="block h-px w-16 bg-cream/20">
              <span data-tick className="block h-full w-full bg-gold" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
