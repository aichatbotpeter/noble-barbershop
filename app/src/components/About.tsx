import Image from "next/image";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

/**
 * „Rólunk" szekció — kétoszlopos, szerkesztőségi elrendezés.
 *
 * A fotó a bal szélig kifut, a szöveg mellette áll: így nincs se nagy üres
 * fehér felület, se lebegő téglalap a semmi közepén. Mobilon egymás alá kerül.
 *
 * ⚠️ A szöveg csak arról szól, AMIT tudunk (időpontos működés, egy vendég
 * egyszerre, klasszikus barber-szakma). Dávid életrajzát nem találtam ki —
 * ha küld egy saját bekezdést, ide kerül.
 */
export default function About() {
  return (
    <section id="rolunk" className="bg-paper">
      <div className="grid lg:grid-cols-2">
        {/* Fotó — asztali nézetben a bal szélig kifut */}
        <Reveal from="left" className="relative min-h-[60vh] lg:min-h-[92vh]">
          <Image
            src={asset("/images/about-david.jpg")}
            alt="Vendég kávéval a NOBLE Barbershopban"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        {/* Szöveg */}
        <div className="flex items-center px-5 py-20 sm:px-10 lg:py-28 xl:px-20">
          <div className="mx-auto max-w-xl">
            <Reveal from="right">
              <h2 className="h-section flex flex-wrap items-baseline gap-x-3">
                <span>a</span>
                <Image
                  src={asset("/images/noble-logo-dark.png")}
                  alt="NOBLE"
                  width={387}
                  height={256}
                  // A logóban a szó alatt van a szlogen is, ezért a talpvonalhoz
                  // igazítjuk, különben „lóg" a sorban.
                  className="h-[1.15em] w-auto translate-y-[0.14em]"
                />
                <span>-ről</span>
              </h2>
            </Reveal>

            <Reveal from="right" delay={90}>
              <p className="mt-8 text-lg leading-relaxed text-ink sm:text-xl">
                Klasszikus borbélyszakma és mai fazonok — Kecskemét szívében, az
                Izsáki úton. Egyszerre egy vendég, foglalt időpontra.
              </p>
            </Reveal>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink-soft">
              <Reveal from="right" delay={140}>
                <p>
                  A NOBLE nem futószalag. Van idő végigbeszélni, mit szeretnél, és
                  van idő rendesen megcsinálni. Ezért dolgozunk bejelentkezés
                  alapján, és ezért nem sürgetünk senkit.
                </p>
              </Reveal>
              <Reveal from="right" delay={190}>
                <p>
                  Pontos átmenetek, tiszta kontúrok, szakállformázás borotvával és
                  forró törölközővel. Ha nem tudod pontosan, mi állna jól, arra is
                  van szakmai vélemény.
                </p>
              </Reveal>
              <Reveal from="right" delay={240}>
                <p>
                  Hisszük, hogy egy hajvágás nem tíz perc a napodból, hanem az a
                  pont, ahonnan rendben van a hét.
                </p>
              </Reveal>
            </div>

            <Reveal from="right" delay={290}>
              <p className="mt-10 font-[family-name:var(--font-display)] text-lg font-semibold">
                {site.master.name}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{site.master.role}</p>

              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark mt-8"
              >
                Foglalj időpontot
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
