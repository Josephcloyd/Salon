/**
 * Salon Marahuyo: single source of truth for site content.
 * Edit services, prices, artists, quotes and contact details here.
 * Every image is an Unsplash placeholder; swap `src` for your own photography.
 */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export interface Photo {
  src: string;
  alt: string;
}

/* ------------------------------------------------------------------ */
/* Business details                                                    */
/* ------------------------------------------------------------------ */

export const salon = {
  name: "Salon Marahuyo",
  monogram: "SM",
  tagline: "Where beauty finds its light.",
  description:
    "A luxury hair and beauty salon in Bonifacio Global City, Taguig. Haircuts, color, balayage, rebond, keratin, nails, lashes and bridal makeup by master artists.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.salonmarahuyo.ph",
  locationLabel: "BGC, Taguig",
  address: {
    street: "2/F Marahuyo Building, 9th Avenue corner 28th Street",
    locality: "Bonifacio Global City",
    city: "Taguig City",
    region: "Metro Manila",
    postalCode: "1634",
    country: "PH",
    display: "2/F Marahuyo Building, 9th Avenue corner 28th Street, BGC, Taguig City",
  },
  geo: { lat: 14.5533, lng: 121.0509 },
  hours: { display: "Monday–Sunday, 10:00 AM – 9:00 PM", opens: "10:00", closes: "21:00" },
  phone: {
    landline: "(02) 8555 0123",
    landlineHref: "tel:+63285550123",
    mobile: "0917 555 0123",
    mobileHref: "tel:+639175550123",
    international: "+63 917 555 0123",
  },
  payments: "We accept cash, GCash, Maya and major credit cards.",
  social: {
    instagram: "https://www.instagram.com/salonmarahuyo",
    facebook: "https://www.facebook.com/salonmarahuyo",
    messenger: "https://m.me/salonmarahuyo",
    viber: "viber://chat?number=%2B639175550123",
  },
  mapEmbed:
    "https://www.google.com/maps?q=9th+Avenue+corner+28th+Street,+Bonifacio+Global+City,+Taguig&z=16&output=embed",
  stats: { foundedYearsAgo: 10 },
} as const;

/* ------------------------------------------------------------------ */
/* Hero & philosophy                                                   */
/* ------------------------------------------------------------------ */

export const hero = {
  image: { src: unsplash("1470259078422-826894b933aa"), alt: "Hair flipping through warm golden light" } satisfies Photo,
  /** Optional slow-motion hero film. Set `src` to an .mp4/.webm you own; the image above becomes its poster. */
  video: null as { src: string; type: string } | null,
};

export const philosophy: ReadonlyArray<{ text: string; translation?: string; image: Photo }> = [
  {
    text: "Every strand has a story.",
    image: { src: unsplash("1554519934-e32b1629d9ee"), alt: "Long honey-blonde waves catching the light" },
  },
  {
    text: "Every chair is a stage.",
    image: { src: unsplash("1580618672591-eb180b1a973f"), alt: "A stylist blow-drying a client's hair into soft volume" },
  },
  {
    text: "Ganda na ramdam mo.",
    translation: "Beauty you can feel.",
    image: { src: unsplash("1529626455594-4ff0802cfb7e"), alt: "A client glowing after her appointment" },
  },
];

/* ------------------------------------------------------------------ */
/* Price menu                                                          */
/* ------------------------------------------------------------------ */

export type CategoryId = "haircut" | "color" | "treatments" | "nails" | "lashes" | "makeup";

export interface MenuItem {
  name: string;
  price: number;
  /** true renders "from ₱…" (price depends on length / thickness) */
  from?: boolean;
}

export interface MenuCategory {
  id: CategoryId;
  title: string;
  items: ReadonlyArray<MenuItem>;
}

