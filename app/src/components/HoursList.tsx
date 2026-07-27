"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/** Sötét háttéren jelenik meg (Kontakt szekció). */
export default function HoursList() {
  // A mai napot csak beépülés után jelöljük ki — így nincs szerver/kliens eltérés.
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  useEffect(() => {
    const js = new Date().getDay(); // 0 = vasárnap, a listánk hétfővel kezdődik
    setTodayIndex(js === 0 ? 6 : js - 1);
  }, []);

  return (
    <ul>
      {site.hours.map((h, i) => {
        const closed = !h.open || !h.close;
        const isToday = todayIndex === i;

        return (
          <li
            key={h.day}
            className={`flex items-baseline justify-between gap-4 border-b border-white/10 py-3 last:border-b-0 ${
              isToday ? "text-white" : "text-white/65"
            }`}
          >
            <span className="flex items-center gap-3">
              {h.day}
              {isToday && (
                <span className="rounded-full bg-gold/25 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-gold-light">
                  Ma
                </span>
              )}
            </span>
            <span
              className={
                closed ? "text-white/35" : isToday ? "font-semibold text-gold-light" : ""
              }
            >
              {closed ? "Zárva" : `${h.open} – ${h.close}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
