"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { fadeIn, revealUp } from "@/lib/animations";
import { transformations } from "@/data/salon";
import { BeforeAfter } from "./BeforeAfter";

export function Transformations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        revealUp("[data-tf-head] > *", root.current!, { stagger: 0.12 });
        gsap.utils.toArray<HTMLElement>("[data-tf]").forEach((el, i) => revealUp(el, el, { y: 70, delay: (i % 3) * 0.1 }));
      });
      mm.add(MOTION.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-tf]").forEach((el) => fadeIn(el, el));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="transformations" data-strand="curl" data-strand-x="0.93" aria-labelledby="tf-title" className="relative bg-espresso-soft py-28 md:py-40">
      <div className="gutter mx-auto max-w-[1440px]">
        <header data-tf-head className="max-w-3xl">
          <p className="eyebrow text-gold">Transformations</p>
          <h2 id="tf-title" className="headline mt-6 text-cream">
            Perms, color <em className="text-gold-light">&amp; quiet miracles.</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cream/75">Drag the gold handle to see the difference a single afternoon makes.</p>
        </header>
        <ul className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {transformations.map((item, i) => (
            <li key={item.id} data-tf className={i === 1 ? "lg:mt-20" : ""}>
              <BeforeAfter item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
