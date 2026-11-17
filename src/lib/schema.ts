import { artists, menu, priceBounds, salon } from "@/data/salon";
import { formatPeso } from "./format";

/** schema.org HairSalon (a LocalBusiness subtype) built from the data file. */
export function buildSalonSchema(): Record<string, unknown> {
  const { min, max } = priceBounds();

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${salon.url}/#salon`,
    name: salon.name,
    description: salon.description,
    url: salon.url,
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=75&auto=format",
    telephone: salon.phone.international,
    priceRange: `${formatPeso(min)} – ${formatPeso(max)}`,
    currenciesAccepted: "PHP",
    paymentAccepted: "Cash, GCash, Maya, Credit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address.street,
      addressLocality: salon.address.locality,
      addressRegion: salon.address.region,
      postalCode: salon.address.postalCode,
      addressCountry: salon.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: salon.geo.lat, longitude: salon.geo.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: salon.hours.opens,
        closes: salon.hours.closes,
      },
    ],
    sameAs: [salon.social.instagram, salon.social.facebook],
    employee: artists.map((a) => ({ "@type": "Person", name: a.name, jobTitle: a.title })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: menu.map((category) => ({
        "@type": "OfferCatalog",
        name: category.title,
        itemListElement: category.items.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item.name },
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "PHP",
            ...(item.from ? { minPrice: item.price } : { price: item.price }),
          },
        })),
      })),
    },
  };
}
