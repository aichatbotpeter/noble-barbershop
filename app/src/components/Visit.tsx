import { site, fullAddress } from "@/lib/site";
import { PhoneIcon, PinIcon, MailIcon } from "./Icons";
import HoursList from "./HoursList";
import Reveal from "./Reveal";

export default function Visit() {
  return (
    <section id="kapcsolat" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="h-section text-center">Kontakt</h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Nyitvatartás
            </h3>
            <div className="mt-6">
              <HoursList />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">{site.hoursNote}</p>
          </Reveal>

          <Reveal delay={120}>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Elérhetőség
            </h3>

            <div className="mt-6 space-y-5">
              <a
                href={site.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4"
              >
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-ink transition-colors group-hover:text-gold">
                  {fullAddress}
                  <span className="mt-1 block text-sm text-ink-soft">
                    Útvonaltervezés megnyitása
                  </span>
                </span>
              </a>

              <a href={site.contact.phoneHref} className="group flex items-start gap-4">
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-ink transition-colors group-hover:text-gold">
                  {site.contact.phone}
                </span>
              </a>

              <a href={`mailto:${site.contact.email}`} className="group flex items-start gap-4">
                <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="break-all text-ink transition-colors group-hover:text-gold">
                  {site.contact.email}
                </span>
              </a>
            </div>

            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark mt-10 w-full sm:w-auto"
            >
              Foglalj időpontot
            </a>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16 aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
            <iframe
              title={`${site.fullName} térkép — ${fullAddress}`}
              src="https://www.google.com/maps?q=Kecskem%C3%A9t%2C%20Izs%C3%A1ki%20%C3%BAt%202&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full grayscale-[0.85]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
