import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma kliens.
 *
 * A 7-es verzióban a kapcsolat driver-adapteren keresztül megy, nem a
 * schema.prisma `url` mezőjén (az már nem is létezik).
 *
 * Fejlesztés közben a hot reload újra és újra lefuttatná ezt a modult, és
 * minden alkalommal új kapcsolatot nyitna — ezért globálisan tároljuk.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Hiányzik a DATABASE_URL környezeti változó.");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
