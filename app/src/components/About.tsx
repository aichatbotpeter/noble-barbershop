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
            src={asset("/images/rolunk-szeman-david.jpg")}
            alt="Széman Dávid munka közben a NOBLE Barbershopban"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        {/* Szöveg */}
        <div className="flex items-center px-5 py-20 sm:px-10 lg:py-28 xl:px-20">
          <div className="mx-auto max-w-xl">
            <Reveal from="right">
              {/*
                A TELJES logó helyett csak a NOBLE szó kerül a mondatba —
                a barber pole és a szlogen kicsiben zsúfolt volt, és nem ült
                a sorban. A szó magassága a nagybetűk magasságára van állítva,
                így pontosan a szöveg alapvonalán áll.
              */}
              <h2 className="h-section flex flex-wrap items-baseline gap-x-[0.28em]">
                <span>a</span>
                <Image
                  src={asset("/images/noble-wordmark-dark.png")}
                  alt="NOBLE"
                  width={387}
                  height={61}
                  className="h-[0.70em] w-auto translate-y-[0.02em]"
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
