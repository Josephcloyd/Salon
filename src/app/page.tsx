import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Services } from "@/components/sections/Services";
import { PriceMenu } from "@/components/sections/PriceMenu";
import { Artists } from "@/components/sections/Artists";
import { Transformations } from "@/components/sections/Transformations";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Space } from "@/components/sections/Space";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";
import { GoldenStrand } from "@/components/strand/GoldenStrand";
import { buildSalonSchema } from "@/lib/schema";

export default function Home() {
  const schema = JSON.stringify(buildSalonSchema()).replace(/</g, "\u003c");

  return (
    <>
      {/* Static, server-generated JSON-LD from our own data file (no user input) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <main id="main">
        <Hero />
        <Philosophy />
        <Services />
        <PriceMenu />
        <Artists />
        <Transformations />
        <Stats />
        <Testimonials />
        <Space />
        <Booking />
      </main>
      <Footer />
      <GoldenStrand />
    </>
  );
}