export const menu: ReadonlyArray<MenuCategory> = [
  {
    id: "haircut",
    title: "Haircut & Styling",
    items: [
      { name: "Women's Haircut with Blow-dry", price: 650 },
      { name: "Men's Haircut", price: 450 },
      { name: "Kids' Haircut (12 and below)", price: 350 },
      { name: "Blow-dry & Iron", price: 500 },
      { name: "Hair & Makeup Up-style", price: 1500 },
    ],
  },
  {
    id: "color",
    title: "Hair Color",
    items: [
      { name: "Root Touch-up", price: 1800 },
      { name: "Full Color", price: 2800, from: true },
      { name: "Highlights", price: 3500, from: true },
      { name: "Balayage / Ombré", price: 5500, from: true },
      { name: "Fashion Color with Bleach", price: 6500, from: true },
    ],
  },
  {
    id: "treatments",
    title: "Treatments",
    items: [
      { name: "Hair Spa", price: 1200 },
      { name: "Keratin Treatment", price: 4500, from: true },
      { name: "Brazilian Blowout", price: 5500, from: true },
      { name: "Rebond", price: 3800, from: true },
      { name: "Digital Perm", price: 4800, from: true },
      { name: "Scalp Detox", price: 1500 },
    ],
  },
  {
    id: "nails",
    title: "Nails",
    items: [
      { name: "Classic Manicure", price: 350 },
      { name: "Classic Pedicure", price: 450 },
      { name: "Gel Manicure", price: 850 },
      { name: "Gel Pedicure", price: 950 },
      { name: "Foot Spa with Pedicure", price: 900 },
      { name: "Soft Gel Extensions", price: 1800, from: true },
    ],
  },
  {
    id: "lashes",
    title: "Lashes & Brows",
    items: [
      { name: "Eyebrow Threading", price: 250 },
      { name: "Brow Lamination", price: 1500 },
      { name: "Lash Lift & Tint", price: 1400 },
      { name: "Classic Lash Extensions", price: 1800 },
      { name: "Volume Lash Extensions", price: 2500 },
    ],
  },
  {
    id: "makeup",
    title: "Makeup & Bridal",
    items: [
      { name: "Event Makeup", price: 2500 },
      { name: "Hair & Makeup Package", price: 3800 },
      { name: "Bridal Hair & Makeup", price: 15000, from: true },
      { name: "Entourage (per head)", price: 2800 },
    ],
  },
];

export const menuNote =
  "Prices may vary depending on hair length and thickness. Free consultation before every service.";

/** Lowest price in a category, used for the "from ₱…" line on service cards. */
export function startingPrice(categoryId: CategoryId): number {
  const category = menu.find((c) => c.id === categoryId);
  if (!category || category.items.length === 0) {
    throw new Error(`Unknown or empty menu category: ${categoryId}`);
  }
  return Math.min(...category.items.map((item) => item.price));
}

