import Image from "next/image";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "./Icons";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black py-24 text-white">
      {/* Átlós hajszálvonalak a sarkokban — a referencia grafikai motívuma */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -left-24 top-0 h-[140%] w-px rotate-[24deg] bg-white/60" />
        <div className="absolute -left-6 top-0 h-[140%] w-px rotate-[24deg] bg-white/40" />
        <div className="absolute left-12 top-0 h-[140%] w-px rotate-[24deg] bg-white/25" />
        <div className="absolute -right-24 top-0 h-[140%] w-px -rotate-[24deg] bg-white/60" />
        <div className="absolute -right-6 top-0 h-[140%] w-px -rotate-[24deg] bg-white/40" />
        <div className="absolute right-12 top-0 h-[140%] w-px -rotate-[24deg] bg-white/25" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="h-section text-white">Elérhetőségeink</h2>
          </Reveal>

          <Reveal delay={90}>
            <div className="space-y-2 text-lg">
              <p>
                <a
                  href={site.contact.phoneHref}
                  className="underline decoration-white/35 underline-offset-[6px] transition-colors hover:text-gold-light"
                >
                  {site.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="break-all underline decoration-white/35 underline-offset-[6px] transition-colors hover:text-gold-light"
                >
                  {site.contact.email}
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex items-center gap-7">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NOBLE Barbershop az Instagramon"
                className="text-white/75 transition-colors hover:text-gold-light"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NOBLE Barbershop a Facebookon"
                className="text-white/75 transition-colors hover:text-gold-light"
              >
                <FacebookIcon className="h-6 w-6" />
              </a>
            </div>
          </Reveal>

          <Image
            src={asset("/images/noble-logo.png")}
            alt={site.fullName}
            width={387}
            height={256}
            className="mt-6 h-14 w-auto opacity-80"
          />

          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} {site.fullName} · {site.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
