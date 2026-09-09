/**
 * Confirmed bookings, kept in the visitor's own browser.
 *
 * Nothing here is transmitted anywhere. When a real backend arrives, these
 * four functions become authenticated API calls and the rest of the app is
 * untouched.
 */

import { z } from 'zod';
import type { Booking } from '@/lib/api/types';
import { readJson, writeJson } from './safe-storage';

const KEY = 'sg:bookings:v1';

/** Loose on the nested trip, strict on the fields the UI actually reads. */
const bookingSchema = z.object({
  pnr: z.string().min(3),
  status: z.enum(['confirmed', 'cancelled']),
  createdAt: z.string(),
  cancelledAt: z.string().optional(),
  trip: z.looseObject({
    id: z.string(),
    fromName: z.string(),
    toName: z.string(),
    date: z.string(),
    departs: z.string(),
    arrives: z.string(),
    coachName: z.string(),
  }),
  seatIds: z.array(z.string()),
  passengers: z.array(
    z.looseObject({
      name: z.string(),
      age: z.number(),
      seatLabel: z.string(),
    }),
  ),
  boardingId: z.string(),
  droppingId: z.string(),
  contact: z.object({ phone: z.string(), email: z.string() }),
  fare: z.object({
    base: z.number(),
    seatAdjustments: z.number(),
    gst: z.number(),
    total: z.number(),
  }),
  payment: z.looseObject({ method: z.string(), reference: z.string() }),
});

const listSchema = z.array(bookingSchema);

export function listBookings(): Booking[] {
  const parsed = readJson('local', KEY, (value) => listSchema.safeParse(value));
  if (!parsed || !parsed.success) return [];
  return parsed.data as unknown as Booking[];
}

export function saveBooking(booking: Booking): void {
  const all = listBookings();
  writeJson('local', KEY, [booking, ...all.filter((b) => b.pnr !== booking.pnr)]);
}

export function findBooking(pnr: string): Booking | undefined {
  return listBookings().find((b) => b.pnr === pnr);
}

export function cancelBooking(pnr: string): Booking | undefined {
  const all = listBookings();
  const next = all.map((b) =>
    b.pnr === pnr ? { ...b, status: 'cancelled' as const, cancelledAt: new Date().toISOString() } : b,
  );
  writeJson('local', KEY, next);
  return next.find((b) => b.pnr === pnr);
}

/** A journey is "past" once its travel date has gone by. */
export function isPast(booking: Booking): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${booking.trip.date}T00:00:00`) < today;
}
