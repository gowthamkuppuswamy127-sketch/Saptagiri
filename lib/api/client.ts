/**
 * The only place the UI talks to for trip and seat data.
 *
 * Today it resolves against seeded local data. To move to a real backend,
 * replace the bodies of these four functions with fetch() calls — no component
 * needs to change, because no component imports the seed data directly.
 */

import { addMinutes, cities, cityName, dayOffset, findRoutes, formatDuration, routes } from '@/data/routes';
import { coachById } from '@/data/coaches';
import type { Trip } from './types';

/** Small deterministic PRNG so a given trip always shows the same sold seats. */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Network feel, so loading states are real rather than decorative. */
const latency = (min = 220, max = 520) =>
  new Promise<void>((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

function buildTrip(routeId: string, departureId: string, date: string): Trip | null {
  const route = routes.find((r) => r.id === routeId);
  if (!route) return null;
  const departure = route.departures.find((d) => d.id === departureId);
  if (!departure) return null;

  const coach = coachById(departure.coachId);
  const fromCity = route.from;
  const toCity = route.to;

  const soldCount = soldSeatIds(`${routeId}|${departureId}|${date}`, coach.seats.map((s) => s.id)).length;

  return {
    id: `${departureId}__${date}`,
    routeId: route.id,
    departureId: departure.id,
    from: fromCity,
    to: toCity,
    fromName: cityName(fromCity),
    toName: cityName(toCity),
    date,
    departs: departure.departs,
    arrives: addMinutes(departure.departs, route.durationMins),
    arrivalDayOffset: dayOffset(departure.departs, route.durationMins),
    durationMins: route.durationMins,
    distanceKm: route.distanceKm,
    coachId: coach.id,
    coachName: coach.name,
    coachKind: coach.kind,
    baseFare: departure.fare,
    amenities: coach.amenities,
    boarding: [],
    dropping: [],
    seatsAvailable: coach.seats.length - soldCount,
    seatsTotal: coach.seats.length,
  };
}

/** Between 18% and 32% of a coach is already sold, stable per trip and date. */
function soldSeatIds(seed: string, allSeatIds: string[]): string[] {
  const rand = mulberry32(hashString(seed));
  const ratio = 0.18 + rand() * 0.14;
  return allSeatIds.filter(() => rand() < ratio);
}

export async function searchTrips(from: string, to: string, date: string): Promise<Trip[]> {
  await latency();

  const matches = findRoutes(from, to);
  const trips: Trip[] = [];

  for (const { route, reversed } of matches) {
    for (const departure of route.departures) {
      const trip = buildTrip(route.id, departure.id, date);
      if (!trip) continue;

      if (reversed) {
        trip.from = route.to;
        trip.to = route.from;
        trip.fromName = cityName(route.to);
        trip.toName = cityName(route.from);
        trip.id = `${departure.id}-r__${date}`;
      }

      const origin = reversed ? route.to : route.from;
      const destination = reversed ? route.from : route.to;
      trip.boarding = stopsFor(origin, 'boarding');
      trip.dropping = stopsFor(destination, 'dropping');

      trips.push(trip);
    }
  }

  return trips.sort((a, b) => a.departs.localeCompare(b.departs));
}

export async function getTrip(tripId: string): Promise<Trip | null> {
  await latency(120, 300);

  const [departurePart, date] = tripId.split('__');
  if (!departurePart || !date) return null;

  const reversed = departurePart.endsWith('-r');
  const departureId = reversed ? departurePart.slice(0, -2) : departurePart;

  const route = routes.find((r) => r.departures.some((d) => d.id === departureId));
  if (!route) return null;

  const trip = buildTrip(route.id, departureId, date);
  if (!trip) return null;

  if (reversed) {
    trip.from = route.to;
    trip.to = route.from;
    trip.fromName = cityName(route.to);
    trip.toName = cityName(route.from);
    trip.id = tripId;
  }

  const origin = reversed ? route.to : route.from;
  const destination = reversed ? route.from : route.to;
  trip.boarding = stopsFor(origin, 'boarding');
  trip.dropping = stopsFor(destination, 'dropping');

  return trip;
}

export async function getSoldSeats(tripId: string, coachId: string): Promise<string[]> {
  await latency(150, 340);
  const coach = coachById(coachId);
  return soldSeatIds(tripId, coach.seats.map((s) => s.id));
}

/**
 * Stands in for the payment gateway. A real integration creates an order on
 * the server, hands off to the gateway's hosted checkout, and verifies the
 * signature server-side — no card data ever reaches this codebase.
 */
export async function processPayment(): Promise<{ reference: string }> {
  await latency(1600, 2400);
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return { reference: `SIM${Date.now().toString(36).toUpperCase()}${suffix}` };
}

function stopsFor(cityCode: string, kind: 'boarding' | 'dropping') {
  return cities.find((c) => c.code === cityCode)?.[kind] ?? [];
}

export { formatDuration };
