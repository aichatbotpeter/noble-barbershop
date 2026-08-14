/**
 * Referenciák — kész munkák a szalonból.
 *
 * A fotókat Dávid küldte (2026-08-14), mind a NOBLE névfal előtt, azonos
 * beállításban készült. A feldolgozás: Display P3 -> sRGB, 3:4-re vágva,
 * 1400 px szélesre kicsinyítve, EXIF nélkül.
 *
 * ÚJ KÉP: tedd a fájlt a `public/images/referenciak/` mappába — ugyanígy
 * 3:4 arányban, mert a References.tsx rácsa erre az arányra van beállítva —
 * és vedd fel ide. A `galleryImages`-től szándékosan külön él: az a szalon
 * hangulata, ez a munka eredménye.
 */

export type ReferenceImage = {
  src: string;
  alt: string;
};

const dir = "/images/referenciak";

export const referenceImages: ReferenceImage[] = [
  {
    src: `${dir}/01-oldalvalasztek-fade.jpg`,
    alt: "Oldalválasztékos férfi hajvágás vágott vonallal és fade-del",
  },
  {
    src: `${dir}/02-francia-crop.jpg`,
    alt: "Francia crop hosszabb frufruval, alacsony fade-del",
  },
  {
    src: `${dir}/03-hatrafesult-szakall.jpg`,
    alt: "Hátrafésült, hosszabb felső rész igazított szakállal",
  },
  {
    src: `${dir}/04-skin-fade-szakall.jpg`,
    alt: "Rövid fazon skin fade-del és formára igazított szakállal",
  },
  {
    src: `${dir}/05-texturalt-magas-fade.jpg`,
    alt: "Texturált rövid felső rész magas fade-del",
  },
  {
    src: `${dir}/06-hatulnezet-taper.jpg`,
    alt: "Hátrafésült szőke hajvágás hátulnézetből, tarkón futó taperrel",
  },
  {
    src: `${dir}/07-borotvalt-valasztek.jpg`,
    alt: "Klasszikus oldalválaszték borotvált vonallal és skin fade-del",
  },
  {
    src: `${dir}/08-rovid-skin-fade.jpg`,
    alt: "Rövid férfi hajvágás skin fade-del, oldalnézetből",
  },
];
