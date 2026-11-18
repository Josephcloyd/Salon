"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { countUp, revealUp } from "@/lib/animations";
import { formatNumber } from "@/lib/format";
import { stats } from "@/data/salon";

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        revealUp("[data-stat]", root.current!, { stagger: 0.12, start: "top 75%" });
        const counters = gsap.utils.toArray<HTMLElement>("[data-count]");
        counters.forEach((el) => (el.textContent = formatNumber(0, Number(el.dataset.decimals ?? 0))));
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 70%",
          once: true,
          onEnter: () =>
            counters.forEach((el, i) =>
              countUp(el, Number(el.dataset.count), { decimals: Number(el.dataset.decimals ?? 0), duration: 2.6, delay: i * 0.12 }),
            ),
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="stats-title" className="relative overflow-hidden bg-espresso py-28 md:py-36">
      <div className="light-leak opacity-60" aria-hidden="true" />
      <div className="gutter relative mx-auto max-w-[1440px]">
        <h2 id="stats-title" className="eyebrow text-center text-gold">
          <span className="inline-block px-3 py-2">Numbers that matter</span>
        </h2>
        <dl className="mt-16 grid grid-cols-2 gap-y-16 lg:grid-cols-4">
          {stats.map((stat) => {
            const final = `${formatNumber(stat.value, stat.decimals ?? 0)}${stat.suffix ?? ""}`;
            return (
              <div key={stat.label} data-stat className="flex flex-col-reverse items-center border-gold/20 px-4 text-center lg:border-l lg:first:border-l-0">
                <dt className="eyebrow mt-4 text-cream/75">{stat.label}</dt>
                <dd className="font-serif text-[clamp(3.5rem,8vw,7.5rem)] font-light leading-none text-cream">
                  <span className="sr-only">{final}</span>
                  <span aria-hidden="true">
                    <span data-count={stat.value} data-decimals={stat.decimals ?? 0} className="tabular-nums">
                      {formatNumber(stat.value, stat.decimals ?? 0)}
                    </span>
                    <span className="text-gold">{stat.suffix}</span>
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
