/**
 * Charter hire — vehicles let out with a driver. Rates are indicative and
 * quoted properly once the office sees the route; edit them here.
 */

export interface RentalVehicle {
  id: string;
  name: string;
  seats: string;
  perKm: number;
  minKm: number;
  driverAllowance: number;
  bestFor: string;
  features: string[];
  ac: boolean;
}

export const rentalVehicles: RentalVehicle[] = [
  {
    id: 'tt-12',
    name: 'Tempo Traveller 12-seater',
    seats: '12 + driver',
    perKm: 26,
    minKm: 250,
    driverAllowance: 400,
    bestFor: 'Family trips and small groups',
    features: ['Air conditioned', 'Push-back seats', 'Luggage carrier', 'Music system'],
    ac: true,
  },
  {
    id: 'tt-17',
    name: 'Tempo Traveller 17-seater',
    seats: '17 + driver',
    perKm: 30,
    minKm: 250,
    driverAllowance: 400,
    bestFor: 'Temple trips and weekend tours',
    features: ['Air conditioned', 'Push-back seats', 'Extra legroom', 'Luggage carrier'],
    ac: true,
  },
  {
    id: 'mini-32',
    name: 'Mini bus 32-seater',
    seats: '32 + driver',
    perKm: 42,
    minKm: 300,
    driverAllowance: 600,
    bestFor: 'School excursions and office outings',
    features: ['Air conditioned', 'Overhead storage', 'Public address system', 'Two-door access'],
    ac: true,
  },
  {
    id: 'coach-45',
    name: 'Coach 45-seater',
    seats: '45 + driver',
    perKm: 55,
    minKm: 300,
    driverAllowance: 800,
    bestFor: 'Weddings and large group travel',
    features: ['Air conditioned', 'Reclining seats', 'Large luggage bay', 'Public address system'],
    ac: true,
  },
  {
    id: 'sleeper-charter',
    name: 'Sleeper coach charter',
    seats: '36 berths',
    perKm: 65,
    minKm: 400,
    driverAllowance: 1000,
    bestFor: 'Overnight group travel across states',
    features: ['Air conditioned', 'Full berths', 'Curtains', 'Charging points'],
    ac: true,
  },
  {
    id: 'suv-7',
    name: 'SUV (Innova or similar)',
    seats: '6 + driver',
    perKm: 18,
    minKm: 250,
    driverAllowance: 400,
    bestFor: 'Airport runs and small family trips',
    features: ['Air conditioned', 'Comfortable for long drives', 'Boot space'],
    ac: true,
  },
];

export interface UseCase {
  title: string;
  body: string;
}

export const useCases: UseCase[] = [
  {
    title: 'Weddings',
    body: 'Move the whole party between venue, hall and station on a schedule that actually holds.',
  },
  {
    title: 'Temple trips',
    body: 'Tirupati, Dharmasthala, Kukke Subramanya, Sringeri — drivers who have done the route many times.',
  },
  {
    title: 'School and college tours',
    body: 'Verified drivers, seat belts checked, and a teacher-friendly itinerary with fixed halts.',
  },
  {
    title: 'Corporate travel',
    body: 'Offsites, factory visits and airport shuttles, with a single invoice at the end of the month.',
  },
];

export const rentalFaqs = [
  {
    q: 'What is included in the rate?',
    a: 'The per-kilometre rate covers the vehicle, driver and fuel. Tolls, parking, permits and the driver allowance are charged at actuals and shown separately on the quote.',
  },
  {
    q: 'How is the distance calculated?',
    a: 'From our garage back to our garage, with a daily minimum. If your trip runs under the minimum, the minimum applies.',
  },
  {
    q: 'What about overnight trips?',
    a: 'A driver allowance applies for each night the vehicle is away. Accommodation for the driver is arranged by us unless you prefer otherwise.',
  },
  {
    q: 'How far ahead should we book?',
    a: 'A week is comfortable. In wedding and festival season, book earlier — the larger coaches go first.',
  },
];
