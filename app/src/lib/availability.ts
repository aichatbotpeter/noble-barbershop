import { prisma } from "./db";
import { getNumericSetting, SETTING_KEYS } from "./settings";
import { isoDayOfWeek, localToUtc, minutesToLabel } from "./time";

export type Slot = {
  /** Perc éjféltől, budapesti idő szerint (480 = 08:00). */
  minutes: number;
  /** "08:00" */
  label: string;
  /** A kezdés UTC-ben, ISO formában — ezt küldi vissza a foglaló űrlap. */
  startsAt: string;
};

/** Egy nap nyitvatartási ablaka, a kivételeket már figyelembe véve. */
export async function getOpeningWindow(
  dateISO: string,
): Promise<{ openMin: number; closeMin: number } | null> {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dateOnly = new Date(Date.UTC(y, m - 1, d));

  // A konkrét napra szóló kivétel erősebb, mint a heti alapbeállítás.
  const override = await prisma.dateOverride.findUnique({ where: { date: dateOnly } });
  if (override) {
    if (override.isClosed) return null;
    if (override.openMin != null && override.closeMin != null) {
      return { openMin: override.openMin, closeMin: override.closeMin };
    }
  }

  const weekly = await prisma.weeklyHour.findUnique({
    where: { dayOfWeek: isoDayOfWeek(dateISO) },
  });
  if (!weekly || !weekly.isOpen) return null;
  return { openMin: weekly.openMin, closeMin: weekly.closeMin };
}

/**
 * Egy adott napon szabad kezdési időpontok egy adott hosszúságú szolgáltatáshoz.
 *
 * Kiszűri azokat, amik
 *  - kilógnának a zárásból,
 *  - ütköznek egy már meglévő (függő vagy visszaigazolt) foglalással,
 *  - túl közel vannak a mostani időponthoz.
 */
export async function getAvailableSlots(
  dateISO: string,
  durationMin: number,
): Promise<Slot[]> {
  const window = await getOpeningWindow(dateISO);
  if (!window) return [];

  const step = await getNumericSetting(SETTING_KEYS.slotStepMin);
  const minLeadHours = await getNumericSetting(SETTING_KEYS.minLeadHours);
  const earliest = new Date(Date.now() + minLeadHours * 3_600_000);

  // A nap teljes intervalluma UTC-ben, hogy egy lekérdezéssel megkapjuk
  // az aznapi foglalásokat.
  const dayStart = localToUtc(dateISO, 0);
  const dayEnd = localToUtc(dateISO, 24 * 60);

  const taken = await prisma.booking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      startsAt: { lt: dayEnd },
      endsAt: { gt: dayStart },
    },
    select: { startsAt: true, endsAt: true },
  });

  const slots: Slot[] = [];
  for (let m = window.openMin; m + durationMin <= window.closeMin; m += step) {
    const startsAt = localToUtc(dateISO, m);
    const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

    if (startsAt < earliest) continue;

    const overlaps = taken.some((b) => startsAt < b.endsAt && endsAt > b.startsAt);
    if (overlaps) continue;

    slots.push({ minutes: m, label: minutesToLabel(m), startsAt: startsAt.toISOString() });
  }

  return slots;
}

/** Hány napra előre lehet foglalni — a naptár ennyit mutat. */
export async function getBookableRange(): Promise<{ from: string; to: string }> {
  const maxAdvanceDays = await getNumericSetting(SETTING_KEYS.maxAdvanceDays);
  const now = new Date();
  const to = new Date(now.getTime() + maxAdvanceDays * 86_400_000);
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Budapest",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  return { from: fmt(now), to: fmt(to) };
}
