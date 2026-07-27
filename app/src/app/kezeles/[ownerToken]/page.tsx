import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import { prisma } from "@/lib/db";
import { sendConfirmedToCustomer, sendRejectedToCustomer } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Dávid döntő felülete — az értesítő e-mailből nyílik.
 *
 * A döntés SZÁNDÉKOSAN gombnyomásra (POST) történik, nem a link megnyitására:
 * a levelezőrendszerek link-ellenőrzői végigjárják a leveleken lévő linkeket,
 * és egy GET-re működő visszaigazolás így magától lefutna.
 */
export default async function OwnerDecisionPage({
  params,
  searchParams,
}: {
  params: Promise<{ ownerToken: string }>;
  searchParams: Promise<{ dontes?: string }>;
}) {
  const { ownerToken } = await params;
  const { dontes } = await searchParams;

  const booking = await prisma.booking.findUnique({ where: { ownerToken } });
  if (!booking) notFound();

  async function decide(formData: FormData) {
    "use server";
    const action = String(formData.get("action"));

    const current = await prisma.booking.findUnique({ where: { ownerToken } });
    if (!current || current.status !== "PENDING") return; // már döntöttek róla

    if (action === "confirm") {
      const updated = await prisma.booking.update({
        where: { ownerToken },
        data: { status: "CONFIRMED", decidedAt: new Date() },
      });
      await sendConfirmedToCustomer(updated);
    } else if (action === "reject") {
      const updated = await prisma.booking.update({
        where: { ownerToken },
        data: { status: "REJECTED", decidedAt: new Date() },
      });
      await sendRejectedToCustomer(updated);
    }
    revalidatePath(`/kezeles/${ownerToken}`);
  }

  const decided = booking.status !== "PENDING";
  const statusLabel: Record<string, string> = {
    CONFIRMED: "Visszaigazolva — a vendég értesítést kapott.",
    REJECTED: "Elutasítva — a vendég értesítést kapott.",
    CANCELLED: "A vendég lemondta ezt a foglalást.",
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-paper pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <h1 className="h-section">
            {decided ? "Ez a foglalás lezárva" : "Foglalás elbírálása"}
          </h1>

          {decided ? (
            <p className="mx-auto mt-6 max-w-lg text-ink-soft">
              {statusLabel[booking.status]}
            </p>
          ) : (
            <p className="mx-auto mt-6 max-w-lg text-ink-soft">
              Az időpont addig foglalt, amíg nem döntesz — más nem tud rá jelentkezni.
            </p>
          )}

          <BookingSummary
            serviceName={booking.serviceName}
            servicePrice={booking.servicePrice}
            durationMin={booking.durationMin}
            startsAt={booking.startsAt}
            customerName={booking.customerName}
            phone={booking.phone}
          />

          {booking.note && (
            <p className="mx-auto mt-6 max-w-md border border-line bg-mist/40 p-4 text-left text-sm">
              <strong>Megjegyzés:</strong> {booking.note}
            </p>
          )}

          {!decided && (
            <form action={decide} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="submit"
                name="action"
                value="confirm"
                className="btn btn-dark"
                // Ha a levélben a "Visszaigazolom"-ra kattintott, ez van előre kiemelve
                autoFocus={dontes === "visszaigazolas"}
              >
                Visszaigazolom
              </button>
              <button
                type="submit"
                name="action"
                value="reject"
                className="btn btn-ghost text-ink"
                autoFocus={dontes === "elutasitas"}
              >
                Elutasítom
              </button>
            </form>
          )}

          <a href="/admin" className="mt-12 inline-block text-sm text-ink-soft underline underline-offset-4">
            Összes foglalás és beállítások
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
