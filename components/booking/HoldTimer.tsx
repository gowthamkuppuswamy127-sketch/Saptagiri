'use client';

import { usePathname } from 'next/navigation';
import { Clock } from 'lucide-react';
import { formatCountdown, useBooking } from '@/lib/booking/context';

/** Shows how long the chosen seats stay held. Hidden once the ticket is issued. */
export function HoldTimer() {
  const { secondsLeft } = useBooking();
  const pathname = usePathname();

  if (secondsLeft === null || secondsLeft <= 0) return null;
  if (pathname.includes('/booking/confirmation')) return null;

  const urgent = secondsLeft < 120;

  return (
    <div
      className={`border-b transition-colors ${
        urgent ? 'border-gold-200 bg-gold-100' : 'border-line bg-brand-50'
      }`}
    >
      <p
        className={`container-page flex items-center justify-center gap-2 py-2 text-sm ${
          urgent ? 'text-gold-600' : 'text-brand-700'
        }`}
      >
        <Clock className="h-4 w-4" aria-hidden="true" />
        <span>
          Seats held for{' '}
          <strong className="tnum font-semibold">{formatCountdown(secondsLeft)}</strong>
        </span>
      </p>
    </div>
  );
}
