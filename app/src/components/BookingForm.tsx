"use client";

import { useEffect, useMemo, useState } from "react";
import { site, formatPrice } from "@/lib/site";

type Slot = { minutes: number; label: string; startsAt: string };

type Service = (typeof site.services)[number];

/** A következő N nap listája budapesti idő szerint. */
function upcomingDays(count: number): { iso: string; label: string; dayShort: string }[] {
  const fmtISO = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const fmtDay = new Intl.DateTimeFormat("hu-HU", {
    timeZone: "Europe/Budapest",
    weekday: "short",
  });
  const fmtLabel = new Intl.DateTimeFormat("hu-HU", {
    timeZone: "Europe/Budapest",
    month: "short",
    day: "numeric",
  });

  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.now() + i * 86_400_000);
    out.push({
      iso: fmtISO.format(d),
      label: fmtLabel.format(d),
      dayShort: fmtDay.format(d),
    });
  }
  return out;
}

export default function BookingForm() {
  const [service, setService] = useState<Service | null>(null);
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const days = useMemo(() => upcomingDays(28), []);

  // Ha szolgáltatást vagy napot vált, újra le kell kérni a szabad időpontokat.
  useEffect(() => {
    if (!service || !dateISO) {
      setSlots(null);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlot(null);

    fetch(
      `/api/availability?date=${dateISO}&service=${encodeURIComponent(service.name)}`,
    )
      .then((r) => r.json())
      .then((data: { slots?: Slot[] }) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [service, dateISO]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!service || !slot) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.name,
          startsAt: slot.startsAt,
          name,
          phone,
          email,
          note,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Nem sikerült a foglalás.");
        // Ha elkelt az időpont, frissítjük a listát, hogy lássa mi maradt.
        if (res.status === 409 && service && dateISO) {
          setSlot(null);
          const r = await fetch(
            `/api/availability?date=${dateISO}&service=${encodeURIComponent(service.name)}`,
          );
          const fresh = (await r.json()) as { slots?: Slot[] };
          setSlots(fresh.slots ?? []);
        }
        return;
      }
      setDone(true);
    } catch {
      setError("Hálózati hiba. Próbáld újra.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h2 className="h-section">Köszönjük!</h2>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          A foglalásodat rögzítettük, és küldtünk róla egy e-mailt. Amint Dávid
          visszaigazolja, kapsz egy megerősítést is.
        </p>
        <a href="/" className="btn btn-dark mt-10">
          Vissza a főoldalra
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl">
      {/* 1. lépés — szolgáltatás */}
      <fieldset>
        <legend className="font-[family-name:var(--font-display)] text-xl font-semibold">
          1. Válassz szolgáltatást
        </legend>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {site.services.map((s) => {
            const active = service?.name === s.name;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setService(s)}
                aria-pressed={active}
                className={`border p-4 text-left transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper hover:border-ink/40"
                }`}
              >
                <span className="block font-[family-name:var(--font-display)] font-semibold">
                  {s.name}
                </span>
                <span
                  className={`mt-1 block text-sm ${active ? "text-paper/70" : "text-ink-soft"}`}
                >
                  {s.minutes} perc · {formatPrice(s.price)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 2. lépés — nap */}
      {service && (
        <fieldset className="mt-14">
          <legend className="font-[family-name:var(--font-display)] text-xl font-semibold">
            2. Válassz napot
          </legend>
          <div className="mt-6 flex snap-x gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const active = dateISO === d.iso;
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setDateISO(d.iso)}
                  aria-pressed={active}
                  className={`min-w-[5.2rem] shrink-0 snap-start border px-3 py-3 text-center transition-colors ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper hover:border-ink/40"
                  }`}
                >
                  <span className="block text-xs uppercase tracking-wider opacity-70">
                    {d.dayShort}
                  </span>
                  <span className="mt-1 block font-[family-name:var(--font-display)] font-semibold">
                    {d.label}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 3. lépés — időpont */}
      {service && dateISO && (
        <fieldset className="mt-14">
          <legend className="font-[family-name:var(--font-display)] text-xl font-semibold">
            3. Válassz időpontot
          </legend>

          {slotsLoading && <p className="mt-6 text-ink-soft">Szabad időpontok keresése…</p>}

          {!slotsLoading && slots && slots.length === 0 && (
            <p className="mt-6 text-ink-soft">
              Ezen a napon nincs szabad időpont ehhez a szolgáltatáshoz. Válassz
              másik napot.
            </p>
          )}

          {!slotsLoading && slots && slots.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {slots.map((s) => {
                const active = slot?.startsAt === s.startsAt;
                return (
                  <button
                    key={s.startsAt}
                    type="button"
                    onClick={() => setSlot(s)}
                    aria-pressed={active}
                    className={`border py-3 text-center font-[family-name:var(--font-display)] font-semibold transition-colors ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper hover:border-ink/40"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>
      )}

      {/* 4. lépés — adatok */}
      {service && slot && (
        <fieldset className="mt-14">
          <legend className="font-[family-name:var(--font-display)] text-xl font-semibold">
            4. Az adataid
          </legend>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-ink-soft">Név</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="mt-1 w-full border border-line bg-paper px-4 py-3 outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="text-sm text-ink-soft">Telefonszám</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="+36 30 123 4567"
                className="mt-1 w-full border border-line bg-paper px-4 py-3 outline-none focus:border-ink"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-ink-soft">E-mail cím</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full border border-line bg-paper px-4 py-3 outline-none focus:border-ink"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-ink-soft">Megjegyzés (nem kötelező)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-line bg-paper px-4 py-3 outline-none focus:border-ink"
              />
            </label>
          </div>

          <div className="mt-8 border border-line bg-mist/40 p-5">
            <p className="font-[family-name:var(--font-display)] font-semibold">
              {service.name}
            </p>
            <p className="mt-1 text-ink-soft">
              {new Intl.DateTimeFormat("hu-HU", {
                timeZone: "Europe/Budapest",
                weekday: "long",
                month: "long",
                day: "numeric",
              }).format(new Date(slot.startsAt))}
              , {slot.label} · {service.minutes} perc · {formatPrice(service.price)}
            </p>
          </div>

          {error && (
            <p role="alert" className="mt-6 border border-red-300 bg-red-50 p-4 text-red-800">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-dark mt-8 w-full disabled:opacity-60">
            {submitting ? "Küldés…" : "Foglalás elküldése"}
          </button>

          <p className="mt-4 text-center text-sm text-ink-soft">
            A foglalás Dávid visszaigazolása után válik véglegessé — erről e-mailt küldünk.
          </p>
        </fieldset>
      )}
    </form>
  );
}
