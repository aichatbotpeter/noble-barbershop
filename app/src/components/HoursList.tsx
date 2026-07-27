"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

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
            className={`flex items-baseline justify-between gap-4 border-b border-line py-3.5 last:border-b-0 ${
              isToday ? "text-ink" : "text-ink-soft"
            }`}
          >
            <span className="flex items-center gap-3 text-base">
              {h.day}
              {isToday && (
                <span className="nav-label rounded-full bg-gold/15 px-2.5 py-1 !text-[0.6rem] text-gold">
                  Ma
                </span>
              )}
            </span>
            <span
              className={`text-base ${
                closed ? "text-ink-soft/50" : isToday ? "font-semibold text-ink" : ""
              }`}
            >
              {closed ? "Zárva" : `${h.open} – ${h.close}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
