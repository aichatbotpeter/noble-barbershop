import { Resend } from "resend";
import { site, formatPrice, fullAddress } from "./site";
import { formatDateTimeHu } from "./time";
import { getSetting, SETTING_KEYS } from "./settings";

/**
 * E-mail küldés Resenden át.
 *
 * A feladó cím a RESEND_FROM env-változóból jön — ehhez a domaint
 * igazolni kell a Resendben. Amíg nincs kulcs beállítva, a küldés
 * csendben kimarad (a foglalás így is létrejön), és a szerver logba kerül.
 */

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

const FROM = process.env.RESEND_FROM ?? `${site.fullName} <onboarding@resend.dev>`;

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

type BookingLike = {
  id: string;
  serviceName: string;
  servicePrice: number;
  durationMin: number;
  startsAt: Date;
  customerName: string;
  phone: string;
  email: string;
  note: string | null;
  manageToken: string;
  ownerToken: string;
};

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY hiányzik — kimaradt: "${subject}" -> ${to}`);
    return;
  }
  if (!to) {
    console.warn(`[email] nincs címzett — kimaradt: "${subject}"`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (error) {
    // A foglalás ettől még érvényes — az e-mail hibát nem engedjük felbukni.
    console.error(`[email] sikertelen küldés ("${subject}" -> ${to}):`, error);
  }
}

/** Közös burkoló, hogy minden levél egységesen nézzen ki. */
function wrap(title: string, body: string): string {
  return `<!doctype html>
<html lang="hu"><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#1d1e20;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px;">
    <div style="text-align:center;font-size:22px;letter-spacing:8px;padding-bottom:6px;">NOBLE</div>
    <div style="text-align:center;font-size:10px;letter-spacing:3px;color:#a88858;padding-bottom:24px;">MALE HAIRDRESSING &amp; BARBERING</div>
    <h1 style="font-size:20px;margin:0 0 18px;">${title}</h1>
    ${body}
    <hr style="border:none;border-top:1px solid #e4e5e9;margin:28px 0 16px;">
    <p style="font-size:12px;color:#6b6d72;margin:0;line-height:1.6;">
      ${site.fullName}<br>${fullAddress}<br>${site.contact.phone}
    </p>
  </div>
