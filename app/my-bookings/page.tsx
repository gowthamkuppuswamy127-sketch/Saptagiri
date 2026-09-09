'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Search, TicketX } from 'lucide-react';
import { Ticket } from '@/components/booking/Ticket';
import { cancelBooking, isPast, listBookings } from '@/lib/storage/bookings-repo';
import type { Booking } from '@/lib/api/types';

type Tab = 'upcoming' | 'past' | 'cancelled';

const tabs: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    setBookings(listBookings());
  }, []);

  const grouped = useMemo(() => {
    const all = bookings ?? [];
    return {
      upcoming: all.filter((b) => b.status === 'confirmed' && !isPast(b)),
      past: all.filter((b) => b.status === 'confirmed' && isPast(b)),
      cancelled: all.filter((b) => b.status === 'cancelled'),
    };
  }, [bookings]);

  const visible = grouped[tab];

  const doCancel = (pnr: string) => {
    cancelBooking(pnr);
    setBookings(listBookings());
    setConfirming(null);
  };

  return (
    <div className="container-page py-10 md:py-16">
      <header>
        <h1 className="font-display text-3xl font-semibold text-brand-900 md:text-4xl">My bookings</h1>
        <p className="mt-2 max-w-xl text-muted">
          Tickets booked on this device. They stay in this browser — nothing is uploaded anywhere.
        </p>
      </header>

      {bookings === null ? (
        <p className="mt-10 flex items-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading your tickets…
        </p>
      ) : bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Booking status"
            className="mt-8 flex gap-1 overflow-x-auto border-b border-line hide-scrollbar"
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`relative min-h-[48px] shrink-0 px-3 text-sm font-medium transition-colors ${
                    active ? 'text-brand-700' : 'text-muted hover:text-brand-700'
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-xs tnum text-faint">({grouped[t.key].length})</span>
                  {active && (
                    <motion.span
                      layoutId="bookings-tab"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="mt-10 rounded-md border border-line bg-surface-2 p-8 text-center text-muted">
              Nothing {tab === 'upcoming' ? 'coming up' : tab === 'past' ? 'completed yet' : 'cancelled'}.
            </p>
          ) : (
            <ul className="mt-8 grid gap-6 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visible.map((booking) => (
                  <motion.li
                    key={booking.pnr}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Ticket booking={booking} />

                    {booking.status === 'confirmed' && !isPast(booking) && (
                      <div className="mt-3">
                        {confirming === booking.pnr ? (
                          <div className="rounded-md border border-seat-sold/30 bg-seat-sold/5 p-4">
                            <p className="text-sm font-medium text-ink">
                              Cancel {booking.pnr}? This cannot be undone.
                            </p>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => doCancel(booking.pnr)}
                                className="min-h-[44px] rounded-sm bg-seat-sold px-4 text-sm font-semibold text-white"
                              >
                                Yes, cancel it
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirming(null)}
                                className="min-h-[44px] rounded-sm border border-line bg-surface px-4 text-sm font-medium text-ink"
                              >
                                Keep booking
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirming(booking.pnr)}
                            className="text-sm font-medium text-muted underline-offset-4 hover:text-seat-sold hover:underline"
                          >
                            Cancel this booking
                          </button>
                        )}
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-lg border border-line bg-surface-2 p-10 text-center md:p-16">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface">
        <TicketX className="h-6 w-6 text-faint" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-brand-900">No tickets yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-muted">
        Once you book a seat it appears here, with the boarding point and your reference.
      </p>
      <Link
        href="/#search"
        className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-brand-700 px-5 font-semibold text-white transition-colors hover:bg-brand-800"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Find a bus
      </Link>
    </div>
  );
}
