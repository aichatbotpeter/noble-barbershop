import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { getAvailableSlots } from "@/lib/availability";
import { sendNewBookingToOwner, sendReceivedToCustomer } from "@/lib/email";

export const dynamic = "force-dynamic";

type Payload = {
  service?: string;
  startsAt?: string;
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Hibás kérés." }, { status: 400 });
  }

  const service = site.services.find((s) => s.name === body.service);
  if (!service) {
    return NextResponse.json({ error: "Válassz szolgáltatást." }, { status: 400 });
  }

  const startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "Válassz időpontot." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const note = (body.note ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ error: "Kérjük add meg a neved." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 9) {
    return NextResponse.json({ error: "Kérjük add meg a telefonszámod." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Kérjük add meg az e-mail címed." }, { status: 400 });
  }

  // A kliens által küldött időpontot NEM hisszük el: újraszámoljuk a szabad
  // időpontokat, és csak akkor engedjük tovább, ha tényleg köztük van.
  const dateISO = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(startsAt);

  const slots = await getAvailableSlots(dateISO, service.minutes);
  const stillFree = slots.some((s) => s.startsAt === startsAt.toISOString());
  if (!stillFree) {
    return NextResponse.json(
      { error: "Ez az időpont időközben elkelt. Válassz másikat." },
      { status: 409 },
    );
  }

  const endsAt = new Date(startsAt.getTime() + service.minutes * 60_000);

  try {
    const booking = await prisma.booking.create({
      data: {
        serviceName: service.name,
        servicePrice: service.price,
        durationMin: service.minutes,
        startsAt,
        endsAt,
        customerName: name,
        phone,
        email,
        note: note || null,
      },
    });

    // Az e-mailek nem blokkolják a választ — ha a küldés hibázik, a foglalás áll.
    await Promise.all([
      sendNewBookingToOwner(booking),
      sendReceivedToCustomer(booking),
    ]);

    return NextResponse.json({ ok: true, manageToken: booking.manageToken }, { status: 201 });
  } catch (error) {
    // Az adatbázis kizáró megszorítása a végső védelem: ha két kérés
    // ugyanarra a résre fut be egyszerre, a második itt bukik el.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      (error as { code?: string })?.code === "23P01"
    ) {
      return NextResponse.json(
        { error: "Ez az időpont időközben elkelt. Válassz másikat." },
        { status: 409 },
      );
    }
    console.error("[bookings] létrehozás sikertelen:", error);
    return NextResponse.json({ error: "Váratlan hiba. Próbáld újra." }, { status: 500 });
  }
}
