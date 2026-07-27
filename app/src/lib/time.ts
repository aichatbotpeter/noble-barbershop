/**
 * Időzóna-kezelés.
 *
 * Az adatbázisban minden UTC-ben van, a felületen viszont budapesti
 * fal-óra szerint gondolkodunk („08:00-kor nyitunk"). Ez a két irány közti
 * átváltás — nyári/téli időszámítás-váltáskor is helyesen.
 */

export const TIME_ZONE = "Europe/Budapest";

/** Hány perccel jár a budapesti idő az UTC előtt egy adott pillanatban. */
function offsetMinutes(instant: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const asIfUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return (asIfUtc - instant.getTime()) / 60_000;
}

/**
 * "2026-08-03" + 480 perc (= budapesti 08:00) -> a megfelelő UTC pillanat.
 *
 * Kétlépcsős: először becslünk egy eltolással, majd az így kapott pillanatra
 * újraszámoljuk — így az óraátállítás napján is pontos marad.
 */
export function localToUtc(dateISO: string, minutesFromMidnight: number): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  const naive = Date.UTC(y, m - 1, d, 0, 0, 0) + minutesFromMidnight * 60_000;

  const firstGuess = new Date(naive - offsetMinutes(new Date(naive)) * 60_000);
  const refined = new Date(naive - offsetMinutes(firstGuess) * 60_000);
  return refined;
}

/** UTC pillanat -> budapesti "YYYY-MM-DD". */
export function utcToLocalDateISO(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** UTC pillanat -> budapesti perc éjféltől. */
export function utcToLocalMinutes(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return get("hour") * 60 + get("minute");
}

/** 480 -> "08:00" */
export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "08:00" -> 480. Érvénytelen bemenetnél null. */
export function labelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** ISO hétköznap-index (1 = hétfő … 7 = vasárnap) budapesti idő szerint. */
export function isoDayOfWeek(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const js = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = vasárnap
  return js === 0 ? 7 : js;
}

export const DAY_NAMES_HU = [
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
  "Vasárnap",
] as const;

/** Ember által olvasható dátum+idő, budapesti időben. */
export function formatDateTimeHu(instant: Date): string {
  return new Intl.DateTimeFormat("hu-HU", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(instant);
}
