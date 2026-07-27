# NOBLE | Barbershop — weboldal

Egyoldalas bemutatkozó weboldal a kecskeméti **NOBLE | Barbershop**-nak
(tulajdonos: **Széman Dávid**).

- **Kód:** `app/` — Next.js 16.2 (App Router) + React 19 + TypeScript + Tailwind v4
- **Indítás:** `cd app && npm run dev` → http://localhost:3000
- **Build:** `cd app && npm run build` (minden route statikusan előrenderelt)

## Hol mit találsz

| Amit módosítani akarsz | Fájl |
|---|---|
| Ár, szolgáltatás, nyitvatartás, telefon, cím, közösségi linkek | `app/src/lib/site.ts` |
| Galéria képei | `app/src/lib/gallery.ts` + `app/public/images/gallery/` |
| Vendégvélemények | `app/src/lib/testimonials.ts` |
| Színek, betűtípusok, gombok | `app/src/app/globals.css` |
| SEO / megosztási kép | `app/src/app/layout.tsx`, `opengraph-image.tsx` |

**Az árat, nyitvatartást, elérhetőséget CSAK a `site.ts`-ben kell átírni** — az
oldal minden pontja (beleértve a Google-nek szóló strukturált adatot) onnan veszi.

## Arculat

A dizájn a **`fadedbarbershopbp.com`** (budapesti Faded) irányát követi: világos,
levegős, fotó-vezérelt felület. Szekciórend: hero → Rólunk → Áraink → Galéria
(sötét) → Kontakt.

- **Betűk:** Montserrat (címek 600, árak 900, navigáció verzál) + DM Sans (szöveg)
- **Címek kisbetűsek/mondatkezdésűek**, nem verzálisak — ez a referencia egyik
  jellemzője
- **Színek:** szöveg `#1d1e20`, fehér/`#d7d9e0` világos alapok, sötét sáv
  `#101a16` (fejléc, galéria, lábléc), arany akcent `#a88858` (a NOBLE logó
  ollójából mintavételezve)
- **Gombok:** tömör, szögletes, nagy — sötét vagy fehér változat

> Korábban készült egy sötét/aranyos, talpas betűs verzió (Cormorant + Jost) a
> kaliforniai `fadedbarbershop.com` alapján — azt a user elvetette. Ha valaha
> előkerül, a git-előzményben megvan.

**Hero:** a szalon névfala erős ráközelítéssel, alulról sötétedő átmenettel. A
nagy NOBLE betűk grafikus háttérként működnek. Ha lesz jobb belső fotó vagy
videó, a `Hero.tsx`-ben cserélhető.

## Arculati fájlok

`_assets_raw/` — az eredeti, feldolgozatlan fájlok (a szalon Salonic-profiljából).
A feldolgozott változatok az `app/public/images/` alatt vannak:

- `noble-logo.png` — a logó, fekete háttér nélkül (átlátszó)
- `shop-wall.jpg` — a szalon névfala
- `david.jpg` — Széman Dávid portréja (⚠️ csak 160px-es forrás, cserélendő)

## Ami még hátravan

1. **Galéria-fotók** — a profi fotózás anyaga (pic-time). A fájlokat az
   `app/public/images/gallery/` mappába kell tenni, és felvenni a
   `gallery.ts`-be. A pic-time nem engedi a letöltést, ügyfélként kell lementeni.
2. **Dávid portréja** — jobb felbontásban, ugyanabból a fotózásból.
3. **Vendégvélemények** — 3-5 VALÓDI Google/Facebook vélemény. Kitalált
   értékelést tilos valódiként közölni (Fttv.).
4. **Saját foglalórendszer** — jelenleg minden gomb a Salonicra visz
   (`site.bookingUrl`). A saját foglaló elkészültekor ezt kell `/foglalas`-ra
   átírni.
5. **Domain + éles hosting** — még nincs kiválasztva.
6. **Mobil ellenőrzés** valódi telefonon (a fejlesztés során nem volt
   emulálható mobil viewport).
