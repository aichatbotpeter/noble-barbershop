import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 konfiguráció.
 *
 * A kapcsolati URL a 7-es verzióban már nem a schema.prisma-ban van:
 * a migrációs parancsok innen olvassák, a futó alkalmazás pedig a
 * `src/lib/db.ts`-ben megadott adapterből.
 *
 * A `dotenv/config` import azért kell, mert a Prisma 7 CLI már NEM tölti be
 * magától a .env fájlt ebbe a konfigurációba.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
