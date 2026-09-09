import type { Trip, FareBreakdown } from '@/lib/api/types';
import { coachById } from '@/data/coaches';

/** GST on air-conditioned stage carriage tickets. */
const GST_RATE = 0.05;

export function seatPrice(trip: Trip, seatId: string): number {
  const coach = coachById(trip.coachId);
  const seat = coach.seats.find((s) => s.id === seatId);
  return trip.baseFare + (seat?.priceDelta ?? 0);
}

export function computeFare(trip: Trip, seatIds: string[]): FareBreakdown {
  const base = trip.baseFare * seatIds.length;
  const seatAdjustments = seatIds.reduce((sum, id) => sum + (seatPrice(trip, id) - trip.baseFare), 0);
  const subtotal = base + seatAdjustments;
  const gst = Math.round(subtotal * GST_RATE);

  return { base, seatAdjustments, gst, total: subtotal + gst };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
