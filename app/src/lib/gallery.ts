/**
 * Galéria-manifeszt.
 *
 * A képek a szalon saját reklámfilmjéből vágott állóképek (1280×720).
 *
 * ÚJ KÉP HOZZÁADÁSA: tedd a fájlt a `public/images/gallery/` mappába,
 * és vedd fel ide egy sorral. Az oldalon automatikusan megjelenik.
 * Ajánlott: 1600px hosszabbik oldal, JPG, 80-85% minőség.
 */

export type GalleryImage = {
  src: string;
  alt: string;
  /** "wide" = két oszlop széles a rácsban */
  span?: "wide";
};

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/vagas.jpg", alt: "Precíz hajvágás ollóval a NOBLE Barbershopban" },
  { src: "/images/gallery/hajmosas.jpg", alt: "Hajmosás a mosdótálnál" },
  { src: "/images/gallery/stilusozas.jpg", alt: "Széman Dávid stílusozás közben a NOBLE névfala előtt" },
  { src: "/images/gallery/szek.jpg", alt: "Vendég a barber székben, háttérben a NOBLE névfal" },
  { src: "/images/gallery/termekek.jpg", alt: "Hajformázó termékek a szalon polcán" },
  { src: "/images/gallery/mosas-torolkozo.jpg", alt: "Forró törölközős kezelés hajmosás után" },
];
