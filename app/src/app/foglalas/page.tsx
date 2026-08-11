import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";

/**
 * A saját foglaló 2026-08-11 óta NEM aktív: a foglalás a Salonicban történik
 * (`site.bookingUrl`), és erre az oldalra semmi nem hivatkozik. A kód azért
 * maradt bent, hogy egy sor átírásával visszakapcsolható legyen — de amíg
 * árván áll, a keresőkből ki kell zárni, különben a Google indexelné és
 * ütközne az igazi foglalási úttal.
 */
export const metadata: Metadata = {
  title: "Időpontfoglalás",
  description:
    "Foglalj időpontot online a NOBLE Barbershopba — Kecskemét, Izsáki út 2. Hajvágás, szakálligazítás, kreatív fazonok.",
  robots: { index: false, follow: false },
};

export default function BookingPage() {
  return (
    <>
      <Header solid />
      <main className="flex-1 bg-paper pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h1 className="h-section text-center">Időpontfoglalás</h1>
          <p className="mx-auto mt-6 max-w-xl text-center text-ink-soft">
            Válaszd ki a szolgáltatást, a napot és az időpontot — a többit
            elintézzük.
          </p>

          <div className="mt-16">
            <BookingForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
