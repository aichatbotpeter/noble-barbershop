# NOBLE | Barbershop — weboldal + foglalórendszer

Weboldal és saját időpontfoglaló a kecskeméti **NOBLE | Barbershop**-nak
(tulajdonos: **Széman Dávid**). A Salonicot leváltotta.

**Élő:** https://web-production-f3e71.up.railway.app
**Admin:** `/admin` (jelszó: `ADMIN_PASSWORD` env-változó)

- **Kód:** `app/` — Next.js 16 + React 19 + TypeScript + Tailwind v4 + Prisma 7 + PostgreSQL
- **Indítás:** `cd app && npm run dev`
- **Adatbázis első beállítása:** `npm run db:setup`
- **Foglalási szabályok tesztje:** `npm run test:booking [url]`

## Élesítés (Railway)

A `web` service a `aichatbotpeter/noble-barbershop` repóból épül, gyökérmappa `app`.
**A GitHub push NEM indít automatikus deploy-t** — kézzel kell elindítani a
Railway felületén, vagy GraphQL-lel:

```
mutation { serviceInstanceDeployV2(environmentId: "<env>", serviceId: "<web>") }
```

## Dupla foglalás elleni védelem

Három rétegben:
1. a szabad időpontok listája már nem kínálja a foglalt réseket,
2. a `POST /api/bookings` a szerveren újraszámolja és ellenőrzi,
3. **az adatbázisban egy kizáró megszorítás** (`EXCLUDE USING gist ... WITH &&`)
   — ez az egyetlen, ami versenyhelyzetben is véd, ha két kérés ezredmásodpercen
   belül fut be ugyanarra a résre. A `scripts/setup-db.mjs` hozza létre.

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

**Hero:** a szalon reklámfilmjéből vágott, néma, loopoló montázs
(`public/videos/hero.mp4`). Ha nincs videó (`site.heroVideo = null`), a hero
a névfal-fotót mozgatja lassan (Ken Burns).

**Mozgás:** parallax hátterek (`Parallax.tsx`), irányfüggő és lépcsőzetes
belépő animációk (`Reveal.tsx`). Csökkentett mozgás beállításnál mind kikapcsol.

## Arculati fájlok

`_assets_raw/` — eredeti, feldolgozatlan anyagok (nincs verziókövetve: a promo
videó és a kockák kimaradnak). A feldolgozott változatok az `app/public/` alatt:

- `images/noble-logo.png` / `noble-logo-dark.png` — logó sötét, ill. világos háttérre
- `images/shop-wall.jpg` — a névfal profi felvétele (1600×1067)
- `images/david.jpg` — Széman Dávid portréja (720×720)
- `images/gallery/*.jpg` — 6 állókép a reklámfilmből
- `videos/hero.mp4`, `videos/about.mp4` — H.264, néma

A kapott `.mov` HEVC volt, amit a böngészők nem játszanak le — ffmpeggel
kódoltuk át H.264-re.

## Ami még hátravan

1. **⚠️ E-mail küldés** — a `RESEND_API_KEY` üres, ezért MOST NEM MEGY KI levél
   (a foglalás létrejön, a kód csak logol). Kell egy Resend kulcs és egy igazolt
   feladó-domain, majd a `RESEND_API_KEY` + `RESEND_FROM` beállítása a Railwayen.
2. **Értesítési e-mail cím** — Dávidnak az `/admin` oldalon be kell írnia, hova
   kérje a foglalás-értesítőket.
3. **Vendégvélemények** — 3-5 VALÓDI Google/Facebook vélemény. Kitalált
   értékelést tilos valódiként közölni (Fttv.).
4. **Domain** — jelenleg a Railway aldomainje él.
5. **Átadás** — a Railway projekt Peter fiókján van, Dávidéra átvihető.
6. **Mobil ellenőrzés** valódi telefonon.
