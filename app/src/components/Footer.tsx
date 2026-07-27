import Image from "next/image";
import { asset } from "@/lib/asset";
import { site, fullAddress } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-bar py-16 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image
            src={asset("/images/noble-logo.png")}
            alt={site.fullName}
            width={387}
            height={256}
            className="h-16 w-auto"
          />

          <div className="space-y-2 text-[0.95rem] text-white/70">
            <p>{fullAddress}</p>
            <p>
              <a href={site.contact.phoneHref} className="transition-colors hover:text-gold-light">
                {site.contact.phone}
              </a>
              <span className="mx-3 text-white/25">·</span>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-gold-light"
              >
                {site.contact.email}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NOBLE Barbershop az Instagramon"
              className="text-white/70 transition-colors hover:text-gold-light"
            >
              <InstagramIcon className="h-[22px] w-[22px]" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NOBLE Barbershop a Facebookon"
              className="text-white/70 transition-colors hover:text-gold-light"
            >
              <FacebookIcon className="h-[22px] w-[22px]" />
            </a>
          </div>

          <div className="h-px w-full max-w-md bg-white/10" />

          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {site.fullName} · {site.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
