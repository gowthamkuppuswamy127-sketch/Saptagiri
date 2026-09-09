import type { Stop } from '@/data/routes';
import type { CoachKind, DeckId } from '@/data/coaches';

export interface Trip {
  id: string;
  routeId: string;
  departureId: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  /** yyyy-mm-dd */
  date: string;
  departs: string;
  arrives: string;
  /** 1 when the coach arrives the next morning. Drives the "+1" ticket badge. */
  arrivalDayOffset: number;
  durationMins: number;
  distanceKm: number;
  coachId: string;
  coachName: string;
  coachKind: CoachKind;
  baseFare: number;
  amenities: string[];
  boarding: Stop[];
  dropping: Stop[];
  seatsAvailable: number;
  seatsTotal: number;
}

export interface SeatStatus {
  seatId: string;
  sold: boolean;
}

export interface TripAvailability {
  tripId: string;
  sold: string[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatId: string;
  seatLabel: string;
  deck: DeckId;
}

export interface FareBreakdown {
  base: number;
  seatAdjustments: number;
  gst: number;
  total: number;
}

export interface Booking {
  pnr: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  cancelledAt?: string;
  trip: Trip;
  seatIds: string[];
  passengers: Passenger[];
  boardingId: string;
  droppingId: string;
  contact: { phone: string; email: string };
  fare: FareBreakdown;
  payment: { method: PaymentMethod; reference: string; simulated: true };
}

export type PaymentMethod = 'upi' | 'netbanking' | 'wallet';
