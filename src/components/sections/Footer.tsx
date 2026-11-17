"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { primeStroke } from "@/lib/animations";
import { navLinks, salon } from "@/data/salon";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const flourish = root.current?.querySelector<SVGPathElement>("[data-flourish]");
        if (!flourish) return;
        primeStroke(flourish);
        gsap.to(flourish, { strokeDashoffset: 0, duration: 3.2, ease: "power2.inOut", scrollTrigger: { trigger: flourish, start: "top 98%", once: true } });
      });
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="relative overflow-hidden bg-[#140e0c] pt-24 text-cream" aria-labelledby="footer-title">
      <div className="gutter mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 id="footer-title" className="font-serif text-6xl font-light md:text-7xl">
            Salon <em className="text-gold-light">Marahuyo</em>
          </h2>
          <p className="mt-4 max-w-sm text-cream/70">Marahuyo (n.): to be enchanted, bewitched by beauty.</p>

          <address className="mt-12 grid gap-8 not-italic sm:grid-cols-2">
            <div>
              <p className="eyebrow text-[0.6rem] text-gold-light">Visit</p>
              <p className="mt-3 leading-relaxed text-cream/85">{salon.address.display}</p>
            </div>
            <div>
              <p className="eyebrow text-[0.6rem] text-gold-light">Hours</p>
              <p className="mt-3 leading-relaxed text-cream/85">{salon.hours.display}</p>
            </div>
            <div>
              <p className="eyebrow text-[0.6rem] text-gold-light">Call</p>
              <p className="mt-3 leading-relaxed text-cream/85">
                Phone: <a href={salon.phone.landlineHref} className="underline-offset-4 hover:text-gold hover:underline">{salon.phone.landline}</a>
                <br />
                Mobile: <a href={salon.phone.mobileHref} className="underline-offset-4 hover:text-gold hover:underline">{salon.phone.mobile}</a>
              </p>
            </div>
            <div>
              <p className="eyebrow text-[0.6rem] text-gold-light">Pay</p>
              <p className="mt-3 leading-relaxed text-cream/85">{salon.payments}</p>
            </div>
          </address>

          <div className="mt-12 flex flex-wrap items-center gap-8">
            <a href={salon.social.instagram} target="_blank" rel="noopener noreferrer" className="eyebrow text-cream/80 transition-colors hover:text-gold">
              Instagram ↗
            </a>
            <a href={salon.social.facebook} target="_blank" rel="noopener noreferrer" className="eyebrow text-cream/80 transition-colors hover:text-gold">
              Facebook ↗
            </a>
            <nav aria-label="Footer" className="flex flex-wrap gap-6">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="eyebrow text-cream/60 transition-colors hover:text-gold">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-gold/25 lg:aspect-auto lg:min-h-[420px]">
          <iframe
            title="Map showing Salon Marahuyo at 9th Avenue corner 28th Street, BGC, Taguig"
            src={salon.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.35)_contrast(0.95)_brightness(0.85)]"
          />
        </div>
      </div>

      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="mt-20 block h-24 w-full" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="flourish-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a66b" stopOpacity="0" />
            <stop offset="20%" stopColor="#c9a66b" />
            <stop offset="55%" stopColor="#f0dcb0" />
            <stop offset="100%" stopColor="#c9a66b" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          data-flourish
          d="M0 80 C 180 20, 300 110, 460 70 S 680 10, 720 60 C 745 92, 700 110, 690 86 C 680 62, 730 48, 760 64 C 840 104, 980 30, 1120 62 S 1360 96, 1440 40"
          stroke="url(#flourish-gold)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>

      <div className="gutter mx-auto flex max-w-[1440px] flex-col justify-between gap-4 border-t border-cream/10 py-8 text-xs text-cream/60 md:flex-row">
        <p>© {year} Salon Marahuyo. All rights reserved.</p>
        <p>Bonifacio Global City, Taguig · Ganda na ramdam mo.</p>
      </div>
    </footer>
  );
}
