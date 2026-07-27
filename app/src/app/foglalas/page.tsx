import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Időpontfoglalás",
  description:
    "Foglalj időpontot online a NOBLE Barbershopba — Kecskemét, Izsáki út 2. Hajvágás, szakálligazítás, kreatív fazonok.",
};

export default function BookingPage() {
  return (
    <>
      <Header />
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
