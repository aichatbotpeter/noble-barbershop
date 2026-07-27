# NOBLE | Barbershop — weboldal

Egyoldalas bemutatkozó weboldal a kecskeméti **NOBLE | Barbershop**-nak
(tulajdonos: **Széman Dávid**).

**Élő előnézet:** https://aichatbotpeter.github.io/noble-barbershop/

- **Kód:** `app/` — Next.js 16.2 (App Router) + React 19 + TypeScript + Tailwind v4
- **Indítás:** `cd app && npm run dev` → http://localhost:3000
- **Build:** `cd app && npm run build` (statikus export az `app/out/`-ba)

## Élesítés (GitHub Pages)

A Pages a `main` ág **`docs/`** mappáját szolgálja ki. Változtatás után:

```bash
cd app
MSYS_NO_PATHCONV=1 \
NEXT_PUBLIC_BASE_PATH=/noble-barbershop \
NEXT_PUBLIC_SITE_URL=https://aichatbotpeter.github.io/noble-barbershop \
npm run build

cd ..
rm -rf docs && cp -r app/out docs && touch docs/.nojekyll
git add -A && git commit -m "..." && git push
```

Két buktató, amibe már belefutottunk:

1. **`MSYS_NO_PATHCONV=1` kötelező** Git Bash alatt, különben a `/noble-barbershop`
   basePath-ból `C:/Program Files/Git/noble-barbershop` lesz.
2. **Képek:** a `next/image` `unoptimized` módban hidratálás után elhagyja a
   basePath-t, ezért minden statikus fájl az `app/src/lib/asset.ts` `asset()`
   függvényén megy át. Új képnél is ezt kell használni.

Saját domain esetén a `NEXT_PUBLIC_BASE_PATH` elhagyható (üres), és a Pages
beállításnál meg kell adni a domaint.

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
   Amíg üres, a Galéria szekció Instagram-CTA-ként jelenik meg.
2. **Vendégvélemények** — 3-5 VALÓDI Google/Facebook vélemény. Kitalált
   értékelést tilos valódiként közölni (Fttv.).
4. **Saját foglalórendszer** — jelenleg minden gomb a Salonicra visz
   (`site.bookingUrl`). A saját foglaló elkészültekor ezt kell `/foglalas`-ra
   átírni.
5. **Domain + éles hosting** — még nincs kiválasztva.
6. **Mobil ellenőrzés** valódi telefonon (a fejlesztés során nem volt
   emulálható mobil viewport).
