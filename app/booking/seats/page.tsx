'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { SeatMap } from '@/components/booking/SeatMap';
import { StickyBar } from '@/components/booking/StickyBar';
import { getSoldSeats, getTrip } from '@/lib/api/client';
import type { Trip } from '@/lib/api/types';
import { useBooking } from '@/lib/booking/context';
import { computeFare, formatINR } from '@/lib/booking/fare';
import { coachById } from '@/data/coaches';
import type { Stop } from '@/data/routes';

export default function SeatsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const tripId = params.get('trip');
  const { draft, ready, selectTrip, toggleSeat, setStops } = useBooking();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [sold, setSold] = useState<string[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!tripId) {
      router.replace('/');
      return;
    }

    let live = true;
    getTrip(tripId).then((result) => {
      if (!live) return;
      if (!result) {
        setNotFound(true);
        return;
      }
      setTrip(result);
      selectTrip(result.id);
      getSoldSeats(result.id, result.coachId).then((s) => live && setSold(s));
    });

    return () => {
      live = false;
    };
    // selectTrip is stable for a given trip; re-running on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, router]);

  // Default the boarding and dropping points to the main stops.
  useEffect(() => {
    if (!trip) return;
    if (!draft.boardingId && trip.boarding.length) {
      setStops({ boardingId: trip.boarding[0].id });
    }
    if (!draft.droppingId && trip.dropping.length) {
      setStops({ droppingId: trip.dropping[trip.dropping.length - 1].id });
    }
  }, [trip, draft.boardingId, draft.droppingId, setStops]);

  if (notFound) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-brand-900">That bus is no longer listed</h1>
        <p className="mt-2 text-muted">Timings change. Search again to see what is running.</p>
        <Link
          href="/#search"
          className="mt-6 inline-block min-h-[48px] rounded-sm bg-brand-700 px-5 py-3 font-semibold text-white"
        >
          Search buses
        </Link>
      </div>
    );
  }

  if (!trip || !ready) {
    return (
      <p className="container-page flex items-center gap-2 py-16 text-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading the coach…
      </p>
    );
  }

  const fare = computeFare(trip, draft.seatIds);
  const coach = coachById(trip.coachId);
  const selectedLabels = draft.seatIds
    .map((id) => coach.seats.find((s) => s.id === id)?.label)
    .filter(Boolean)
    .join(', ');

  const canContinue = draft.seatIds.length > 0 && Boolean(draft.boardingId && draft.droppingId);

  return (
    <div className="container-page py-6 pb-32 md:py-10 md:pb-36">
      <Link
        href={`/booking/results/?from=${trip.from}&to=${trip.to}&date=${trip.date}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Other buses
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-2xl font-semibold text-brand-900 md:text-3xl">
          Choose your {coach.kind === 'sleeper' ? 'berth' : 'seat'}
        </h1>
        <p className="mt-1.5 text-muted">
          {trip.fromName} to {trip.toName} · <span className="tnum">{trip.departs}</span> ·{' '}
          {trip.coachName}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <SeatMap
          trip={trip}
          sold={sold ?? []}
          selected={draft.seatIds}
          onToggle={toggleSeat}
          loading={sold === null}
        />

        <aside className="space-y-5 lg:sticky lg:top-24">
          <StopPicker
            title="Boarding point"
            stops={trip.boarding}
            value={draft.boardingId}
            baseTime={trip.departs}
            onChange={(id) => setStops({ boardingId: id })}
          />
          <StopPicker
            title="Dropping point"
            stops={trip.dropping}
            value={draft.droppingId}
            baseTime={trip.arrives}
            onChange={(id) => setStops({ droppingId: id })}
          />

          {draft.seatIds.length > 0 && (
            <div className="rounded-md border border-line bg-surface-2 p-4">
              <h2 className="font-display text-sm font-semibold text-brand-900">Your selection</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Seats</dt>
                  <dd className="font-medium tnum text-ink">{selectedLabels}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Fare</dt>
                  <dd className="tnum text-ink">{formatINR(fare.base + fare.seatAdjustments)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">GST</dt>
                  <dd className="tnum text-ink">{formatINR(fare.gst)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-2">
                  <dt className="font-semibold text-brand-900">Total</dt>
                  <dd className="font-display font-semibold tnum text-brand-700">
                    {formatINR(fare.total)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </aside>
      </div>

      <StickyBar
        primaryLabel="Add traveller details"
        disabled={!canContinue}
        hint={
          draft.seatIds.length === 0
            ? 'Pick at least one seat'
            : `${draft.seatIds.length} selected · ${selectedLabels}`
        }
        total={fare.total}
        onPrimary={() => router.push('/booking/passengers/')}
      />
    </div>
  );
}

function StopPicker({
  title,
  stops,
  value,
  baseTime,
  onChange,
}: {
  title: string;
  stops: Stop[];
  value: string | null;
  baseTime: string;
  onChange: (id: string) => void;
}) {
  const timeAt = (offset: number) => {
    const [h, m] = baseTime.split(':').map(Number);
    const total = (h * 60 + m + offset + 1440) % 1440;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };

  return (
    <fieldset className="rounded-md border border-line bg-surface p-4">
      <legend className="flex items-center gap-1.5 px-1 font-display text-sm font-semibold text-brand-900">
        <MapPin className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
        {title}
      </legend>

      <div className="mt-2 space-y-1">
        {stops.map((stop) => (
          <label
            key={stop.id}
            className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-sm border p-2.5 transition-colors ${
              value === stop.id ? 'border-brand-300 bg-brand-50' : 'border-transparent hover:bg-surface-2'
            }`}
          >
            <input
              type="radio"
              name={title}
              checked={value === stop.id}
              onChange={() => onChange(stop.id)}
              className="h-4 w-4 shrink-0 accent-brand-700"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">{stop.name}</span>
              <span className="block truncate text-xs text-muted">{stop.landmark}</span>
            </span>
            <span className="shrink-0 text-sm font-medium tnum text-brand-700">
              {timeAt(stop.offsetMins)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
