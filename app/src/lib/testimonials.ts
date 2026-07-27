/**
 * VALÓDI vendégvélemények.
 *
 * ⚠️ FONTOS: ide KIZÁRÓLAG tényleges, ellenőrizhető vélemény kerülhet
 * (Google, Facebook, Salonic). Kitalált értékelés valódiként való közlése
 * a fogyasztókkal szembeni tisztességtelen kereskedelmi gyakorlatról szóló
 * törvénybe ütközik — ezért a lista most szándékosan üres, és amíg üres,
 * a szekció meg sem jelenik az oldalon.
 *
 * Feltöltéshez: 3-5 vélemény Dávid Google/Facebook profiljáról,
 * névvel (vagy keresztnévvel) és forrással.
 */

export type Testimonial = {
  quote: string;
  author: string;
  source: "Google" | "Facebook" | "Salonic";
};

export const testimonials: Testimonial[] = [];