/** Lowest and highest prices across the whole menu (for schema.org priceRange). */
export function priceBounds(): { min: number; max: number } {
  const prices = menu.flatMap((c) => c.items.map((i) => i.price));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/* ------------------------------------------------------------------ */
/* Services (horizontal gallery)                                       */
/* ------------------------------------------------------------------ */

export interface Service {
  categoryId: CategoryId;
  title: string;
  line: string;
  image: Photo;
}

export const services: ReadonlyArray<Service> = [
  {
    categoryId: "haircut",
    title: "Haircut & Styling",
    line: "Precision cuts and blow-outs shaped around how you live.",
    image: { src: unsplash("1562322140-8baeececf3df"), alt: "Stylist blow-drying a client's bob" },
  },
  {
    categoryId: "color",
    title: "Hair Color",
    line: "Balayage, highlights and dimension that grows out beautifully.",
    image: { src: unsplash("1492106087820-71f1a00d2b11"), alt: "Soft lavender waves with dimensional color" },
  },
  {
    categoryId: "treatments",
    title: "Treatments",
    line: "Rebond, keratin and spa rituals for hair that feels like silk.",
    image: { src: unsplash("1634449571010-02389ed0f9b0"), alt: "Client relaxing during a hair wash treatment" },
  },
  {
    categoryId: "nails",
    title: "Nails",
    line: "Quiet-luxury manicures and gel that lasts for weeks.",
    image: { src: unsplash("1610992015732-2449b76344bc"), alt: "Nude-toned manicure resting on soft fabric" },
  },
  {
    categoryId: "lashes",
    title: "Lashes & Brows",
    line: "Lifted lashes and laminated brows that frame your face.",
    image: { src: unsplash("1487412947147-5cebf100ffc2"), alt: "Close-up of defined lashes and brows" },
  },
  {
    categoryId: "makeup",
    title: "Makeup",
    line: "Event and bridal looks that still look like you.",
    image: { src: unsplash("1516975080664-ed2fc6a32937"), alt: "Makeup brushes in warm studio light" },
  },
];

/* ------------------------------------------------------------------ */
/* Team                                                                */
/* ------------------------------------------------------------------ */

export interface Artist {
  id: string;
  name: string;
  title: string;
  image: Photo;
}

export const artists: ReadonlyArray<Artist> = [
  { id: "bianca", name: "Bianca Villanueva", title: "Creative Director & Master Stylist", image: { src: unsplash("1544005313-94ddf0286df2"), alt: "Portrait of Bianca Villanueva" } },
  { id: "paolo", name: "Paolo Santos", title: "Senior Colorist", image: { src: unsplash("1507003211169-0a1dd7228f2d"), alt: "Portrait of Paolo Santos" } },
  { id: "carmela", name: "Carmela Reyes", title: "Hair Treatment Specialist", image: { src: unsplash("1534528741775-53994a69daeb"), alt: "Portrait of Carmela Reyes" } },
  { id: "miguel", name: "Miguel Dela Cruz", title: "Barber & Men's Grooming", image: { src: unsplash("1506794778202-cad84cf45f1d"), alt: "Portrait of Miguel Dela Cruz" } },
  { id: "althea", name: "Althea Ramos", title: "Nail & Lash Artist", image: { src: unsplash("1521146764736-56c929d59c83"), alt: "Portrait of Althea Ramos" } },
  { id: "isabel", name: "Isabel Navarro", title: "Bridal Makeup Artist", image: { src: unsplash("1531123897727-8f129e1688ce"), alt: "Portrait of Isabel Navarro" } },
];

/* ------------------------------------------------------------------ */
/* Transformations                                                     */
/* ------------------------------------------------------------------ */

export interface Transformation {
  id: string;
  title: string;
  service: string;
  artist: string;
  before: Photo;
  after: Photo;
  /**
   * Placeholder only: when true the "before" photo is rendered dull and flat
   * with a CSS filter. Set false once you supply a real before photo.
   */
  simulateBefore: boolean;
}

export const transformations: ReadonlyArray<Transformation> = [
  {
    id: "balayage",
    title: "Sun-kissed balayage",
    service: "Balayage / Ombré",
    artist: "Paolo Santos",
    before: { src: unsplash("1554519934-e32b1629d9ee"), alt: "Before: flat, dull hair color" },
    after: { src: unsplash("1554519934-e32b1629d9ee"), alt: "After: luminous honey balayage" },
    simulateBefore: true,
  },
  {
    id: "rebond",
    title: "Glass-smooth rebond",
    service: "Rebond + Hair Spa",
    artist: "Carmela Reyes",
    before: { src: unsplash("1522337360788-8b13dee7a37e"), alt: "Before: frizzy, dry lengths" },
    after: { src: unsplash("1522337360788-8b13dee7a37e"), alt: "After: soft, glossy and natural-looking hair" },
    simulateBefore: true,
  },
  {
    id: "fashion-color",
    title: "Lavender fashion color",
    service: "Fashion Color with Bleach",
    artist: "Bianca Villanueva",
    before: { src: unsplash("1492106087820-71f1a00d2b11"), alt: "Before: faded, uneven tone" },
    after: { src: unsplash("1492106087820-71f1a00d2b11"), alt: "After: even, vivid lavender waves" },
    simulateBefore: true,
  },
];

/* ------------------------------------------------------------------ */
/* Numbers, testimonials, space                                        */
/* ------------------------------------------------------------------ */

export interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export const stats: ReadonlyArray<Stat> = [
  { value: 10, suffix: "+", label: "Years in BGC" },
  { value: 25000, suffix: "+", label: "Happy clients" },
  { value: 6, label: "Expert artists" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
];

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
}

export const testimonials: ReadonlyArray<Testimonial> = [
  { quote: "Best balayage I've ever had. Paolo really listened to what I wanted.", name: "Trisha M.", city: "Makati" },
  { quote: "Ang ganda ng rebond ko, soft and natural-looking pa rin after three months.", name: "Jasmine L.", city: "Taguig" },
  { quote: "Isabel did my bridal look and I felt like myself, just glowing.", name: "Nicole A.", city: "Quezon City" },
  { quote: "Finally found a barber who gets my hair. Solid si Miguel.", name: "Marco D.", city: "Pasig" },
];

export const testimonialBackdrop: Photo = {
  src: unsplash("1522337360788-8b13dee7a37e"),
  alt: "",
};

export const space = {
  doorway: { src: unsplash("1633681926022-84c23e8cb2d6"), alt: "The entrance corridor of Salon Marahuyo, warm light and mirrors" } satisfies Photo,
  rooms: [
    { title: "The Styling Floor", note: "Twelve chairs, north light, no rush.", image: { src: unsplash("1600948836101-f9ffda59d250"), alt: "The styling floor with round mirrors and black chairs" } },
    { title: "The Wash Area", note: "Reclining basins and scalp rituals.", image: { src: unsplash("1595476108010-b4d1f102b1b1"), alt: "A stylist washing a client's hair at the basin" } },
    { title: "The Nail Lounge", note: "Soft chairs, slow coffee, perfect gel.", image: { src: unsplash("1457972729786-0411a3b2b626"), alt: "A manicurist applying polish in the nail lounge" } },
  ] as ReadonlyArray<{ title: string; note: string; image: Photo }>,
};

export const bookingBackdrop: Photo = {
  src: unsplash("1515377905703-c4788e51af15"),
  alt: "",
};

export const navLinks: ReadonlyArray<{ href: string; label: string }> = [
  { href: "#services", label: "Services" },
  { href: "#menu", label: "Menu" },
  { href: "#artists", label: "Artists" },
  { href: "#space", label: "The Space" },
];
