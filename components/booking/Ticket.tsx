'use client';

import { BusFront, MapPin, MoveRight } from 'lucide-react';
import { SaptagiriMark } from '@/components/brand/Wordmark';
import { formatINR } from '@/lib/booking/fare';
import { formatDuration } from '@/data/routes';
import { operator } from '@/data/operator';
import type { Booking } from '@/lib/api/types';

export function Ticket({ booking }: { booking: Booking }) {
  const { trip } = booking;
  const cancelled = booking.status === 'cancelled';

  const boarding = trip.boarding?.find((s) => s.id === booking.boardingId);
  const dropping = trip.dropping?.find((s) => s.id === booking.droppingId);

  const travelDate = new Date(`${trip.date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-surface shadow-card ${
        cancelled ? 'border-line opacity-75' : 'border-line'
      }`}
    >
      <header
        className={`flex items-center justify-between gap-4 px-5 py-4 ${
          cancelled ? 'bg-surface-2' : 'bg-brand-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={cancelled ? '' : 'rounded-sm bg-white/95 p-1'}>
            <SaptagiriMark className="h-6 w-6" />
          </span>
          <span
            className={`font-display text-sm font-semibold ${
              cancelled ? 'text-muted' : 'text-white'
            }`}
          >
            {operator.name}
          </span>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
            cancelled ? 'bg-seat-sold/10 text-seat-sold' : 'bg-white/15 text-white'
          }`}
        >
          {cancelled ? 'Cancelled' : 'Confirmed'}
        </span>
      </header>

      <div className="border-b border-dashed border-line px-5 py-4">
        <p className="text-xs uppercase tracking-wider text-faint">Booking reference</p>
        <p className="mt-0.5 font-display text-2xl font-semibold tracking-wide tnum text-brand-900">
          {booking.pnr}
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold text-brand-900">
          {trip.fromName}
          <MoveRight className="h-4 w-4 text-gold-500" aria-hidden="true" />
          {trip.toName}
        </div>
        <p className="mt-1 text-sm text-muted">{travelDate}</p>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-md bg-surface-2 p-4 sm:grid-cols-4">
          <Cell label="Departs" value={trip.departs} mono />
          <Cell
            label="Arrives"
            value={`${trip.arrives}${trip.arrivalDayOffset > 0 ? ` +${trip.arrivalDayOffset}` : ''}`}
            mono
          />
          <Cell label="Duration" value={formatDuration(trip.durationMins)} mono />
          <Cell label="Seats" value={booking.passengers.map((p) => p.seatLabel).join(', ')} mono />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-wider text-faint">Boarding</p>
              <p className="text-sm font-medium text-ink">{boarding?.name ?? '—'}</p>
              {boarding && <p className="text-xs text-muted">{boarding.landmark}</p>}
            </div>
          </div>
          <div className="flex gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-wider text-faint">Dropping</p>
              <p className="text-sm font-medium text-ink">{dropping?.name ?? '—'}</p>
              {dropping && <p className="text-xs text-muted">{dropping.landmark}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <BusFront className="h-4 w-4 text-brand-700" aria-hidden="true" />
          {trip.coachName}
        </div>

        <table className="mt-5 w-full text-sm">
          <caption className="sr-only">Travellers on this booking</caption>
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
              <th scope="col" className="pb-2 font-medium">
                Traveller
              </th>
              <th scope="col" className="pb-2 font-medium">
                Age
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Seat
              </th>
            </tr>
          </thead>
          <tbody>
            {booking.passengers.map((p) => (
              <tr key={p.seatId} className="border-b border-line last:border-0">
                <td className="py-2.5 font-medium text-ink">{p.name}</td>
                <td className="py-2.5 tnum text-muted">{p.age}</td>
                <td className="py-2.5 text-right font-medium tnum text-brand-700">{p.seatLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex items-end justify-between gap-4 border-t border-dashed border-line bg-surface-2 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-faint">Total paid</p>
          <p className="font-display text-xl font-semibold tnum text-brand-900">
            {formatINR(booking.fare.total)}
          </p>
        </div>
        <p className="text-right text-xs text-faint">
          Ref <span className="tnum">{booking.payment.reference}</span>
        </p>
      </footer>
    </article>
  );
}

function Cell({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-faint">{label}</p>
      <p className={`mt-0.5 font-medium text-ink ${mono ? 'tnum' : ''}`}>{value}</p>
    </div>
  );
}
