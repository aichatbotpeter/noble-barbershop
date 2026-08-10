import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { checkPassword, isLoggedIn, isPasswordConfigured, signIn, signOut } from "@/lib/auth";
import { getSettings, setSetting, SETTING_KEYS } from "@/lib/settings";
import { DAY_NAMES_HU, labelToMinutes, minutesToLabel, formatDateTimeHu } from "@/lib/time";
import { site, formatPrice } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

/**
 * A szerver-akciók önálló HTTP-végpontok: attól, hogy csak a belépett nézetben
 * rendereljük őket, még meghívhatók süti nélküli kliensből is. Ezért minden
 * módosító akció a saját törzsében is ellenőrzi a munkamenetet.
 */
async function assertAdmin() {
  if (!(await isLoggedIn())) throw new Error("Nincs jogosultság");
}

/** A heti nyitvatartás 7 sorának megléte — első betöltéskor a site.ts-ből tölt. */
async function ensureWeeklyHours() {
  const count = await prisma.weeklyHour.count();
  if (count === 7) return;
  for (let day = 1; day <= 7; day++) {
    const fromSite = site.hours[day - 1];
    const open = fromSite?.open ? labelToMinutes(fromSite.open) : null;
    const close = fromSite?.close ? labelToMinutes(fromSite.close) : null;
    await prisma.weeklyHour.upsert({
      where: { dayOfWeek: day },
      create: {
        dayOfWeek: day,
        isOpen: open != null && close != null,
        openMin: open ?? 480,
        closeMin: close ?? 1140,
      },
      update: {},
    });
  }
}

