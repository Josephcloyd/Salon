"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION, EASE } from "@/lib/gsap";
import { fadeIn, revealUp } from "@/lib/animations";
import { artists } from "@/data/salon";

/** Portraits revealed by a bottom-to-top curtain; names settle in afterwards. */
export function Artists() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        revealUp("[data-artists-head] > *", root.current!, { stagger: 0.12 });
        gsap.utils.toArray<HTMLElement>("[data-artist]").forEach((card, i) => {
          const curtain = card.querySelector("[data-curtain]");
          const photo = card.querySelector("[data-photo]");
          const text = card.querySelectorAll("[data-artist-text]");
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true }, delay: (i % 3) * 0.12 })
            .fromTo(curtain, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: EASE.inOut })
            .fromTo(photo, { scale: 1.3 }, { scale: 1, duration: 2, ease: EASE.luxe }, 0)
            .from(text, { y: 24, autoAlpha: 0, duration: 1, ease: EASE.luxe, stagger: 0.1 }, "-=0.5");
        });
      });

      mm.add(MOTION.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-artist]").forEach((card) => fadeIn(card, card));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="artists" data-strand="loose" data-strand-x="0.9" aria-labelledby="artists-title" className="relative bg-espresso py-28 md:py-40">
      <div className="gutter mx-auto max-w-[1440px]">
        <header data-artists-head className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="eyebrow text-gold">Meet the Artists</p>
            <h2 id="artists-title" className="headline mt-6 text-cream">
              <span data-strand-wrap className="inline-block pr-2">
                The hands <em className="text-gold-light">behind</em>
              </span>
              <br />
              the light.
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-cream/75 md:justify-self-end">
            Six specialists, one standard. Trained in Manila, Seoul and London, each brings a signature, and the patience to make it yours.
          </p>
        </header>

        <ul className="mt-20 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {artists.map((artist, i) => (
            <li key={artist.id} data-artist className={`group ${i % 3 === 1 ? "lg:mt-24" : ""} ${i % 3 === 2 ? "lg:mt-12" : ""}`}>
              <figure>
                <div data-curtain className="relative aspect-[3/4] overflow-hidden bg-espresso-soft">
                  <div data-photo className="absolute inset-0 will-change-transform">
                    <Image
                      src={artist.image.src}
                      alt={artist.image.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="artist-photo object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="absolute left-5 top-4 font-serif text-xl italic text-cream/80">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <figcaption className="mt-6 flex items-baseline justify-between gap-4 border-t border-gold/25 pt-5">
                  <span data-artist-text className="font-serif text-3xl font-light text-cream">
                    {artist.name}
                  </span>
                  <span data-artist-text className="eyebrow max-w-[16ch] text-right text-[0.62rem] leading-relaxed text-gold-light">
                    {artist.title}
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
