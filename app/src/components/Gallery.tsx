import Image from "next/image";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { galleryImages } from "@/lib/gallery";
import { InstagramIcon } from "./Icons";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

export default function Gallery() {
  const hasPhotos = galleryImages.length > 0;

  return (
    <section id="galeria" className="relative overflow-hidden bg-bar py-24 text-white sm:py-32">
      {/* Hangulati háttér: a szalon fala erősen elmosva és lesötétítve */}
      <div className="absolute inset-0 -z-10">
        <Parallax speed={0.2} className="absolute inset-x-0 -top-32 bottom-[-8rem]">
          <div className="relative h-full w-full">
            <Image
              src={asset("/images/wall-dark.jpg")}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-70"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-bar/55" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center text-white">Galéria</h2>
        </Reveal>

        {hasPhotos ? (
          <>
            {/*
              A fotók ÁLLÓ tájolásúak (2:3), ezért a rács is az — így semmi
              nem esik le a kompozícióból. Színesen jelennek meg, hoverre
              finoman ráközelítenek.

              Három oszlop 1280 px-es sávban: egy kép ~400 CSS px, retinán
              ~800 px — ezt a 941 px-es forrás fedi, tehát nincs felnagyítás.
            */}
            <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {galleryImages.map((img, i) => (
                <Reveal
                  key={img.src}
                  delay={(i % 3) * 90}
                  from={i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : "up"}
                >
                  <figure className="group relative aspect-[2/3] overflow-hidden bg-black">
                    <Image
                      src={asset(img.src)}
                      alt={img.alt}
                      fill
                      quality={90}
                      sizes="(max-width: 640px) 48vw, (max-width: 1024px) 46vw, 400px"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-14 text-center">
                <p className="text-base text-white/70">
                  A friss munkák az Instagramon frissülnek.
                </p>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light mt-6"
                >
                  <InstagramIcon className="h-5 w-5" />
                  {site.social.instagramHandle}
                </a>
              </div>
            </Reveal>
          </>
        ) : (
          // Amíg nincsenek fotók, az Instagram viszi a szekciót.
          <Reveal delay={90}>
            <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
              A friss munkák, fazonok és a szalon mindennapjai az Instagramon
              frissülnek — nézd meg, mit csinálunk.
            </p>
            <div className="mt-10 text-center">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light"
              >
                <InstagramIcon className="h-5 w-5" />
                {site.social.instagramHandle}
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
