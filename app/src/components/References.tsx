import Image from "next/image";
import { asset } from "@/lib/asset";
import { referenceImages } from "@/lib/references";
import Reveal from "./Reveal";

/**
 * Referenciák — kész munkák.
 *
 * Az Áraink és a Galéria közé kerül: a látogató előbb az árat látja, utána
 * rögtön azt, hogy mit kap érte. Tónusban is ide illik — a fehér Áraink és a
 * sötét Galéria közötti köztes szürke lépcső.
 *
 * A fotók ÁLLÓ tájolásúak (3:4), ezért a rács is az. Nyolc kép: mobilon 2×4,
 * asztalon 4×2 — egyik elrendezésben sincs magára hagyott utolsó sor. Ha új
 * kép jön, párosával érdemes, hogy ez így maradjon.
 */
export default function References() {
  if (referenceImages.length === 0) return null;

  return (
    <section id="referenciak" className="bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center">Referenciák</h2>
        </Reveal>

        <Reveal delay={90}>
          <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-ink-soft sm:text-lg">
            Kész munkák a székből: fazonok, fade-ek, szakállak. Minden fotó a
            szalonban készült, valódi vendégekről.
          </p>
        </Reveal>

        {/*
          Négy oszlop 1280 px-es sávban: egy kép ~290 CSS px, retinán ~580 px —
          ezt az 1400 px-es forrás bőven fedi, tehát sehol nincs felnagyítás.
        */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-4">
          {referenceImages.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 4) * 80}
              from={i % 4 === 0 ? "left" : i % 4 === 3 ? "right" : "up"}
            >
              <figure className="group relative aspect-[3/4] overflow-hidden bg-black">
                <Image
                  src={asset(img.src)}
                  alt={img.alt}
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 48vw, (max-width: 1280px) 24vw, 300px"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
