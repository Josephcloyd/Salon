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
  components/strand/   The Golden Strand: geometry.ts (pure math), GoldenStrand.tsx (render), shimmer.ts (particles)
  components/ui/       Preloader, Navbar, Cursor, SmoothScroll (Lenis), SplitLetters
  hooks/               useMagnetic, useTilt, useMediaQuery
  lib/                 gsap setup + motion queries, reusable animations, formatting, booking validation, schema
  data/salon.ts        all content
```

### The Golden Strand

Sections declare how the strand behaves through data attributes, with no strand code in the sections themselves:

- `data-strand="sleek | wave | loose | curl"` plus optional `data-strand-x="0.9"` (resting x as a fraction of the width)
- `data-strand-wrap` on an inline element: the strand curls around it
- `data-strand-bow` on the CTA: the strand ends by tying a bow around it

On mobile the strand is simplified (no wraps or curls, coarser path, no particles).
With `prefers-reduced-motion` it is drawn statically, and pinning, scrubbing, parallax and the preloader are disabled.
