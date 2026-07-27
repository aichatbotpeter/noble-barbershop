import Image from "next/image";
import { site } from "@/lib/site";
import { galleryImages } from "@/lib/gallery";
import { InstagramIcon } from "./Icons";
import Reveal from "./Reveal";

export default function Gallery() {
  const hasPhotos = galleryImages.length > 0;

  return (
    <section id="galeria" className="bg-bar py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center text-white">Galéria</h2>
        </Reveal>

        {hasPhotos ? (
          <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {galleryImages.map((img, i) => (
              <Reveal
                key={img.src}
                delay={i * 70}
                className={img.span === "wide" ? "col-span-2" : ""}
              >
                <div className="group relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 384px"
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          // Amíg nincsenek fotók, az Instagram viszi a szekciót — így nem
          // marad üres rács. A képek bemásolásakor magától átvált a fenti ágra.
          <Reveal delay={80}>
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
