import Image from "next/image";
import { asset } from "@/lib/asset";
import { site, fullAddress } from "@/lib/site";
import HoursList from "./HoursList";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

export default function Visit() {
  return (
    <section id="kapcsolat" className="relative overflow-hidden py-24 text-white sm:py-32">
      <div className="absolute inset-0 -z-10 bg-bar">
        <Parallax speed={0.16} className="absolute inset-x-0 -top-28 bottom-[-7rem]">
          <div className="relative h-full w-full">
            <Image
              src={asset("/images/wall-dark.jpg")}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-80"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center text-white">Látogass el!</h2>
        </Reveal>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal from="left">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Cím
            </h3>
            <a
              href={site.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-lg text-white/80 transition-colors hover:text-gold-light"
            >
              {fullAddress}
            </a>

            <h3 className="mt-12 font-[family-name:var(--font-display)] text-xl font-semibold">
              Nyitvatartás
            </h3>
            <div className="mt-4 max-w-sm">
              <HoursList />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              {site.hoursNote}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light"
              >
                Foglalj időpontot
              </a>
              <a href={site.contact.phoneHref} className="btn btn-ghost text-white">
                {site.contact.phone}
              </a>
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="aspect-[4/3] w-full overflow-hidden shadow-2xl">
              <iframe
                title={`${site.fullName} térkép — ${fullAddress}`}
                src="https://www.google.com/maps?q=Kecskem%C3%A9t%2C%20Izs%C3%A1ki%20%C3%BAt%202&z=16&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
