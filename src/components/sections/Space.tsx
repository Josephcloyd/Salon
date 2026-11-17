"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION, EASE } from "@/lib/gsap";
import { fadeIn } from "@/lib/animations";
import { space } from "@/data/salon";

/** Zoom-through: the doorway grows until it fills the screen, then the rooms unfold. */
export function Space() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 768px)", ok: MOTION.ok }, (ctx) => {
        if (!ctx.conditions?.ok) return;
        const arch = ctx.conditions.desktop ? "inset(14% 35% 8% 35% round 15vw 15vw 0vw 0vw)" : "inset(18% 16% 10% 16% round 34vw 34vw 0vw 0vw)";
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stage.current, start: "top top", end: "+=160%", pin: true, scrub: 1.2 },
          })
          .fromTo("[data-door]", { clipPath: arch }, { clipPath: "inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)", duration: 1 }, 0)
          .fromTo("[data-door-img]", { scale: 1.45 }, { scale: 1, duration: 1 }, 0)
          .to("[data-space-intro]", { y: -80, autoAlpha: 0, duration: 0.45 }, 0)
          .fromTo("[data-door-shade]", { opacity: 0.1 }, { opacity: 0.55, duration: 0.4 }, 0.6)
          .fromTo("[data-inside] > *", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.08 }, 0.65);

        gsap.utils.toArray<HTMLElement>("[data-room]").forEach((room, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: room, start: "top 85%", once: true }, delay: i * 0.12 })
            .fromTo(room.querySelector("[data-room-img]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.inOut })
            .from(room.querySelectorAll("[data-room-text]"), { y: 20, autoAlpha: 0, duration: 1, ease: EASE.luxe, stagger: 0.1 }, "-=0.4");
        });
      });

      mm.add(MOTION.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-room]").forEach((room) => fadeIn(room, room));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="space" data-strand="sleek" data-strand-x="0.94" aria-labelledby="space-title" className="relative bg-espresso">
      <div ref={stage} className="relative h-[100svh] overflow-hidden">
        <div data-door className="absolute inset-0">
          <div data-door-img className="absolute inset-0 will-change-transform">
            <Image src={space.doorway.src} alt={space.doorway.alt} fill sizes="100vw" className="object-cover [filter:sepia(0.35)_saturate(0.85)_brightness(0.8)]" />
          </div>
          <div data-door-shade className="absolute inset-0 bg-espresso opacity-50" />
          <div data-inside className="gutter absolute inset-0 motion-reduce:hidden flex flex-col items-center justify-center text-center">
            <p className="eyebrow text-gold-light motion-safe:opacity-0">Welcome in</p>
            <p className="headline-xl mt-4 text-cream motion-safe:opacity-0">
              Pasok <em className="text-gold-light">po.</em>
            </p>
          </div>
        </div>

        <div data-space-intro className="gutter pointer-events-none absolute inset-0 flex flex-col justify-between py-28">
          <div>
            <p className="eyebrow text-gold">The Space</p>
            <h2 id="space-title" className="headline mt-6 max-w-[8ch] text-cream">
              Step <em className="text-gold-light">inside.</em>
            </h2>
          </div>
          <p className="max-w-xs self-end text-right leading-relaxed text-cream/75">
            A second-floor sanctuary above 9th Avenue: warm brass, soft linen, natural light.
          </p>
        </div>
      </div>

      <div className="gutter mx-auto max-w-[1440px] py-28 md:py-36">
        <h3 className="sr-only">Rooms at Salon Marahuyo</h3>
        <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
          {space.rooms.map((room, i) => (
            <li key={room.title} data-room className={i === 1 ? "md:mt-24" : ""}>
              <div data-room-img className="relative aspect-[4/5] overflow-hidden">
                <Image src={room.image.src} alt={room.image.alt} fill sizes="(min-width: 768px) 32vw, 100vw" className="object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105" />
              </div>
              <p data-room-text className="mt-6 font-serif text-3xl font-light text-cream">
                {room.title}
              </p>
              <p data-room-text className="mt-2 text-cream/70">
                {room.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
