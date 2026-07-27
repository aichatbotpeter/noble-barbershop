import "dotenv/config";
import { Client } from "pg";

/**
 * Egyszeri adatbázis-beállítás a Prisma séma kitolása UTÁN.
 *
 * A lényeg a kizáró megszorítás: két aktív foglalás időintervalluma nem
 * fedheti egymást. Ezt az alkalmazás is ellenőrzi, de ha két kérés
 * ezredmásodpercen belül fut be ugyanarra a résre, csak az adatbázis tud
 * dönteni — ez a végső védelem a dupla foglalás ellen.
 */

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// A Prisma a DateTime-ot alapból timestamp(3) WITHOUT time zone-ra képezi,
// ezért megnézzük, mi a tényleges típus, és ahhoz választunk range-függvényt.
const { rows } = await client.query(
  `SELECT data_type FROM information_schema.columns
   WHERE table_name = 'Booking' AND column_name = 'startsAt'`,
);
const withTz = rows[0]?.data_type === "timestamp with time zone";
const rangeFn = withTz ? "tstzrange" : "tsrange";
console.log(`startsAt típusa: ${rows[0]?.data_type} -> ${rangeFn}`);

await client.query("CREATE EXTENSION IF NOT EXISTS btree_gist");
await client.query(`ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS booking_no_overlap`);
await client.query(`
  ALTER TABLE "Booking"
  ADD CONSTRAINT booking_no_overlap
  EXCLUDE USING gist (
    ${rangeFn}("startsAt", "endsAt", '[)') WITH &&
  )
  WHERE (status IN ('PENDING','CONFIRMED'))
`);
console.log("✔ booking_no_overlap megszorítás létrehozva");

// Heti nyitvatartás alapértéke: H–P 08–19, Szo 08–13, V zárva.
const defaults = [
  [1, true, 480, 1140],
  [2, true, 480, 1140],
  [3, true, 480, 1140],
  [4, true, 480, 1140],
  [5, true, 480, 1140],
  [6, true, 480, 780],
  [7, false, 480, 780],
];
for (const [day, isOpen, openMin, closeMin] of defaults) {
  await client.query(
    `INSERT INTO "WeeklyHour" ("dayOfWeek","isOpen","openMin","closeMin")
     VALUES ($1,$2,$3,$4) ON CONFLICT ("dayOfWeek") DO NOTHING`,
    [day, isOpen, openMin, closeMin],
  );
}
console.log("✔ heti nyitvatartás alapértékek");

await client.end();
