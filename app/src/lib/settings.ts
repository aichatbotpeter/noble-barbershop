import { prisma } from "./db";

/**
 * Beállítások, amiket Dávid az admin felületen állít.
 * Kulcs-érték párokként tároljuk, hogy új beállításhoz ne kelljen migrálni.
 */

export const SETTING_KEYS = {
  /** Ide mennek az új foglalásról szóló értesítők. */
  notificationEmail: "notificationEmail",
  /** Hány órával előre kell legkorábban foglalni. */
  minLeadHours: "minLeadHours",
  /** Hány napra előre lehet foglalni. */
  maxAdvanceDays: "maxAdvanceDays",
  /** Slot-raszter percben (pl. 15 -> 08:00, 08:15, 08:30 …). */
  slotStepMin: "slotStepMin",
} as const;

const DEFAULTS: Record<string, string> = {
  [SETTING_KEYS.notificationEmail]: "",
  [SETTING_KEYS.minLeadHours]: "2",
  [SETTING_KEYS.maxAdvanceDays]: "60",
  [SETTING_KEYS.slotStepMin]: "15",
};

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function getNumericSetting(key: string): Promise<number> {
  const raw = await getSetting(key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number(DEFAULTS[key] ?? 0);
}
