"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, salon } from "@/data/salon";
import { useLenis } from "./SmoothScroll";

const HIDE_AFTER = 160;

export function Navbar() {
  const lenis = useLenis();
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      if (Math.abs(y - last) < 6) return;
      setIsHidden(y > last && y > HIDE_AFTER);
      last = y;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    lenis?.stop();
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", handleKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKey);
    };
  }, [isMenuOpen, lenis]);

  const handleAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    if (!lenis || !href.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    e.preventDefault();
    lenis.start();
    lenis.scrollTo(target, { duration: 2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    history.replaceState(null, "", href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[transform,background-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
        } ${isScrolled ? "bg-espresso/55 backdrop-blur-xl" : "bg-transparent"}`}
      >
        <nav aria-label="Main" className="gutter flex h-[72px] items-center justify-between">
          <a href="#top" onClick={(e) => handleAnchor(e, "#top")} className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 font-serif text-sm text-gold">
              {salon.monogram}
            </span>
            <span className="eyebrow hidden text-cream sm:inline">Marahuyo</span>
          </a>
          <ul className="mr-[11rem] hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleAnchor(e, link.href)}
                  className="eyebrow relative text-cream/80 transition-colors duration-500 hover:text-gold after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-gold after:transition-transform after:duration-700 hover:after:origin-left hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Persistent controls: stay visible while the bar hides */}
      <div className="gutter pointer-events-none absolute right-0 top-0 flex h-[72px] items-center gap-3">
        <a
          href="#book"
          onClick={(e) => handleAnchor(e, "#book")}
         
          className="btn-gold pointer-events-auto !px-5 !py-3 !text-[0.65rem] md:!px-7"
        >
          Book Now
        </a>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="pointer-events-auto flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-cream/25 bg-espresso/40 backdrop-blur lg:hidden"
        >
          <span className={`h-px w-5 bg-cream transition-transform duration-500 ${isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-5 bg-cream transition-transform duration-500 ${isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 -z-10 flex flex-col justify-center bg-espresso gutter lg:hidden"
          >
            <ul className="space-y-4">
              {[...navLinks, { href: "#book", label: "Book" }].map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a href={link.href} onClick={(e) => handleAnchor(e, link.href)} className="font-serif text-5xl font-light text-cream">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="eyebrow mt-14 text-gold">{salon.hours.display}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
