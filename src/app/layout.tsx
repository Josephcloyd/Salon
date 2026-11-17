import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import type { ReactNode } from "react";
import { hero, salon } from "@/data/salon";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const title = "Salon Marahuyo · Luxury Hair & Beauty Salon in BGC, Taguig";

export const metadata: Metadata = {
  metadataBase: new URL(salon.url),
  title,
  description: salon.description,
  keywords: ["hair salon BGC", "salon Taguig", "balayage Manila", "rebond BGC", "keratin treatment", "bridal makeup Taguig", "nail salon BGC"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: salon.name,
    title,
    description: salon.description,
    images: [{ url: `${hero.image.src}?w=1200&h=630&fit=crop&q=75&auto=format`, width: 1200, height: 630, alt: hero.image.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: salon.description,
    images: [`${hero.image.src}?w=1200&h=630&fit=crop&q=75&auto=format`],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1c1412",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-PH" className={`is-loading ${display.variable} ${body.variable}`}>
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}html.is-loading{overflow:auto!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="eyebrow fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-gold px-5 py-3 text-espresso transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          {children}
        </SmoothScroll>
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
