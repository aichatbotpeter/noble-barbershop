import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import { prisma } from "@/lib/db";
import { sendCancelledToOwner } from "@/lib/email";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATUS_TEXT: Record<string, { title: string; body: string }> = {
  PENDING: {
    title: "Foglalásod visszaigazolásra vár",
    body: "Megkaptuk a foglalásod. Amint Dávid visszaigazolja, küldünk egy megerősítő e-mailt.",
  },
  CONFIRMED: {
    title: "Az időpontod megerősítve",
    body: "Minden rendben, várunk szeretettel!",
  },
  REJECTED: {
    title: "Ezt az időpontot nem tudtuk vállalni",
    body: "Kérlek válassz másik időpontot, vagy hívj minket telefonon.",
  },
  CANCELLED: {
    title: "Ez a foglalás le van mondva",
    body: "Ha mégis szeretnél jönni, foglalj új időpontot.",
  },
};

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({ where: { manageToken: token } });
  if (!booking) notFound();

  /** A vendég lemondja a foglalást — az időpont ettől újra szabaddá válik. */
  async function cancel() {
    "use server";
    const current = await prisma.booking.findUnique({ where: { manageToken: token } });
    if (!current) return;
    // Már lezárt foglalást nem bántunk.
    if (current.status === "CANCELLED" || current.status === "REJECTED") return;

    const updated = await prisma.booking.update({
      where: { manageToken: token },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
    await sendCancelledToOwner(updated);
    revalidatePath(`/foglalas/${token}`);
  }

  const text = STATUS_TEXT[booking.status];
  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";
  const inPast = booking.startsAt.getTime() < Date.now();

  return (
    <>
      <Header />
      <main className="flex-1 bg-paper pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <h1 className="h-section">{text.title}</h1>
          <p className="mx-auto mt-6 max-w-lg text-ink-soft">{text.body}</p>

          <BookingSummary
            serviceName={booking.serviceName}
            servicePrice={booking.servicePrice}
            durationMin={booking.durationMin}
            startsAt={booking.startsAt}
            customerName={booking.customerName}
          />

          {canCancel && !inPast && (
            <form action={cancel} className="mt-10">
              <button type="submit" className="btn btn-ghost text-ink">
                Foglalás lemondása
              </button>
              <p className="mt-3 text-sm text-ink-soft">
                Ha nem tudsz jönni, kérünk mondd le, hogy más foglalhassa.
              </p>
            </form>
          )}

          <p className="mt-12 text-sm text-ink-soft">
            Kérdésed van? Hívj minket:{" "}
            <a href={site.contact.phoneHref} className="text-gold underline underline-offset-4">
              {site.contact.phone}
            </a>
          </p>

          <a href="/foglalas" className="btn btn-dark mt-8">
            Új időpont foglalása
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
