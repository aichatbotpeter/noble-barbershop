import Image from "next/image";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

/**
 * „Rólunk" szekció.
 *
 * ⚠️ A szöveg szándékosan csak arról szól, AMIT tudunk (időpontos működés,
 * egy vendég egyszerre, klasszikus barber-szakma). Dávid életrajzát nem
 * találtam ki — ha küld egy saját bekezdést, ide kerül.
 */
export default function About() {
  return (
    <section id="rolunk" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section mx-auto max-w-3xl text-center">
            a <span className="text-gold">NOBLE</span>-ről
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-relaxed text-ink sm:text-xl">
            Üdvözlünk a NOBLE Barbershopban, ahol a klasszikus borbélyszakma és a
            mai fazonok találkoznak — Kecskemét szívében, az Izsáki úton.
          </p>
        </Reveal>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-[280px] lg:mx-0">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={asset(site.master.photo)}
                alt={`${site.master.name} — ${site.master.role}`}
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
            <p className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold">
              {site.master.name}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{site.master.role}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6 text-base leading-relaxed text-ink-soft sm:text-lg">
              <p>
                A NOBLE nem futószalag. Egyszerre egy vendég, foglalt időpontra —
                hogy legyen idő végigbeszélni, mit szeretnél, és hogy a végén
                tényleg az legyen a fejeden.
              </p>
              <p>
                Pontos átmenetek, tiszta kontúrok, szakállformázás borotvával és
                forró törölközővel. Ha nem tudod pontosan, mi állna jól, arra is
                van szakmai vélemény — a férfi hajak és szakállak specialistái
                vagyunk.
              </p>
              <p>
                Hisszük, hogy egy hajvágás nem tíz perc a napodból, hanem az a
                pont, ahonnan rendben van a hét. Ezért dolgozunk időpontra, és
                ezért nem sürgetünk senkit.
              </p>
            </div>

            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark mt-10"
            >
              Foglalj időpontot
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
