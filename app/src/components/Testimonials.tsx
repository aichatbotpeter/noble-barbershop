import { testimonials } from "@/lib/testimonials";
import Reveal from "./Reveal";

export default function Testimonials() {
  // Amíg nincs valódi vélemény, a szekció nem jelenik meg.
  if (testimonials.length === 0) return null;

  return (
    <section id="velemenyek" className="bg-mist/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center">Vendégeink mondták</h2>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author + i} delay={i * 90}>
              <figure className="flex h-full flex-col bg-paper p-8">
                <blockquote className="flex-1 text-base leading-relaxed text-ink">
                  „{t.quote}"
                </blockquote>
                <figcaption className="mt-6 text-sm text-ink-soft">
                  {t.author} · {t.source}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
