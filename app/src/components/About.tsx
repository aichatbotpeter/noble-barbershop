import Image from "next/image";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

/**
 * „Rólunk" szekció — a referencia felépítését követi: teljes szélességű
 * falfelület háttérként, középre zárt szöveg, a szalon fotójával.
 *
 * ⚠️ A szöveg csak arról szól, AMIT tudunk (időpontos működés, egy vendég
 * egyszerre, klasszikus barber-szakma). Dávid életrajzát nem találtam ki —
 * ha küld egy saját bekezdést, ide kerül.
 */
export default function About() {
  return (
    <section id="rolunk" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      {/* A szalon saját falfelülete háttérként, lassan úszva */}
      <div className="absolute inset-0 -z-10">
        <Parallax speed={0.12} className="absolute inset-x-0 -top-24 bottom-[-6rem]">
          <div className="relative h-full w-full">
            <Image
              src={asset("/images/wall-texture.jpg")}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        {/* Enyhe világosítás, hogy a sötét szöveg mindenhol olvasható legyen,
            de a falfelület érződjön */}
        <div className="absolute inset-0 bg-paper/20" />
      </div>

      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="h-section flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>a</span>
            <Image
              src={asset("/images/noble-logo-dark.png")}
              alt="NOBLE"
              width={387}
              height={256}
              className="h-[1.55em] w-auto translate-y-[0.06em]"
            />
            <span>-ről</span>
          </h2>
        </Reveal>

        <Reveal delay={90}>
          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">
            Üdvözlünk a NOBLE Barbershopban, ahol a klasszikus borbélyszakma és a
            mai fazonok találkoznak — Kecskemét szívében, az Izsáki úton.
          </p>
        </Reveal>

        <Reveal delay={170}>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark mt-10"
          >
            Foglalj időpontot
          </a>
        </Reveal>

        <Reveal delay={80} className="mt-20">
          <div className="mx-auto w-full max-w-md">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={asset(site.master.photo)}
                alt={`${site.master.name} — ${site.master.role}`}
                fill
                sizes="(max-width: 640px) 90vw, 448px"
                className="object-cover"
              />
            </div>
            <p className="mt-6 font-[family-name:var(--font-display)] text-xl font-semibold">
              {site.master.name}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{site.master.role}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h3 className="mx-auto mt-20 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.35rem,3.2vw,1.85rem)] font-semibold leading-snug">
            Egyszerre egy vendég, foglalt időpontra — hogy a végén tényleg az
            legyen, amit szerettél volna.
          </h3>
        </Reveal>

        <div className="mx-auto mt-10 max-w-3xl space-y-7 text-base leading-relaxed text-ink-soft sm:text-lg">
          <Reveal delay={60}>
            <p>
              A NOBLE nem futószalag. Nálunk van idő végigbeszélni, mit szeretnél,
              és van idő rendesen megcsinálni. Ezért dolgozunk bejelentkezés
              alapján, és ezért nem sürgetünk senkit.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p>
              Pontos átmenetek, tiszta kontúrok, szakállformázás borotvával és forró
              törölközővel. A férfi hajak és szakállak specialistái vagyunk — ha
              pedig nem tudod pontosan, mi állna jól, arra is van szakmai vélemény.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <p>
              Hisszük, hogy egy hajvágás nem tíz perc a napodból, hanem az a pont,
              ahonnan rendben van a hét. Célunk, hogy legalább annyira várd a
              következő időpontodat, mint amennyire mi várunk téged.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
