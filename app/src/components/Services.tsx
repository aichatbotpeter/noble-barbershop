import { site, formatPrice } from "@/lib/site";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="arak" className="relative overflow-hidden bg-mist/40 py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center">Áraink</h2>
        </Reveal>

        {/* Két hasáb, elválasztó vonalak nélkül — a referencia levegős ritmusa */}
        <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {site.services.map((service, i) => (
            <Reveal key={service.name} delay={(i % 2) * 80}>
              <article>
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold sm:text-xl">
                    {service.name}
                  </h3>
                  <p className="price">{formatPrice(service.price)}</p>
                </div>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                  {service.desc}
                </p>
                <p className="mt-2 text-sm text-ink-soft/70">{service.minutes} perc</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-20 text-center">
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-soft">
              Az árak tájékoztató jellegűek — a pontos összeg a haj hosszától és a
              szolgáltatás időtartamától függően eltérhet.
            </p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark mt-8"
            >
              Foglalj időpontot
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
