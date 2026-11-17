"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP, MOTION, EASE } from "@/lib/gsap";
import { countUp, revealUp } from "@/lib/animations";
import { formatPeso, formatPrice } from "@/lib/format";
import { menu, menuNote } from "@/data/salon";

/** Fine-dining style price menu with tabs, self-drawing gold rules and counting prices. */
export function PriceMenu() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasEntered = useRef(false);
  const [active, setActive] = useState(0);
  const category = menu[active];

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.set("[data-row]", { autoAlpha: 0 });
        revealUp("[data-menu-head] > *", root.current!, { stagger: 0.1 });
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, ease: "none", transformOrigin: "left center", scrollTrigger: { trigger: rule, start: "top 92%", end: "top 55%", scrub: 1 } },
          );
        });
      });
      ScrollTrigger.create({
        trigger: list.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          hasEntered.current = true;
          animateRows();
        },
      });
    },
    { scope: root },
  );

  const animateRows = contextSafe(() => {
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", list.current);
    if (window.matchMedia(MOTION.reduce).matches) {
      gsap.fromTo(rows, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
      return;
    }
    gsap.fromTo(rows, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.luxe, stagger: 0.08 });
    rows.forEach((row, i) => {
      gsap.fromTo(row.querySelector("[data-row-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: EASE.inOut, delay: 0.1 + i * 0.08 });
      const price = row.querySelector<HTMLElement>("[data-price]");
      if (price) countUp(price, Number(price.dataset.price), { format: formatPeso, duration: 1.8, delay: 0.15 + i * 0.08 });
    });
  });

  // Re-run the row animation whenever the tab changes (after first reveal)
  useGSAP(
    () => {
      if (hasEntered.current) animateRows();
    },
    { dependencies: [active], scope: root },
  );

  const handleTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: menu.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + menu.length) % menu.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section ref={root} id="menu" data-strand="sleek" data-strand-x="0.94" aria-labelledby="menu-title" className="on-cream relative bg-cream py-28 text-ink md:py-40">
      <div className="gutter mx-auto max-w-6xl">
        <header data-menu-head className="text-center">
          <p className="eyebrow text-gold-deep">The Menu</p>
          <h2 id="menu-title" className="headline mt-6">
            <span data-strand-wrap className="inline-block px-2">
              Price <em className="text-gold-deep">Menu</em>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink/70">Served à la carte. Every service begins with a conversation.</p>
        </header>

        <div data-rule className="mx-auto mt-14 h-px max-w-3xl bg-gold" aria-hidden="true" />

        <div role="tablist" aria-label="Service categories" className="relative mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-10">
          {menu.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${c.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => handleTabKey(e, i)}
                className={`eyebrow relative py-3 transition-colors duration-500 ${isActive ? "text-ink" : "text-ink/60 hover:text-gold-deep"}`}
              >
                {c.title}
                {isActive && (
                  <motion.span
                    layoutId="menu-underline"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-gold"
                    transition={{ type: "tween", duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id={`panel-${category.id}`} aria-labelledby={`tab-${category.id}`} tabIndex={0} className="mx-auto mt-14 max-w-3xl">
          <h3 className="sr-only">{category.title}</h3>
          <ul ref={list} key={category.id}>
            {category.items.map((item) => (
              <li key={item.name} data-row className="relative flex items-baseline gap-4 py-6">
                <span className="font-serif text-2xl font-normal leading-tight md:text-3xl">{item.name}</span>
                <span className="mb-1.5 flex-1 border-b border-dotted border-ink/25" aria-hidden="true" />
                <span className="shrink-0 text-right">
                  {item.from && <span className="mr-2 font-serif text-lg italic text-gold-deep">from</span>}
                  <span className="sr-only">{formatPrice(item)}</span>
                  <span aria-hidden="true" data-price={item.price} className="font-serif text-2xl tabular-nums md:text-3xl">
                    {formatPeso(item.price)}
                  </span>
                </span>
                <span data-row-line className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold/50" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <div data-rule className="mx-auto mt-14 h-px max-w-3xl bg-gold" aria-hidden="true" />
        <p className="mx-auto mt-8 max-w-xl text-center font-serif text-lg italic leading-relaxed text-ink/75">{menuNote}</p>
      </div>
    </section>
  );
}