export default async function AdminPage() {
  if (!isPasswordConfigured()) {
    return (
      <Shell>
        <p className="text-ink-soft">
          Az admin felület nincs beállítva: hiányzik az <code>ADMIN_PASSWORD</code>{" "}
          környezeti változó.
        </p>
      </Shell>
    );
  }

  if (!(await isLoggedIn())) {
    async function login(formData: FormData) {
      "use server";
      if (checkPassword(String(formData.get("password") ?? ""))) {
        await signIn();
      }
      revalidatePath("/admin");
    }

    return (
      <Shell>
        <form action={login} className="mx-auto max-w-sm">
          <label className="block">
            <span className="text-sm text-ink-soft">Jelszó</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-1 w-full border border-line px-4 py-3 outline-none focus:border-ink"
            />
          </label>
          <button type="submit" className="btn btn-dark mt-5 w-full">
            Belépés
          </button>
        </form>
      </Shell>
    );
  }

  await ensureWeeklyHours();

  const [settings, weekly, overrides, bookings] = await Promise.all([
    getSettings(),
    prisma.weeklyHour.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.dateOverride.findMany({ orderBy: { date: "asc" } }),
    prisma.booking.findMany({
      where: { startsAt: { gte: new Date(Date.now() - 7 * 86_400_000) } },
      orderBy: { startsAt: "asc" },
      take: 100,
    }),
  ]);

  // ---- Szerver-akciók -------------------------------------------------

  async function saveSettings(formData: FormData) {
    "use server";
    await assertAdmin();
    await setSetting(
      SETTING_KEYS.notificationEmail,
      String(formData.get("notificationEmail") ?? "").trim(),
    );
    await setSetting(SETTING_KEYS.minLeadHours, String(formData.get("minLeadHours") ?? "2"));
    await setSetting(SETTING_KEYS.maxAdvanceDays, String(formData.get("maxAdvanceDays") ?? "60"));
    await setSetting(SETTING_KEYS.slotStepMin, String(formData.get("slotStepMin") ?? "15"));
    revalidatePath("/admin");
  }

  async function saveHours(formData: FormData) {
    "use server";
    await assertAdmin();
    for (let day = 1; day <= 7; day++) {
      const isOpen = formData.get(`open_${day}`) === "on";
      const from = labelToMinutes(String(formData.get(`from_${day}`) ?? ""));
      const to = labelToMinutes(String(formData.get(`to_${day}`) ?? ""));
      // Hibás vagy fordított időt nem mentünk el — a régi érték marad.
      if (from == null || to == null || to <= from) continue;
      await prisma.weeklyHour.update({
        where: { dayOfWeek: day },
        data: { isOpen, openMin: from, closeMin: to },
      });
    }
    revalidatePath("/admin");
  }

  async function addOverride(formData: FormData) {
    "use server";
    await assertAdmin();
    const dateStr = String(formData.get("date") ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));

    const closed = formData.get("closed") === "on";
    const from = labelToMinutes(String(formData.get("from") ?? ""));
    const to = labelToMinutes(String(formData.get("to") ?? ""));

    await prisma.dateOverride.upsert({
      where: { date },
      create: {
        date,
        isClosed: closed,
        openMin: closed ? null : from,
        closeMin: closed ? null : to,
        note: String(formData.get("note") ?? "").trim() || null,
      },
      update: {
        isClosed: closed,
        openMin: closed ? null : from,
        closeMin: closed ? null : to,
        note: String(formData.get("note") ?? "").trim() || null,
      },
    });
    revalidatePath("/admin");
  }

  async function removeOverride(formData: FormData) {
    "use server";
    await assertAdmin();
    const iso = String(formData.get("date") ?? "");
    const [y, m, d] = iso.split("-").map(Number);
    await prisma.dateOverride.delete({ where: { date: new Date(Date.UTC(y, m - 1, d)) } });
    revalidatePath("/admin");
  }

  async function cancelBooking(formData: FormData) {
    "use server";
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
    revalidatePath("/admin");
  }

  async function logout() {
    "use server";
    await signOut();
    revalidatePath("/admin");
  }

  const statusBadge: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-900",
    CONFIRMED: "bg-emerald-100 text-emerald-900",
    REJECTED: "bg-red-100 text-red-900",
    CANCELLED: "bg-zinc-200 text-zinc-700",
  };
  const statusText: Record<string, string> = {
    PENDING: "Függőben",
    CONFIRMED: "Visszaigazolva",
    REJECTED: "Elutasítva",
    CANCELLED: "Lemondva",
  };

  return (
    <Shell wide>
      <div className="mb-10 flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          NOBLE — foglalások
        </h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-ink-soft underline underline-offset-4">
            Kilépés
          </button>
        </form>
      </div>

      {/* ---- Beállítások ---- */}
      <Section title="Beállítások">
        <form action={saveSettings} className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm text-ink-soft">
              Értesítési e-mail cím — ide érkeznek az új foglalások
            </span>
            <input
              type="email"
              name="notificationEmail"
              defaultValue={settings[SETTING_KEYS.notificationEmail]}
              placeholder="pl. noble@example.com"
              className="mt-1 w-full border border-line px-4 py-3 outline-none focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">Legkorábbi foglalás (óra múlva)</span>
            <input
              type="number"
              name="minLeadHours"
              min={0}
              max={168}
              defaultValue={settings[SETTING_KEYS.minLeadHours]}
              className="mt-1 w-full border border-line px-4 py-3 outline-none focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">Meddig előre lehet foglalni (nap)</span>
            <input
              type="number"
              name="maxAdvanceDays"
              min={1}
              max={365}
              defaultValue={settings[SETTING_KEYS.maxAdvanceDays]}
              className="mt-1 w-full border border-line px-4 py-3 outline-none focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">Időpont-raszter (perc)</span>
            <input
              type="number"
              name="slotStepMin"
              min={5}
              max={60}
              step={5}
              defaultValue={settings[SETTING_KEYS.slotStepMin]}
              className="mt-1 w-full border border-line px-4 py-3 outline-none focus:border-ink"
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-dark">
              Beállítások mentése
            </button>
          </div>
        </form>
      </Section>

      {/* ---- Heti nyitvatartás ---- */}
      <Section
        title="Heti nyitvatartás"
        hint="Ez adja meg, mikor lehet foglalni. Amit kipipálsz, arra a napra lehet időpontot kérni."
      >
        <form action={saveHours}>
          <div className="space-y-3">
            {weekly.map((w) => (
              <div key={w.dayOfWeek} className="flex flex-wrap items-center gap-3">
                <label className="flex w-40 items-center gap-2">
                  <input
                    type="checkbox"
                    name={`open_${w.dayOfWeek}`}
                    defaultChecked={w.isOpen}
                    className="h-4 w-4"
                  />
                  <span>{DAY_NAMES_HU[w.dayOfWeek - 1]}</span>
                </label>
                <input
                  type="time"
                  name={`from_${w.dayOfWeek}`}
                  defaultValue={minutesToLabel(w.openMin)}
                  className="border border-line px-3 py-2 outline-none focus:border-ink"
                />
                <span className="text-ink-soft">–</span>
                <input
                  type="time"
                  name={`to_${w.dayOfWeek}`}
                  defaultValue={minutesToLabel(w.closeMin)}
                  className="border border-line px-3 py-2 outline-none focus:border-ink"
                />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-dark mt-6">
            Nyitvatartás mentése
          </button>
        </form>
      </Section>

      {/* ---- Kivételes napok ---- */}
      <Section
        title="Kivételes napok"
        hint="Szabadság, ünnep vagy eltérő nyitvatartás egy konkrét napra. Felülírja a heti beállítást."
      >
        <form action={addOverride} className="grid gap-3 sm:grid-cols-5 sm:items-end">
          <label className="block sm:col-span-1">
            <span className="text-sm text-ink-soft">Dátum</span>
            <input
              type="date"
              name="date"
              required
              className="mt-1 w-full border border-line px-3 py-2 outline-none focus:border-ink"
            />
          </label>
          <label className="flex items-center gap-2 sm:col-span-1 sm:pb-3">
            <input type="checkbox" name="closed" defaultChecked className="h-4 w-4" />
            <span className="text-sm">Zárva</span>
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">Nyitás</span>
            <input
              type="time"
              name="from"
              className="mt-1 w-full border border-line px-3 py-2 outline-none focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">Zárás</span>
            <input
              type="time"
              name="to"
              className="mt-1 w-full border border-line px-3 py-2 outline-none focus:border-ink"
            />
          </label>
          <button type="submit" className="btn btn-dark">
            Hozzáadás
          </button>
        </form>

        {overrides.length > 0 && (
          <ul className="mt-6 divide-y divide-line border border-line">
            {overrides.map((o) => {
              const iso = o.date.toISOString().slice(0, 10);
              return (
                <li key={iso} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span>
                    <strong>{iso}</strong> —{" "}
                    {o.isClosed
                      ? "zárva"
                      : `${minutesToLabel(o.openMin ?? 0)}–${minutesToLabel(o.closeMin ?? 0)}`}
                    {o.note ? ` · ${o.note}` : ""}
                  </span>
                  <form action={removeOverride}>
                    <input type="hidden" name="date" value={iso} />
                    <button type="submit" className="text-sm text-red-700 underline">
                      Törlés
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* ---- Foglalások ---- */}
      <Section title="Foglalások" hint="Az elmúlt hét és minden jövőbeli foglalás.">
        {bookings.length === 0 ? (
          <p className="text-ink-soft">Még nincs foglalás.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-soft">
                  <th className="py-2 pr-4 font-medium">Időpont</th>
                  <th className="py-2 pr-4 font-medium">Szolgáltatás</th>
                  <th className="py-2 pr-4 font-medium">Vendég</th>
                  <th className="py-2 pr-4 font-medium">Állapot</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-line align-top">
                    <td className="py-3 pr-4">{formatDateTimeHu(b.startsAt)}</td>
                    <td className="py-3 pr-4">
                      {b.serviceName}
                      <span className="block text-ink-soft">
                        {b.durationMin} perc · {formatPrice(b.servicePrice)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {b.customerName}
                      <span className="block text-ink-soft">{b.phone}</span>
                      <span className="block text-ink-soft">{b.email}</span>
                      {b.note && <span className="mt-1 block italic">„{b.note}"</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-1 text-xs ${statusBadge[b.status]}`}>
                        {statusText[b.status]}
                      </span>
                    </td>
                    <td className="py-3">
                      {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                        <div className="flex flex-col gap-2">
                          <a
                            href={`/kezeles/${b.ownerToken}`}
                            className="text-xs underline underline-offset-2"
                          >
                            Elbírálás
                          </a>
                          <form action={cancelBooking}>
                            <input type="hidden" name="id" value={b.id} />
                            <button type="submit" className="text-xs text-red-700 underline">
                              Lemondás
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </Shell>
  );
}

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="min-h-screen bg-paper py-16">
      <div className={`mx-auto px-5 sm:px-8 ${wide ? "max-w-5xl" : "max-w-md"}`}>{children}</div>
    </main>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
