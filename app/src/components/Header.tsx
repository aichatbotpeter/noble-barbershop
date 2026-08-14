"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "./Icons";

const NAV = [
  { href: "#rolunk", label: "Rólunk" },
  { href: "#arak", label: "Árak" },
  { href: "#referenciak", label: "Referenciák" },
  { href: "#galeria", label: "Galéria" },
  { href: "#kapcsolat", label: "Kontakt" },
];

/**
 * @param solid Világos hátterű aloldalakon (foglalás, kezelés) kötelező, mert
 *   ott nincs sötét hero a fejléc alatt, és az áttetsző sávon a fehér
 *   navigáció olvashatatlan lenne.
 */
export default function Header({ solid = false }: { solid?: boolean }) {
  // A hero fölött áttetsző, görgetés után tömör sötét sáv.
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || scrolled || menuOpen
          ? "bg-bar"
          : "bg-gradient-to-b from-black/45 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-8 px-5 sm:px-8">
        <a href="#top" className="shrink-0" aria-label={`${site.fullName} — főoldal`}>
          <Image
            src={asset("/images/noble-logo.png")}
            alt={site.fullName}
            width={387}
            height={256}
            priority
            className="h-10 w-auto"
          />
        </a>

        <nav className="hidden flex-1 items-center gap-9 lg:flex" aria-label="Fő navigáció">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-label text-white/90 transition-colors hover:text-gold-light"
            >
              {item.label}
            </a>
          ))}
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-label text-white transition-colors hover:text-gold-light"
          >
            Foglalj most!
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NOBLE Barbershop az Instagramon"
            className="hidden text-white/85 transition-colors hover:text-gold-light sm:block"
          >
            <InstagramIcon className="h-[22px] w-[22px]" />
          </a>
          <a
            href={site.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NOBLE Barbershop a Facebookon"
            className="hidden text-white/85 transition-colors hover:text-gold-light sm:block"
          >
            <FacebookIcon className="h-[22px] w-[22px]" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobil-menu"
            aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 h-0.5 w-full bg-white transition-all duration-300 ${
                  menuOpen ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-full bg-white transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full bg-white transition-all duration-300 ${
                  menuOpen ? "top-1/2 -rotate-45" : "top-full"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobil lenyíló menü */}
      <div
        id="mobil-menu"
        className={`overflow-hidden bg-bar transition-[max-height] duration-400 lg:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-5 pb-5 sm:px-8" aria-label="Mobil navigáció">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="nav-label border-b border-white/10 py-4 text-white/90"
            >
              {item.label}
            </a>
          ))}
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="btn btn-light mt-5"
          >
            Foglalj időpontot
          </a>
        </nav>
      </div>
    </header>
  );
}
