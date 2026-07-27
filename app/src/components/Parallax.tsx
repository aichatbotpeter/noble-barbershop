"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Parallax réteg: a gyerek lassabban mozog, mint a görgetés, így a
 * háttér mélységet kap. `speed` = elmozdulás aránya (0.2 = 20%).
 *
 * Csökkentett mozgás beállításnál teljesen kikapcsol.
 */
export default function Parallax({
  children,
  speed = 0.18,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Mennyire van a szekció közepe a képernyő közepétől
      const fromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(-fromCenter * speed);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: "transform" }}
    >
      {children}
    </div>
  );
}
