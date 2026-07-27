/**
 * Galéria-manifeszt.
 *
 * ÚJ KÉP HOZZÁADÁSA: tedd a fájlt a `public/images/gallery/` mappába,
 * és vedd fel ide egy sorral. Az oldalon automatikusan megjelenik,
 * más fájlhoz nem kell nyúlni.
 *
 * Ajánlott: 1600px hosszabbik oldal, JPG, 80-85% minőség.
 */

export type GalleryImage = {
  src: string;
  alt: string;
  /** "tall" = két sor magas a rácsban, a hangsúlyos képekhez */
  span?: "tall" | "wide";
};

export const galleryImages: GalleryImage[] = [
  // Üres, amíg meg nem érkeznek a profi fotók (a `shop-wall.jpg` a heróban van).
  // Amíg üres, a Galéria szekció Instagram-CTA-ként jelenik meg.
];
