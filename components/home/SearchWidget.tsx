'use client';

import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown, CalendarDays, MapPin, Search } from 'lucide-react';
import { cities } from '@/data/routes';

/** yyyy-mm-dd in the visitor's own timezone, not UTC. */
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function SearchWidget() {
  const router = useRouter();
  const fromId = useId();
  const toId = useId();
  const dateId = useId();

  const today = useMemo(() => isoDate(new Date()), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return isoDate(d);
  }, []);

  const [from, setFrom] = useState('BLR');
  const [to, setTo] = useState('MYS');
  const [date, setDate] = useState(today);
  const [error, setError] = useState<string | null>(null);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (from === to) {
      setError('Choose two different cities.');
      return;
    }
    if (date < today) {
      setError('Pick today or a later date.');
      return;
    }

    setError(null);
    router.push(`/booking/results/?from=${from}&to=${to}&date=${date}`);
  };

  const quick = [
    { label: 'Today', value: today },
    {
      label: 'Tomorrow',
      value: isoDate(new Date(Date.now() + 86400000)),
    },
  ];

  return (
    <section id="search" className="relative z-10 -mt-12 md:-mt-16">
      <div className="container-page">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-lg border border-line bg-surface p-4 shadow-lift md:p-6"
          aria-labelledby="search-heading"
        >
          <h2 id="search-heading" className="font-display text-lg font-semibold text-brand-900">
            Find your bus
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-end md:gap-2">
            <div className="relative">
              <label htmlFor={fromId} className="mb-1.5 block text-sm font-medium text-muted">
                From
              </label>
              <MapPin
                className="pointer-events-none absolute left-3 top-[42px] h-4 w-4 text-faint"
                aria-hidden="true"
              />
              <select
                id={fromId}
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setError(null);
                }}
                className="h-13 w-full appearance-none rounded-sm border border-line bg-surface py-3 pl-9 pr-3 font-medium text-ink focus:border-brand-500"
              >
                {cities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="mx-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50 md:mb-0.5"
            >
              <ArrowUpDown className="h-4 w-4 md:rotate-90" aria-hidden="true" />
            </button>

            <div className="relative">
              <label htmlFor={toId} className="mb-1.5 block text-sm font-medium text-muted">
                To
              </label>
              <MapPin
                className="pointer-events-none absolute left-3 top-[42px] h-4 w-4 text-faint"
                aria-hidden="true"
              />
              <select
                id={toId}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setError(null);
                }}
                className="h-13 w-full appearance-none rounded-sm border border-line bg-surface py-3 pl-9 pr-3 font-medium text-ink focus:border-brand-500"
              >
                {cities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label htmlFor={dateId} className="mb-1.5 block text-sm font-medium text-muted">
                Travel date
              </label>
              <CalendarDays
                className="pointer-events-none absolute left-3 top-[42px] h-4 w-4 text-faint"
                aria-hidden="true"
              />
              <input
                id={dateId}
                type="date"
                value={date}
                min={today}
                max={maxDate}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError(null);
                }}
                className="h-13 w-full rounded-sm border border-line bg-surface py-3 pl-9 pr-3 font-medium text-ink focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="flex h-13 min-h-[52px] items-center justify-center gap-2 rounded-sm bg-gold-500 px-6 font-semibold text-brand-900 transition-all hover:bg-gold-400 active:scale-[0.98]"
            >
              <Search className="h-4.5 w-4.5" aria-hidden="true" />
              Search buses
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {quick.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setDate(q.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  date === q.value
                    ? 'border-brand-300 bg-brand-50 font-medium text-brand-700'
                    : 'border-line text-muted hover:border-brand-200'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-seat-sold">
              {error}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
