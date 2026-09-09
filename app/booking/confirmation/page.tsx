'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Loader2, Printer, Ticket as TicketIcon } from 'lucide-react';
import { Ticket } from '@/components/booking/Ticket';
import { findBooking } from '@/lib/storage/bookings-repo';
import { useBooking } from '@/lib/booking/context';
import type { Booking } from '@/lib/api/types';

export default function ConfirmationPage() {
  const params = useSearchParams();
  const pnr = params.get('pnr');
  const { clear } = useBooking();

  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  // Bookings live in localStorage, so this can only run after mount.
  useEffect(() => {
    setBooking(pnr ? (findBooking(pnr) ?? null) : null);
  }, [pnr]);

  // The journey is over — release the draft and the seat hold.
  useEffect(() => {
    clear();
    // Runs once on arrival; clear is stable enough for this purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (booking === undefined) {
    return (
      <p className="container-page flex items-center gap-2 py-16 text-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Fetching your ticket…
      </p>
    );
  }

  if (booking === null) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-brand-900">
          We could not find that ticket
        </h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Tickets are stored in the browser they were booked on. If you booked on another device or
          cleared your browsing data, call the office and we will look it up.
        </p>
        <Link
          href="/my-bookings/"
          className="mt-6 inline-block min-h-[48px] rounded-sm bg-brand-700 px-5 py-3 font-semibold text-white"
        >
          See my bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-seat-free/10"
          >
            <Check className="h-8 w-8 text-seat-free" aria-hidden="true" strokeWidth={2.5} />
          </motion.span>

          <h1 className="mt-5 font-display text-3xl font-semibold text-brand-900">
            Your seat is booked
          </h1>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Show this reference at the boarding point. Reach the stop ten minutes before departure.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <Ticket booking={booking} />
        </motion.div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-sm border border-line bg-surface px-5 font-semibold text-brand-800 transition-colors hover:bg-surface-2"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print ticket
          </button>
          <Link
            href="/my-bookings/"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-brand-700 px-5 font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <TicketIcon className="h-4 w-4" aria-hidden="true" />
            All my bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
