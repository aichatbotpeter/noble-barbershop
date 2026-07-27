/**
 * Galéria-manifeszt.
 *
 * A képek a fotós (Hmatyasphoto) 2026-06-24-i szalonfotózásából valók,
 * álló tájolásúak (2:3). Ha képet cserélsz, ügyelj rá, hogy a Gallery.tsx
 * rácsa erre az arányra van beállítva.
 *
 * ÚJ KÉP: tedd a fájlt a `public/images/gallery/` mappába, és vedd fel ide.
 */

export type GalleryImage = {
  src: string;
  alt: string;
};

const dir = "/images/gallery";

export const galleryImages: GalleryImage[] = [
  { src: `${dir}/01-vendeg-kaveval.jpg`, alt: "Vendég kávéval a NOBLE Barbershopban" },
  { src: `${dir}/02-bejarat-noble-tabla.jpg`, alt: "A szalon bejárata a NOBLE táblával" },
  { src: `${dir}/03-hajmosas-kozeli.jpg`, alt: "Hajmosás a mosdótálnál" },
  { src: `${dir}/04-noble-nevfal.jpg`, alt: "A NOBLE névfal a szalonban" },
  { src: `${dir}/05-szaritas.jpg`, alt: "Széman Dávid szárítás és formázás közben" },
  { src: `${dir}/06-barber-szek.jpg`, alt: "Barber szék a tükör előtt" },
  { src: `${dir}/07-hajmosas.jpg`, alt: "Vendég hajmosás közben" },
  { src: `${dir}/08-eszkozok.jpg`, alt: "A barber eszközei a pulton" },
  { src: `${dir}/09-kopeny.jpg`, alt: "Vendég felkészítése a vágásra" },
  { src: `${dir}/10-termekpolc.jpg`, alt: "Hajformázó termékek a szalon polcán" },
  { src: `${dir}/11-tukorben.jpg`, alt: "Széman Dávid és a vendég a tükörben" },
  { src: `${dir}/12-bejarat.jpg`, alt: "A NOBLE Barbershop bejárata" },
];
