/**
 * Statikus fájlok útvonala.
 *
 * GitHub Pages a repó nevét teszi az URL elé (/noble-barbershop). A Next.js a
 * `basePath`-t a linkekre magától ráteszi, de a `next/image`-re `unoptimized`
 * módban NEM — hidratálás után visszaáll a nyers "/images/..." útvonalra, és a
 * kép eltörik. Ezért minden statikus fájlra ezt a függvényt használjuk.
 *
 * A `NEXT_PUBLIC_` előtag miatt az érték build-időben beépül, így kliens
 * oldalon is helyes.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
