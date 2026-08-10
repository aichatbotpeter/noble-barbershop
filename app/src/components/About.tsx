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
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                Rólunk
              </p>

              {/*
                A logóból csak a NOBLE szó kerül a mondatba. A körülötte lévő
                „A" és „-ről" SZÁNDÉKOSAN könnyebb vágású és ritkított: a vastag
                Montserrat mellett a vékony talpas logó idegenül hatott.
              */}
              <h2 className="mt-4 flex flex-wrap items-baseline gap-x-[0.3em] font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.12] tracking-[0.02em]">
                <span>A</span>
                <Image
                  src={asset("/images/noble-wordmark-dark.png")}
                  alt="NOBLE"
                  width={387}
                  height={61}
                  className="h-[0.72em] w-auto translate-y-[0.02em]"
                />
                <span>-ről</span>
              </h2>

              {/* Arany hajszálvonal — ugyanaz a motívum, mint a logó vonalai */}
              <div className="mt-7 h-px w-16 bg-gold" />
            </Reveal>

            <Reveal from="right" delay={90}>
              <p className="mt-7 text-lg leading-relaxed text-ink sm:text-xl">
                Klasszikus borbélyélmény, modern fazonok — Kecskemét szívében, az
                Izsáki úton.
              </p>
            </Reveal>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink-soft">
              <Reveal from="right" delay={140}>
                <p>
                  A NOBLE Barbershop nem futószalag. Nálunk minden vendégre jut idő
                  és figyelem. Megbeszéljük, mit szeretnél, szakmai szempontok
                  alapján segítünk a megfelelő fazon kiválasztásában, majd mindezt
                  precízen, a részletekre odafigyelve valósítjuk meg.
                </p>
              </Reveal>
              <Reveal from="right" delay={180}>
                <p>
                  Éppen ezért kizárólag bejelentkezés alapján dolgozunk, egyszerre
                  egy vendéggel. Nincs sietség, nincs kapkodás — csak a rád szánt
                  idő és a minőségi munka.
                </p>
              </Reveal>
              <Reveal from="right" delay={220}>
                <p>
                  Precíz átmenetek, tiszta kontúrok, gondosan formázott szakáll,
                  hagyományos borotválás. A klasszikus borbélyszakma alapjai, a mai
                  igényekhez igazítva.
                </p>
              </Reveal>
              <Reveal from="right" delay={260}>
                <p>
                  Ha pedig még nem tudod pontosan, mi állna jól, abban is
                  számíthatsz ránk. A megfelelő fazon nem mindig az, amit elsőre
                  elképzelsz — mi segítünk megtalálni azt, ami valóban hozzád illik.
                </p>
              </Reveal>
              <Reveal from="right" delay={300}>
                <p>
                  Mert egy hajvágás nem csupán tíz perc a napodból. Hanem az a
                  pillanat, amitől rendben érzed magad a hét hátralévő részében.
                </p>
              </Reveal>
            </div>

            {/* Névjegy — vékony vonallal elválasztva, mint egy aláírás */}
            <Reveal from="right" delay={350}>
              <div className="mt-12 border-t border-line pt-7">
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
                  {site.master.name}
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-ink-soft">
                  {site.master.role}
                </p>
              </div>

              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark mt-9"
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
