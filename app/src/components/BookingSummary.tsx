import { formatPrice } from "@/lib/site";
import { formatDateTimeHu } from "@/lib/time";

type Props = {
  serviceName: string;
  servicePrice: number;
  durationMin: number;
  startsAt: Date;
  customerName: string;
  phone?: string | null;
};

/** A foglalás adatai egységes formában — több oldal is használja. */
export default function BookingSummary({
  serviceName,
  servicePrice,
  durationMin,
  startsAt,
  customerName,
  phone,
}: Props) {
  const rows: [string, string][] = [
    ["Szolgáltatás", serviceName],
    ["Időpont", formatDateTimeHu(startsAt)],
    ["Időtartam", `${durationMin} perc`],
    ["Ár", formatPrice(servicePrice)],
    ["Vendég", customerName],
  ];
  if (phone) rows.push(["Telefon", phone]);

  return (
    <dl className="mx-auto mt-10 max-w-md border border-line">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={`flex items-baseline justify-between gap-6 px-5 py-3.5 ${
            i > 0 ? "border-t border-line" : ""
          }`}
        >
          <dt className="text-sm text-ink-soft">{label}</dt>
          <dd className="text-right font-[family-name:var(--font-display)] font-semibold">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
