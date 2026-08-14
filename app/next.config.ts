import type { NextConfig } from "next";

// A foglalórendszer óta az oldal NEM statikus export: adatbázis, API route-ok
// és e-mail küldés van benne, ezért szerver kell (Railway). A basePath így
// üres — a Railway a gyökérből szolgál ki.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath,

  images: {
    // A Next 16 óta az `images.qualities` alapértéke [75], és a komponensen
    // megadott `quality` prop ehhez a listához igazodik — a 90 SZÓ NÉLKÜL
    // 75-re esett vissza. A fotó-vezérelt szekciókban (galéria, referenciák)
    // ez látszik, ezért engedjük a 90-et is.
    qualities: [75, 90],
  },

  // A gépen több package-lock.json is van feljebb a fában, ezért a Turbopack
  // rossz gyökeret választana. Itt rögzítjük, hogy ez a projekt a gyökér.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
