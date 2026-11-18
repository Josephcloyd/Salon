# Salon Marahuyo

Cinematic single-page site for Salon Marahuyo, BGC, Taguig.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm test             # unit tests (vitest)
npm run test:coverage
```

## Editing content

Everything editable lives in **`src/data/salon.ts`**: business details, hours, phones, social links,
price menu, service cards, artists, transformations, stats, testimonials and all image URLs.
Service-card "from ₱…" prices are derived from the menu automatically.

- **Hero video:** set `hero.video = { src: "/hero.mp4", type: "video/mp4" }` (file in `public/`). It loads only after the intro.
- **Before/after photos:** supply real `before` images and set `simulateBefore: false`.
- **Site URL** (canonical, Open Graph, schema): set `NEXT_PUBLIC_SITE_URL`.
- **Booking form:** `submitBooking()` in `src/lib/booking.ts` is the integration point. It currently only simulates a successful request, so nothing is sent until you connect a backend, CRM or scheduling tool.

## Structure

```
src/
  app/                 layout (fonts, metadata), page (sections + JSON-LD), globals.css (tokens)
  components/sections/ one component per section
  components/ui/       Preloader, Navbar, SectionDivider, Cursor, SmoothScroll (Lenis), SplitLetters
  hooks/               useMagnetic, useTilt, useMediaQuery
  lib/                 gsap setup + motion queries, reusable animations, formatting, booking validation, schema
  data/salon.ts        all content
```

### Chapter dividers

Editorial chapter breaks (`<SectionDivider chapter={n} label="..." />`) sit between sections in `src/app/page.tsx`.
Two gold hairlines draw outward from the chapter number when the divider scrolls into view (IntersectionObserver + CSS transforms only).
With `prefers-reduced-motion` they are shown statically, and pinning, scrubbing, parallax and the preloader are disabled.
