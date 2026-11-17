"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTilt } from "@/hooks/useTilt";
import { formatPeso } from "@/lib/format";
import { startingPrice, type Service } from "@/data/salon";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  useTilt(tiltRef);

  return (
    <article data-service-card className="group relative h-[68svh] max-h-[680px] min-h-[440px] shrink-0 lg:h-[72svh] lg:w-[26vw] lg:min-w-[320px] lg:max-w-[420px]">
      <div ref={tiltRef} className="relative h-full w-full overflow-hidden rounded-[2px] bg-espresso-soft will-change-transform">
        <div data-service-img className="absolute inset-0 will-change-transform">
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            sizes="(min-width: 1024px) 26vw, 100vw"
            className="object-cover transition-transform duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] [filter:sepia(0.2)_saturate(0.9)_brightness(0.85)]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(28_20_18/0.35)_0%,transparent_35%,rgb(28_20_18/0.92)_100%)]" />

        <span className="absolute left-6 top-5 font-serif text-5xl font-light italic text-gold-light">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-6 bottom-7">
          <h3 className="font-serif text-4xl font-light leading-none text-cream">{service.title}</h3>
          <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-cream/80">{service.line}</p>
          <div className="mt-6 flex items-center justify-between border-t border-gold/35 pt-4">
            <p className="eyebrow text-gold-light">from {formatPeso(startingPrice(service.categoryId))}</p>
            <a href="#menu" className="eyebrow text-cream/70 transition-colors duration-500 hover:text-gold" aria-label={`See ${service.title} prices`}>
              Menu →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
