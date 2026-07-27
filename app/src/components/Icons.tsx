/** Inline SVG ikonok — nincs külső ikon-könyvtár függőség. */

type Props = { className?: string };

export function InstagramIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.02 1.46-4.02 4.13v2.29H7.5V13h2.77v8h3.23Z" />
    </svg>
  );
}

export function PhoneIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 16.5v2.6a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.4 18.4 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.1 4.1 1.9 1.9 0 0 1 4 2h2.6a1.9 1.9 0 0 1 1.9 1.6c.12.9.34 1.8.65 2.65a1.9 1.9 0 0 1-.43 2L7.7 9.4a15 15 0 0 0 5.7 5.7l1.15-1.02a1.9 1.9 0 0 1 2-.43c.85.31 1.75.53 2.65.65A1.9 1.9 0 0 1 21 16.5Z" />
    </svg>
  );
}

export function PinIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10.5c0 5.2-8 12-8 12s-8-6.8-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.3" r="2.9" />
    </svg>
  );
}

export function ClockIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export function MailIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.2" />
      <path d="m3.4 6.6 8.6 6 8.6-6" />
    </svg>
  );
}

/** Az arculat ollója — apró elválasztó díszként. */
export function ScissorsIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="6.2" cy="18.2" r="2.6" />
      <circle cx="17.8" cy="18.2" r="2.6" />
      <path d="M8.1 16.4 18.5 3.4M15.9 16.4 5.5 3.4" />
    </svg>
  );
}
