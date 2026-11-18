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
import { SectionDivider } from "@/components/ui/SectionDivider";
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
        <SectionDivider chapter={1} label="Services" />
        <Services />
        <SectionDivider chapter={2} label="The Menu" />
        <PriceMenu />
        <SectionDivider chapter={3} label="The Artists" />
        <Artists />
        <SectionDivider chapter={4} label="Transformations" />
        <Transformations />
        <SectionDivider chapter={5} label="By the Numbers" />
        <Stats />
        <Testimonials />
        <SectionDivider chapter={6} label="The Space" />
        <Space />
        <SectionDivider chapter={7} label="Reservations" />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
