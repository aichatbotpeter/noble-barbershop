"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Mobilon a hero elhagyása után beúszik egy állandó foglalás-gomb.
 * Asztali nézetben nincs rá szükség — ott a fejlécben mindig látszik.
 */
export default function StickyBookBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bar p-3 transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      // Ha nincs kint, a képernyőolvasó és a Tab se találja meg.
      aria-hidden={!show}
      inert={!show}
    >
      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-light w-full"
        tabIndex={show ? 0 : -1}
      >
        Foglalj időpontot
      </a>
    </div>
  );
}
