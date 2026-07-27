import Image from "next/image";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-mist"
    >
      <div className="absolute inset-0">
        {/*
          A szalon saját névfala. A kivágás felfelé tolva, hogy a falon lévő
          NOBLE felirat a felső harmadban maradjon — a szöveg alatta kap helyet.
        */}
        <Image
          src="/images/shop-wall.jpg"
          alt="A NOBLE Barbershop névfala a szalonban"
          fill
          priority
          sizes="100vw"
          className="scale-[1.35] object-cover object-[center_10%]"
        />
        {/*
          Éles töréspontú színátmenet: a felső ~55% szinte tiszta marad, hogy a
          névfal látszódjon, alatta gyorsan besötétedik a szöveg alá.
        */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.72)_62%,rgba(0,0,0,0.9)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-[52vh] text-center">
        <h1 className="h-hero text-white">{site.heroHeadline}</h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {site.heroLead}
        </p>

        <a
          href={site.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-light mt-10"
        >
          Foglalj időpontot
        </a>

        <p className="mt-6 text-sm text-white/65">{site.hoursNote}</p>
      </div>
    </section>
  );
}
