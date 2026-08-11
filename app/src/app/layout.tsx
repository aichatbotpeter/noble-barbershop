import type { Metadata } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Címek, navigáció, árak. A 900-as vágás az árakhoz kell.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"], // latin-ext kell az ő/ű miatt
  weight: ["500", "600", "700", "900"],
  display: "swap",
});

// Folyó szöveg.
const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.noblebarbershop.hu";
const description =
  "Férfi fodrászat és barbershop Kecskeméten, az Izsáki út 2. alatt. " +
  "Hajvágás, szakálligazítás, kreatív fazonok — Széman Dávid. Online időpontfoglalás.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NOBLE | Barbershop — Férfi fodrászat Kecskeméten",
    template: "%s — NOBLE | Barbershop",
  },
  description,
  keywords: [
    "barbershop Kecskemét",
    "férfi fodrász Kecskemét",
    "hajvágás Kecskemét",
    "szakállvágás Kecskemét",
    "borbély Kecskemét",
    "NOBLE Barbershop",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: siteUrl,
    siteName: site.fullName,
    title: "NOBLE | Barbershop — Férfi fodrászat Kecskeméten",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "NOBLE | Barbershop — Férfi fodrászat Kecskeméten",
    description,
  },
  robots: { index: true, follow: true },
};

const DAY_TO_SCHEMA: Record<string, string> = {
  Hétfő: "Monday",
  Kedd: "Tuesday",
  Szerda: "Wednesday",
  Csütörtök: "Thursday",
  Péntek: "Friday",
  Szombat: "Saturday",
  Vasárnap: "Sunday",
};

/** Google számára: hol vagyunk, mikor tartunk nyitva, mit adunk és mennyiért. */
function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${siteUrl}/#business`,
    name: site.fullName,
    description,
    url: siteUrl,
    telephone: site.contact.phone,
    email: site.contact.email,
    image: `${siteUrl}/images/noble-logo.png`,
    priceRange: "3500–9700 HUF",
    currenciesAccepted: "HUF",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.street,
      addressLocality: site.city,
      postalCode: site.contact.postalCode,
      addressCountry: "HU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    sameAs: [site.social.instagram, site.social.facebook],
    openingHoursSpecification: site.hours
      .filter((h) => h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAY_TO_SCHEMA[h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
    makesOffer: site.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.desc },
      price: s.price,
      priceCurrency: "HUF",
    })),
    // A foglalás a Salonicban történik — a Google innen tudja meg, hova vigye.
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: site.bookingUrl,
        inLanguage: "hu-HU",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "Reservation", name: "Időpontfoglalás" },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${montserrat.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
