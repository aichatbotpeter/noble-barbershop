/**
 * Minden NOBLE-adat egy helyen. Ha valami változik (ár, nyitvatartás, telefon),
 * CSAK ezt a fájlt kell szerkeszteni — az oldal mindenhol átveszi.
 *
 * Forrás: a szalon Salonic-profilja + a bejárati ajtó táblája (2026-07-27).
 */

export const site = {
  name: "NOBLE",
  fullName: "NOBLE | Barbershop",
  tagline: "Male Hairdressing & Barbering",
  city: "Kecskemét",

  /**
   * Hero-videó — a szalon saját reklámfilmjéből vágott, hang nélküli montázs
   * (olló, hajmosás, stílusozás). Ha `null`, a hero a névfal-fotót mozgatja.
   */
  heroVideo: "/videos/hero.mp4" as string | null,

  /** Rólunk-betét. Jelenleg NINCS használatban: a kis videó-téglalap helyett
   * a szekció kétoszlopos lett, bal oldalon egy fotóval. */
  aboutVideo: null as string | null,

  /** A hero főcíme — kisbetűs, két tagmondat. */
  heroHeadline: "nyugodt tempó, pontos vágás",
  heroLead:
    "Férfi fodrászat és barbershop Kecskemét szívében. Egyszerre egy vendég, " +
    "foglalt időpontra — hogy a végén tényleg az legyen, amit szerettél volna.",

  // Saját foglalórendszer (a Salonicot leváltotta).
  bookingUrl: "/foglalas",

  contact: {
    phone: "+36 30 483 8786",
    phoneHref: "tel:+36304838786",
    email: "s.zeman.58@gmail.com",
    street: "Izsáki út 2.",
    postalCode: "6000",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kecskem%C3%A9t%2C+Izs%C3%A1ki+%C3%BAt+2",
    // Közelítő koordináta — Dávid Google Maps „hely megosztása" linkjéből pontosítható.
    geo: { lat: 46.9074, lng: 19.6753 },
  },

  social: {
    instagram: "https://www.instagram.com/noble_barbershop_kecskemet/",
    instagramHandle: "@noble_barbershop_kecskemet",
    facebook: "https://www.facebook.com/profile.php?id=61586894835618",
  },

  /** A nyitvatartás tájékoztató — a szalon bejelentkezés alapján üzemel. */
  hoursNote: "A nyitvatartás bejelentkezés alapján történik.",

  hours: [
    { day: "Hétfő", short: "H", open: "08:00", close: "19:00" },
    { day: "Kedd", short: "K", open: "08:00", close: "19:00" },
    { day: "Szerda", short: "Sze", open: "08:00", close: "19:00" },
    { day: "Csütörtök", short: "Cs", open: "08:00", close: "19:00" },
    { day: "Péntek", short: "P", open: "08:00", close: "19:00" },
    { day: "Szombat", short: "Szo", open: "08:00", close: "13:00" },
    { day: "Vasárnap", short: "V", open: null, close: null },
  ],

  services: [
    {
      name: "Férfi hajvágás",
      en: "Haircut",
      price: 5500,
      minutes: 45,
      desc: "Konzultáció, mosás, precíz vágás és végigvitt fazonigazítás.",
      featured: false,
    },
    {
      name: "Hajvágás + szakálligazítás",
      en: "Haircut + Beard trim",
      price: 8200,
      minutes: 60,
      desc: "A teljes szolgáltatás: hajvágás és kontúrozott, formára igazított szakáll.",
      featured: true,
    },
    {
      name: "Hajvágás + szakálligazítás + festés",
      en: "Haircut + Beard trim + Coloring",
      price: 9700,
      minutes: 75,
      desc: "Vágás, szakállformázás és színkezelés egy alkalommal.",
      featured: false,
    },
    {
      name: "Szakálligazítás",
      en: "Beard trim",
      price: 3500,
      minutes: 30,
      desc: "Kontúrozás, formázás és ápolás borotvával, forró törölközővel.",
      featured: false,
    },
    {
      name: "Hosszú hajvágás",
      en: "Long haircut",
      price: 6500,
      minutes: 60,
      desc: "Hosszabb hajhoz szabott vágás, több idővel és odafigyeléssel.",
      featured: false,
    },
    {
      name: "Kreatív hajvágás",
      en: "Creative haircut",
      price: 6500,
      minutes: 60,
      desc: "Egyedi elképzelés, mintázás — ha valami sajátra vágysz.",
      featured: false,
    },
    {
      name: "Gyermek hajvágás",
      en: "Haircut for Kids",
      price: 4500,
      minutes: 30,
      desc: "Türelemmel, nyugodt tempóban a legfiatalabb vendégeknek.",
      featured: false,
    },
  ],

  master: {
    name: "Széman Dávid",
    role: "Barber · tulajdonos",
    photo: "/images/david.jpg",
  },
} as const;

/**
 * 5500 -> "5 500 Ft" (nem törhető szóközökkel, hogy ne törjön sortörésnél).
 * Nem toLocaleString, mert az a 4 jegyű számokat elválasztó nélkül adja vissza
 * ("5500"), a szalon árlistája viszont mindenhol tagolva írja.
 */
export function formatPrice(value: number): string {
  const grouped = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} Ft`;
}

export const fullAddress = `${site.contact.postalCode} ${site.city}, ${site.contact.street}`;
