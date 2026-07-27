"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

/**
 * Belépő animáció: a gyerek akkor úszik be, amikor görgetésnél láthatóvá válik.
 * `from` adja az irányt, `delay` a lépcsőzetes indításhoz.
 * Csökkentett mozgás beállításnál a CSS kikapcsolja az átmenetet.
 */
export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: Direction;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // egyszer fut le, nem villog vissza
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const start =
    from === "left"
      ? "translate3d(-42px,0,0)"
      : from === "right"
        ? "translate3d(42px,0,0)"
        : from === "none"
          ? "none"
          : "translate3d(0,34px,0)";

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...(visible ? {} : { transform: start }),
      }}
    >
      {children}
    </div>
  );
}
