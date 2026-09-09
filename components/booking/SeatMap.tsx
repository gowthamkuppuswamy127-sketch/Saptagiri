'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Armchair, BedDouble, Loader2 } from 'lucide-react';
import { coachById, deckLabel, seatsForDeck, type DeckId, type SeatDef } from '@/data/coaches';
import { seatPrice } from '@/lib/booking/fare';
import type { Trip } from '@/lib/api/types';

/**
 * Builds the fractional column template for a coach: seat columns get 1fr,
 * the aisle gets a narrow 0.5fr. Because every track is fractional the deck
 * always fits its container exactly.
 */
function columnsTemplate(cols: number, aisleCol: number): string {
  return Array.from({ length: cols }, (_, i) => (i + 1 === aisleCol ? '0.5fr' : 'minmax(0, 1fr)')).join(' ');
}

/** Same tracks for the rotated desktop layout, but as heights. */
function rowsTemplateHorizontal(cols: number, aisleCol: number): string {
  return Array.from({ length: cols }, (_, i) => (i + 1 === aisleCol ? '28px' : '62px')).join(' ');
}

interface SeatMapProps {
  trip: Trip;
  sold: string[];
  selected: string[];
  onToggle: (seatId: string) => void;
  loading?: boolean;
  maxSeats?: number;
}

export function SeatMap({ trip, sold, selected, onToggle, loading = false, maxSeats = 6 }: SeatMapProps) {
  const coach = coachById(trip.coachId);
  const [deck, setDeck] = useState<DeckId>('lower');

  const soldSet = useMemo(() => new Set(sold), [sold]);
  const activeDeck = coach.decks.includes(deck) ? deck : coach.decks[0];
  const seats = seatsForDeck(coach, activeDeck);

  const template = columnsTemplate(coach.cols, coach.aisleCol);
  const templateH = rowsTemplateHorizontal(coach.cols, coach.aisleCol);
  const atLimit = selected.length >= maxSeats;

  if (loading) {
    return (
      <div className="grid min-h-64 place-items-center rounded-md border border-line bg-surface-2">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Checking which seats are free…
        </p>
      </div>
    );
  }

  return (
    <div>
      {coach.decks.length > 1 && (
        <div
          role="tablist"
          aria-label="Choose a deck"
          className="mb-4 grid grid-cols-2 gap-1 rounded-sm bg-surface-2 p-1"
        >
          {coach.decks.map((d) => {
            const isActive = d === activeDeck;
            const freeOnDeck = seatsForDeck(coach, d).filter((s) => !soldSet.has(s.id)).length;

            return (
              <button
                key={d}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setDeck(d)}
                className={`relative min-h-[44px] rounded-xs px-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-900' : 'text-muted hover:text-brand-700'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="deck-pill"
                    className="absolute inset-0 rounded-xs bg-surface shadow-card"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {deckLabel(d)}
                  <span className="ml-1.5 text-xs text-muted tnum">({freeOnDeck})</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-md border border-line bg-surface p-3 md:p-5">
        {/* Driver cabin, so the orientation of the coach is never ambiguous. */}
        <div className="mb-3 flex items-center justify-between border-b border-dashed border-line pb-3 text-xs text-faint md:mb-4">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true">🚍</span> Front of coach
          </span>
          <span>{coach.name}</span>
        </div>

        <div
          className="deck"
          style={
            {
              '--cols-template': template,
              '--cols-template-h': templateH,
              '--row-count': coach.rowsPerDeck,
            } as React.CSSProperties
          }
          role="group"
          aria-label={`${deckLabel(activeDeck)} seat map`}
        >
          {seats.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              price={seatPrice(trip, seat.id)}
              sold={soldSet.has(seat.id)}
              selected={selected.includes(seat.id)}
              disabled={!selected.includes(seat.id) && atLimit}
              onToggle={() => onToggle(seat.id)}
            />
          ))}
        </div>
      </div>

      <Legend />

      {atLimit && (
        <p role="status" className="mt-3 text-sm text-muted">
          That is the maximum of <span className="tnum">{maxSeats}</span> seats per booking. Deselect
          one to choose another.
        </p>
      )}
    </div>
  );
}

function Seat({
  seat,
  price,
  sold,
  selected,
  disabled,
  onToggle,
}: {
  seat: SeatDef;
  price: number;
  sold: boolean;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const isSleeper = seat.kind === 'sleeper';
  const Icon = isSleeper ? BedDouble : Armchair;

  // Status is never carried by colour alone — each state has its own icon
  // treatment, border and accessible label.
  const base =
    'deck-seat relative grid place-items-center rounded-xs border-2 transition-colors duration-150 disabled:cursor-not-allowed';

  const look = sold
    ? 'border-line bg-surface-2 text-faint'
    : selected
      ? 'border-brand-700 bg-brand-700 text-white'
      : seat.ladiesOnly
        ? 'border-seat-ladies/40 bg-seat-ladies/5 text-seat-ladies hover:border-seat-ladies'
        : 'border-seat-free/35 bg-seat-free/5 text-seat-free hover:border-seat-free hover:bg-seat-free/10';

  const label = sold
    ? `Seat ${seat.label}, already booked`
    : `Seat ${seat.label}, ${seat.window ? 'window, ' : ''}${
        seat.ladiesOnly ? 'reserved for women, ' : ''
      }₹${price}${selected ? ', selected' : ''}`;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={sold || disabled}
      aria-pressed={selected}
      aria-label={label}
      title={sold ? `Seat ${seat.label} — booked` : `Seat ${seat.label} — ₹${price}`}
      style={
        {
          '--c': seat.col,
          '--r': seat.row,
          '--s': seat.rowSpan,
        } as React.CSSProperties
      }
      className={`${base} ${look} ${disabled && !sold ? 'opacity-45' : ''}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${isSleeper ? 'rotate-90 md:rotate-0' : ''}`}
        aria-hidden="true"
        strokeWidth={sold ? 1.5 : 2}
      />
      <span className="mt-0.5 text-[10px] font-semibold leading-none tnum">{seat.label}</span>
      {sold && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rotate-[-18deg] bg-faint/50"
        />
      )}
    </button>
  );
}

function Legend() {
  const items = [
    { className: 'border-seat-free/35 bg-seat-free/5', label: 'Available' },
    { className: 'border-brand-700 bg-brand-700', label: 'Selected' },
    { className: 'border-seat-ladies/40 bg-seat-ladies/5', label: 'For women' },
    { className: 'border-line bg-surface-2', label: 'Booked' },
  ];

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={`h-3.5 w-3.5 rounded-[3px] border-2 ${item.className}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
