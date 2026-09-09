import { operator } from '@/data/operator';

/**
 * Saptagiri means "seven hills". The mark is a seven-peak ridgeline with the
 * road threading through it — one dominant peak so the silhouette still reads
 * at favicon size, six smaller ones so the count is right up close.
 */

const RIDGE =
  'M0 34 L4 21 L7.5 29 L11 13 L14.5 27 L18 20 L21.5 28 L25 4 L29 25 L32.5 16 L36 27 L39.5 11 L43 26 L46 22 L48 34 Z';

const ROAD = 'M-1 30 C 10 37, 20 26, 26 30 S 40 37, 49 29';

export function SaptagiriMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} role="presentation" focusable="false" aria-hidden="true">
      <path d={RIDGE} className="fill-brand-700" />
      <path d={ROAD} className="stroke-gold-500" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * The animated variant draws the ridge in on first load. Used once, in the
 * header, and only on the home page.
 */
export function Wordmark({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SaptagiriMark className={compact ? 'h-7 w-7' : 'h-9 w-9'} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-tight text-brand-900 ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          {operator.shortName}
        </span>
        <span
          className={`font-display font-medium uppercase text-gold-600 ${
            compact ? 'text-[8px] tracking-[0.24em]' : 'text-[9px] tracking-[0.28em]'
          }`}
        >
          Travels
        </span>
      </span>
    </span>
  );
}

/** Low-contrast ridge used as a section divider. */
export function RidgeDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 40"
      preserveAspectRatio="none"
      className={`h-8 w-full ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M0 40 L40 21 L75 30 L110 13 L145 28 L180 20 L215 29 L250 4 L290 25 L325 17 L360 28 L395 11 L430 26 L460 22 L480 34 L480 40 Z"
        className="fill-current"
      />
    </svg>
  );
}
