import Image from "next/image";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-mist"
    >
      <div className="absolute inset-0 overflow-hidden">
        {site.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            src={asset(site.heroVideo)}
            autoPlay
            muted
            loop
            playsInline
            // A poszter addig látszik, amíg a videó első kockája megjön
            poster={asset("/images/shop-wall.jpg")}
          />
        ) : (
          // Videó híján a névfal-fotó lassan mozog — így a hero nem hat állóképnek.
          <Image
            src={asset("/images/shop-wall.jpg")}
            alt="A NOBLE Barbershop névfala a szalonban"
            fill
            priority
            sizes="100vw"
            // Fekete-fehér, emelt kontraszttal — így karakteres és nem fakó.
            className="animate-kenburns object-cover object-[center_18%] grayscale contrast-[1.25] brightness-[0.82]"
          />
        )}

        {/* Alulról erősödő sötétítés, hogy a fehér szöveg olvasható legyen */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.32)_36%,rgba(0,0,0,0.72)_66%,rgba(0,0,0,0.92)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-28 pt-[46vh] text-center">
        <Reveal from="none">
          <h1 className="h-hero text-white [text-wrap:balance]">{site.heroHeadline}</h1>
        </Reveal>

        <Reveal delay={220} from="none">
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {site.heroLead}
          </p>
        </Reveal>
      </div>

      {/* Görgetés-jelző */}
      <a
        href="#rolunk"
        aria-label="Tovább a bemutatkozáshoz"
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-12 justify-center text-white/70 transition-colors hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-scrollhint h-7 w-7"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
