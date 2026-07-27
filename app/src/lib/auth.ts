import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Egyszerű jelszavas védelem az admin felülethez.
 *
 * Nincs felhasználó-kezelés: egy jelszó van (ADMIN_PASSWORD env-változó),
 * és a sikeres belépés után egy aláírt süti igazolja a munkamenetet.
 * Egy egyfős szalonhoz ez elég; ha több munkatárs lesz, ide jöhet valódi auth.
 */

const COOKIE_NAME = "noble_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 nap

function secret(): string {
  // Ha nincs külön session-titok, a jelszóból származtatunk egyet.
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

function expectedToken(): string {
  return createHmac("sha256", secret()).update("noble-admin-v1").digest("hex");
}

/** Egyenlő hosszú, időzítés-független összehasonlítás. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export async function isLoggedIn(): Promise<boolean> {
  if (!isPasswordConfigured()) return false;
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return safeEqual(value, expectedToken());
}

export async function signIn(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
