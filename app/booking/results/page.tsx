'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BusFront, Clock, Loader2, MoveRight, SlidersHorizontal } from 'lucide-react';
import { searchTrips } from '@/lib/api/client';
import type { Trip } from '@/lib/api/types';
import { cityName, formatDuration } from '@/data/routes';
import { formatINR } from '@/lib/booking/fare';
import { useBooking } from '@/lib/booking/context';

type SortKey = 'departure' | 'fare' | 'duration';

const bands = [
  { key: 'all', label: 'Any time' },
  { key: 'morning', label: 'Before noon', test: (t: string) => t < '12:00' },
  { key: 'evening', label: 'Noon – 9pm', test: (t: string) => t >= '12:00' && t < '21:00' },
  { key: 'night', label: 'After 9pm', test: (t: string) => t >= '21:00' },
] as const;

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ResultsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { selectTrip } = useBooking();

  const from = params.get('from') ?? 'BLR';
  const to = params.get('to') ?? 'MYS';
  const date = params.get('date') ?? todayIso();

  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [sort, setSort] = useState<SortKey>('departure');
  const [band, setBand] = useState<(typeof bands)[number]['key']>('all');

  useEffect(() => {
    let live = true;
    setTrips(null);

    searchTrips(from, to, date).then((result) => {
      if (live) setTrips(result);
    });

    return () => {
      live = false;
    };
  }, [from, to, date]);

  const visible = useMemo(() => {
    if (!trips) return [];
    const chosen = bands.find((b) => b.key === band);
    const filtered = chosen && 'test' in chosen ? trips.filter((t) => chosen.test(t.departs)) : trips;

    return [...filtered].sort((a, b) => {
      if (sort === 'fare') return a.baseFare - b.baseFare;
      if (sort === 'duration') return a.durationMins - b.durationMins;
      return a.departs.localeCompare(b.departs);
    });
  }, [trips, sort, band]);

  const choose = (trip: Trip) => {
    selectTrip(trip.id);
    router.push(`/booking/seats/?trip=${encodeURIComponent(trip.id)}`);
  };

  const prettyDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="container-page py-8 md:py-12">
      <Link
        href="/#search"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Change search
      </Link>

      <header className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-brand-900 md:text-3xl">
          {cityName(from)}
          <MoveRight className="h-5 w-5 text-gold-500" aria-hidden="true" />
          {cityName(to)}
        </h1>
        <p className="text-muted">{prettyDate}</p>
      </header>

      {trips === null ? (
        <p className="mt-10 flex items-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Looking for buses…
        </p>
      ) : trips.length === 0 ? (
        <EmptyResults from={from} to={to} />
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 border-y border-line py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
              {bands.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setBand(b.key)}
                  aria-pressed={band === b.key}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    band === b.key
                      ? 'border-brand-300 bg-brand-50 font-medium text-brand-700'
                      : 'border-line text-muted hover:border-brand-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <label className="flex shrink-0 items-center gap-2 text-sm text-muted">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-sm border border-line bg-surface px-2.5 py-1.5 font-medium text-ink"
              >
                <option value="departure">Departure</option>
                <option value="fare">Lowest fare</option>
                <option value="duration">Shortest trip</option>
              </select>
            </label>
          </div>

          <p className="mt-4 text-sm text-muted" role="status">
            <span className="tnum">{visible.length}</span>{' '}
            {visible.length === 1 ? 'bus' : 'buses'} available
          </p>

          <ul className="mt-4 space-y-3">
            {visible.map((trip, i) => (
              <motion.li
                key={trip.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.24), duration: 0.35 }}
              >
                <TripCard trip={trip} onSelect={() => choose(trip)} />
              </motion.li>
            ))}
          </ul>

          {visible.length === 0 && (
            <p className="mt-8 rounded-md border border-line bg-surface-2 p-6 text-center text-muted">
              No buses in that time window. Try “Any time”.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function TripCard({ trip, onSelect }: { trip: Trip; onSelect: () => void }) {
  const nearlyFull = trip.seatsAvailable <= 6;

  return (
    <article className="rounded-md border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand-200 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            <BusFront className="h-3.5 w-3.5" aria-hidden="true" />
            {trip.coachName}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div>
              <p className="font-display text-2xl font-semibold tnum text-brand-900">{trip.departs}</p>
              <p className="text-xs text-muted">{trip.fromName}</p>
            </div>

            <div className="flex min-w-20 flex-1 flex-col items-center px-1">
              <span className="flex items-center gap-1 text-xs text-faint">
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span className="tnum">{formatDuration(trip.durationMins)}</span>
              </span>
              <span className="mt-1 h-px w-full bg-line" aria-hidden="true" />
            </div>

            <div>
              <p className="font-display text-2xl font-semibold tnum text-brand-900">
                {trip.arrives}
                {trip.arrivalDayOffset > 0 && (
                  <span className="align-super text-xs font-medium text-gold-600">
                    +{trip.arrivalDayOffset}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted">{trip.toName}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-faint">From</p>
            <p className="font-display text-2xl font-semibold tnum text-brand-700">
              {formatINR(trip.baseFare)}
            </p>
          </div>
          <p className={`text-xs ${nearlyFull ? 'font-medium text-gold-600' : 'text-muted'}`}>
            <span className="tnum">{trip.seatsAvailable}</span> seats left
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          {trip.amenities.slice(0, 4).map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onSelect}
          className="min-h-[44px] rounded-sm bg-brand-700 px-5 text-sm font-semibold text-white transition-all hover:bg-brand-800 active:scale-[0.98]"
        >
          Select seats
        </button>
      </div>
    </article>
  );
}

function EmptyResults({ from, to }: { from: string; to: string }) {
  return (
    <div className="mt-10 rounded-lg border border-line bg-surface-2 p-8 text-center md:p-12">
      <h2 className="font-display text-xl font-semibold text-brand-900">
        We do not run {cityName(from)} to {cityName(to)}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        Every Sapthagiri service starts or ends in Bangalore. Try Bangalore as one end of the
        journey, or call the office — we may be able to arrange a charter.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/#search"
          className="min-h-[48px] rounded-sm bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Search again
        </Link>
        <Link
          href="/rentals/"
          className="min-h-[48px] rounded-sm border border-line bg-surface px-5 py-3 text-sm font-semibold text-brand-800"
        >
          Ask about charter hire
        </Link>
      </div>
    </div>
  );
}
