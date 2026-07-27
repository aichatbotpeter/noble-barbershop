/**
 * Galéria-manifeszt.
 *
 * ⚠️ IDEIGLENES TARTALOM: ezek a képek a szalon reklámfilmjéből kivágott
 * állóképek. Élességmérés alapján a legélesebb, egymástól különböző
 * jeleneteket választottuk ki, és a fényerejüket egymáshoz igazítottuk,
 * hogy egy sorban jól nézzenek ki.
 *
 * A VÉGLEGES anyag a fotós pic-time galériája lenne
 * (hmatyasphoto.pic-time.com) — azt a pic-time technikailag nem engedi
 * letölteni. Amint a fájlok megvannak, ide kell másolni őket a
 * `public/images/gallery/` mappába, és ezt a listát átírni.
 *
 * FIGYELEM: a profi képek ÁLLÓ tájolásúak, a mostaniak fekvők — képcserekor
 * a Gallery.tsx rácsát is át kell állítani (aspect-video -> aspect-[2/3]).
 */

export type GalleryImage = {
  src: string;
  alt: string;
};

const dir = "/images/gallery";

export const galleryImages: GalleryImage[] = [
  { src: `${dir}/01-ollo-vagas.jpg`, alt: "Precíz hajvágás ollóval és fésűvel" },
  { src: `${dir}/02-hajmosas.jpg`, alt: "Hajmosás a mosdótálnál" },
  { src: `${dir}/03-stilusozas.jpg`, alt: "Széman Dávid stílusozás közben a NOBLE névfala előtt" },
  { src: `${dir}/04-noble-felirat.jpg`, alt: "A NOBLE Barbershop névfala a szalonban" },
  { src: `${dir}/05-vendeg-a-szekben.jpg`, alt: "Vendég a barber székben" },
  { src: `${dir}/06-torolkozo.jpg`, alt: "Törölközős kezelés hajmosás után" },
  { src: `${dir}/07-david.jpg`, alt: "Széman Dávid a szalonban" },
  { src: `${dir}/08-termekek.jpg`, alt: "Hajformázó termékek a szalon polcán" },
  { src: `${dir}/09-kave.jpg`, alt: "Kávé a vendégeknek a NOBLE-ben" },
  { src: `${dir}/10-vendeg-portre.jpg`, alt: "Vendég a szalon bejárata előtt" },
];
