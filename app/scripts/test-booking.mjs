/**
 * Végigpróbálja a foglalási szabályokat egy futó szerver ellen.
 * Használat:  node scripts/test-booking.mjs [alap-url]
 */
const BASE = process.argv[2] ?? "http://localhost:3000";
const SERVICE = "Férfi hajvágás"; // 45 perc

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✔" : "✘"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const tomorrow = new Date(Date.now() + 86_400_000).toLocaleDateString("en-CA", {
  timeZone: "Europe/Budapest",
});

async function slots(date = tomorrow) {
  const r = await fetch(
    `${BASE}/api/availability?date=${date}&service=${encodeURIComponent(SERVICE)}`,
  );
  const d = await r.json();
  return d.slots ?? [];
}

async function book(startsAt, name) {
  const r = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service: SERVICE,
      startsAt,
      name,
      phone: "+36301234567",
      email: "teszt@example.com",
    }),
  });
  return { status: r.status, body: await r.json() };
}

const free = await slots();
if (free.length < 6) {
  console.error("Nincs elég szabad időpont a teszthez.");
  process.exit(1);
}

// Olyan rést választunk, amit még nem foglaltunk le korábbi futásban.
const target = free[Math.floor(free.length / 2)];

const first = await book(target.startsAt, "Teszt Elso");
check("Foglalás létrejön", first.status === 201, `HTTP ${first.status}`);

const dup = await book(target.startsAt, "Teszt Masodik");
check("Ugyanarra az időpontra nem enged", dup.status === 409, `HTTP ${dup.status}`);

const overlapStart = new Date(
  new Date(target.startsAt).getTime() + 15 * 60_000,
).toISOString();
const overlap = await book(overlapStart, "Teszt Atfedo");
check("Átfedő időpontra nem enged", overlap.status === 409, `HTTP ${overlap.status}`);

const afterList = await slots();
const gone = !afterList.some((s) => s.startsAt === target.startsAt);
check("A lefoglalt rés eltűnik a listából", gone);

const blockedBefore = afterList.every((s) => {
  const st = new Date(s.startsAt).getTime();
  const en = st + 45 * 60_000;
  const bs = new Date(target.startsAt).getTime();
  const be = bs + 45 * 60_000;
  return !(st < be && en > bs);
});
check("Nem kínál a foglalással átlapoló kezdést", blockedBefore);

const past = await book(new Date(Date.now() - 3_600_000).toISOString(), "Teszt Mult");
check("Múltbeli időpontot elutasít", past.status >= 400, `HTTP ${past.status}`);

const badEmail = await fetch(`${BASE}/api/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    service: SERVICE,
    startsAt: free[free.length - 1].startsAt,
    name: "X",
    phone: "1",
    email: "nem-email",
  }),
});
check("Hibás adatokat elutasít", badEmail.status === 400, `HTTP ${badEmail.status}`);

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} teszt sikeres`);
process.exit(failed ? 1 : 0);
