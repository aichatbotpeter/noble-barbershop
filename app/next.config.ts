import type { NextConfig } from "next";

// GitHub Pages a repó nevét teszi az útvonal elé (/noble-barbershop), ezért
// build-időben ezt be kell égetni. Lokálisan üres, így a dev szerver változatlan.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Statikus HTML export — így bárhová kitehető (GitHub Pages, Surge, tárhely).
  output: "export",

  basePath,
  // A trailing slash kell, hogy a Pages a mappákat is kiszolgálja.
  trailingSlash: true,

  images: {
    // A Pages-en nincs Next.js image-szerver, ezért a képek optimalizálás
    // nélkül, közvetlenül mennek ki.
    unoptimized: true,
  },

  // A gépen több package-lock.json is van feljebb a fában, ezért a Turbopack
  // rossz gyökeret választana. Itt rögzítjük, hogy ez a projekt a gyökér.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