</body></html>`;
}

function detailsTable(b: BookingLike): string {
  return `<table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr><td style="padding:6px 0;color:#6b6d72;">Szolgáltatás</td><td style="padding:6px 0;text-align:right;"><strong>${b.serviceName}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#6b6d72;">Időpont</td><td style="padding:6px 0;text-align:right;"><strong>${formatDateTimeHu(b.startsAt)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#6b6d72;">Időtartam</td><td style="padding:6px 0;text-align:right;">${b.durationMin} perc</td></tr>
    <tr><td style="padding:6px 0;color:#6b6d72;">Ár</td><td style="padding:6px 0;text-align:right;">${formatPrice(b.servicePrice)}</td></tr>
  </table>`;
}

/** Dávidnak: új foglalás érkezett, két gombbal. */
export async function sendNewBookingToOwner(b: BookingLike): Promise<void> {
  const to = await getSetting(SETTING_KEYS.notificationEmail);
  // Dávid saját tokenje — a vendég ezt nem kapja meg.
  const confirm = `${baseUrl()}/kezeles/${b.ownerToken}?dontes=visszaigazolas`;
  const reject = `${baseUrl()}/kezeles/${b.ownerToken}?dontes=elutasitas`;

  await send(
    to,
    `Új foglalás — ${b.customerName}, ${formatDateTimeHu(b.startsAt)}`,
    wrap(
      "Új foglalás érkezett",
      `${detailsTable(b)}
      <table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:18px;">
        <tr><td style="padding:6px 0;color:#6b6d72;">Vendég</td><td style="padding:6px 0;text-align:right;"><strong>${b.customerName}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#6b6d72;">Telefon</td><td style="padding:6px 0;text-align:right;"><a href="tel:${b.phone}" style="color:#1d1e20;">${b.phone}</a></td></tr>
        <tr><td style="padding:6px 0;color:#6b6d72;">E-mail</td><td style="padding:6px 0;text-align:right;"><a href="mailto:${b.email}" style="color:#1d1e20;">${b.email}</a></td></tr>
      </table>
      ${b.note ? `<p style="background:#f4f4f5;padding:12px;font-size:14px;margin:16px 0 0;"><strong>Megjegyzés:</strong><br>${escapeHtml(b.note)}</p>` : ""}
      <p style="margin:26px 0 10px;font-size:14px;color:#6b6d72;">Az időpont addig is foglalt, más nem tud rá jelentkezni.</p>
      <table style="width:100%;margin-top:8px;"><tr>
        <td style="padding-right:6px;"><a href="${confirm}" style="display:block;background:#1d1e20;color:#ffffff;text-decoration:none;text-align:center;padding:14px;font-weight:bold;">Visszaigazolom</a></td>
        <td style="padding-left:6px;"><a href="${reject}" style="display:block;background:#ffffff;color:#1d1e20;border:1px solid #1d1e20;text-decoration:none;text-align:center;padding:13px;font-weight:bold;">Elutasítom</a></td>
      </tr></table>`,
    ),
  );
}

/** Vendégnek: megkaptuk a foglalást, visszaigazolásra vár. */
export async function sendReceivedToCustomer(b: BookingLike): Promise<void> {
  await send(
    b.email,
    `Foglalásodat rögzítettük — ${formatDateTimeHu(b.startsAt)}`,
    wrap(
      `Köszönjük, ${escapeHtml(b.customerName)}!`,
      `<p style="font-size:15px;line-height:1.6;margin:0 0 18px;">
        Foglalásodat rögzítettük. Amint Dávid visszaigazolja, küldünk egy megerősítő e-mailt.
      </p>
      ${detailsTable(b)}
      <p style="margin:24px 0 0;font-size:14px;">
        <a href="${baseUrl()}/foglalas/${b.manageToken}" style="color:#a88858;">Foglalás megtekintése és lemondása</a>
      </p>`,
    ),
  );
}

/** Vendégnek: Dávid visszaigazolta. */
export async function sendConfirmedToCustomer(b: BookingLike): Promise<void> {
  await send(
    b.email,
    `Időpontod megerősítve — ${formatDateTimeHu(b.startsAt)}`,
    wrap(
      "Az időpontod megerősítve",
      `<p style="font-size:15px;line-height:1.6;margin:0 0 18px;">
        Kedves ${escapeHtml(b.customerName)}, várunk szeretettel!
      </p>
      ${detailsTable(b)}
      <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#6b6d72;">
        Cím: ${fullAddress}<br>
        Ha mégsem tudsz jönni, kérünk mondd le, hogy más foglalhassa:
        <a href="${baseUrl()}/foglalas/${b.manageToken}" style="color:#a88858;">foglalás kezelése</a>.
      </p>`,
    ),
  );
}

/** Vendégnek: sajnos nem fér bele. */
export async function sendRejectedToCustomer(b: BookingLike): Promise<void> {
  await send(
    b.email,
    "A kért időpontot sajnos nem tudjuk vállalni",
    wrap(
      "Sajnos nem tudjuk vállalni",
      `<p style="font-size:15px;line-height:1.6;margin:0 0 18px;">
        Kedves ${escapeHtml(b.customerName)}, sajnáljuk — a kért időpont
        (${formatDateTimeHu(b.startsAt)}) mégsem elérhető.
      </p>
      <p style="font-size:15px;line-height:1.6;">
        Kérlek válassz másik időpontot, vagy hívj minket a
        <a href="tel:${site.contact.phone}" style="color:#a88858;">${site.contact.phone}</a> számon.
      </p>
      <p style="margin-top:22px;">
        <a href="${baseUrl()}/foglalas" style="display:inline-block;background:#1d1e20;color:#ffffff;text-decoration:none;padding:14px 26px;font-weight:bold;">Új időpont választása</a>
      </p>`,
    ),
  );
}

/** Dávidnak: a vendég lemondta. */
export async function sendCancelledToOwner(b: BookingLike): Promise<void> {
  const to = await getSetting(SETTING_KEYS.notificationEmail);
  await send(
    to,
    `Lemondott foglalás — ${b.customerName}, ${formatDateTimeHu(b.startsAt)}`,
    wrap(
      "Egy vendég lemondta az időpontját",
      `${detailsTable(b)}
      <p style="margin-top:18px;font-size:15px;">Vendég: <strong>${escapeHtml(b.customerName)}</strong> · ${b.phone}</p>
      <p style="font-size:14px;color:#6b6d72;">Az időpont felszabadult, újra foglalható.</p>`,
    ),
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
