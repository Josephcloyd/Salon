"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { fadeIn, revealUp } from "@/lib/animations";
import { testimonialBackdrop, testimonials } from "@/data/salon";

const DRIFT = [-18, 10, -8, 16] as const;
const OFFSET = ["md:mt-0", "md:mt-40", "md:-mt-10", "md:mt-28"] as const;

/** Quote cards drifting at different parallax speeds over a blurred golden haze. */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        revealUp("[data-quote-head] > *", root.current!, { stagger: 0.12 });
        gsap.utils.toArray<HTMLElement>("[data-quote]").forEach((card) => revealUp(card, card, { y: 60 }));
        gsap.fromTo("[data-haze]", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      mm.add(MOTION.desktop, () => {
        gsap.utils.toArray<HTMLElement>("[data-quote]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { yPercent: -DRIFT[i % DRIFT.length] },
            { yPercent: DRIFT[i % DRIFT.length], rotate: i % 2 ? 0.6 : -0.6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.5 } },
          );
        });
      });
      mm.add(MOTION.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-quote]").forEach((card) => fadeIn(card, card));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="quotes-title" className="relative overflow-hidden bg-espresso py-32 md:py-48">
      <div data-haze className="absolute -inset-y-[10%] inset-x-0" aria-hidden="true">
        <Image src={testimonialBackdrop.src} alt="" fill sizes="50vw" quality={40} className="scale-125 object-cover opacity-45 blur-3xl [filter:sepia(0.8)_saturate(1.4)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_30%_30%,rgb(201_166_107/0.4),transparent_70%),radial-gradient(45%_40%_at_75%_70%,rgb(232_213_200/0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-espresso/45" />
      </div>

      <div className="gutter relative mx-auto max-w-6xl">
        <header data-quote-head className="text-center">
          <p className="eyebrow text-gold-light">Kind Words</p>
          <h2 id="quotes-title" className="headline mt-6 text-cream">
            In their <em className="text-gold-light">own words.</em>
          </h2>
        </header>

        <ul className="mt-20 grid gap-8 md:grid-cols-2 md:gap-x-14">
          {testimonials.map((t, i) => (
            <li key={t.name} data-quote className={`will-change-transform ${OFFSET[i % OFFSET.length]}`}>
              <figure className="relative border border-gold/30 bg-espresso-soft/90 p-8 md:p-12">
                <span className="absolute -top-7 left-8 font-serif text-8xl leading-none text-gold" aria-hidden="true">
                  “
                </span>
                <blockquote className="font-serif text-2xl font-light leading-snug text-cream md:text-[1.9rem]">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="block h-px w-10 bg-gold" aria-hidden="true" />
                  <span className="eyebrow text-cream/85">
                    {t.name} <span className="text-gold-light">· {t.city}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
