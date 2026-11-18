"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { revealUp } from "@/lib/animations";
import { bookingBackdrop, salon } from "@/data/salon";
import { BookingForm } from "./BookingForm";

export function Booking() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        revealUp("[data-book-intro] > *", root.current!, { stagger: 0.1 });
        revealUp("[data-book-form]", root.current!, { y: 60, start: "top 70%" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="book" aria-labelledby="book-title" className="relative overflow-hidden bg-espresso py-28 md:py-40">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={bookingBackdrop.src} alt="" fill sizes="100vw" quality={50} className="object-cover opacity-25 [filter:sepia(0.5)_brightness(0.6)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1c1412_0%,rgb(28_20_18/0.75)_40%,#1c1412_100%)]" />
      </div>
      <div className="light-leak" aria-hidden="true" />

      <div className="gutter relative mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div data-book-intro>
          <p className="eyebrow text-gold">Your chair awaits</p>
          <h2 id="book-title" className="headline mt-6 text-cream">
            Book an <em className="text-gold-light">Appointment</em>
          </h2>
          <p className="mt-8 max-w-md leading-relaxed text-cream/75">
            Tell us what you have in mind and we&apos;ll match you with the right artist. Walk-ins are welcome, but your favourite chair fills quickly on weekends.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={salon.social.messenger} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.99-.88c.17-.07.36-.09.54-.04.9.25 1.87.39 2.89.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2Zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63Z" />
              </svg>
              Message us on Messenger
            </a>
            <a href={salon.social.viber} className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 2.5c5 0 8.5 2.6 8.5 8.3 0 5.4-3.4 8-8.5 8-.9 0-1.8-.1-2.6-.3L6 21v-3.4C4.2 16.3 3.5 14 3.5 10.8 3.5 5.1 7 2.5 12 2.5Z" strokeLinejoin="round" />
                <path d="M9.2 7.6c.4-.4 1-.3 1.3.1l.7 1c.2.4.2.8-.1 1.1l-.4.4c.4 1 1.2 1.9 2.2 2.3l.4-.4c.3-.3.8-.3 1.1-.1l1 .7c.4.3.5.9.1 1.3l-.5.5c-.6.6-1.6.7-2.4.3a8.6 8.6 0 0 1-3.9-3.9c-.4-.8-.3-1.8.3-2.4l.2-.4Z" />
              </svg>
              Chat on Viber
            </a>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-gold/25 pt-8 text-sm">
            <div>
              <dt className="eyebrow text-[0.6rem] text-gold-light">Call</dt>
              <dd className="mt-2 text-cream/85">
                <a href={salon.phone.mobileHref} className="hover:text-gold">{salon.phone.mobile}</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.6rem] text-gold-light">Open</dt>
              <dd className="mt-2 text-cream/85">Daily, 10 AM – 9 PM</dd>
            </div>
          </dl>
        </div>

        <div data-book-form className="lg:pt-6">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
