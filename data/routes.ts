/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE FILE TO EDIT.
 *
 * Every route, timing, fare and boarding point on the site comes from here.
 * Correct these values and the whole site updates — search, home page, seat
 * pricing and tickets all read from this one place.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Stop {
  id: string;
  name: string;
  landmark: string;
  /** Minutes from the trip's departure time. Negative values are pre-departure pickups. */
  offsetMins: number;
}

export interface City {
  code: string;
  name: string;
  state: string;
  boarding: Stop[];
  dropping: Stop[];
}

export interface Departure {
  id: string;
  /** 24h "HH:mm" in IST. */
  departs: string;
  coachId: string;
  /** Base fare in rupees before seat-tier adjustment. */
  fare: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMins: number;
  popular: boolean;
  /** One honest line about the journey — used on route cards. */
  note: string;
  departures: Departure[];
}

const bangaloreBoarding: Stop[] = [
  { id: 'blr-kanakapura', name: 'Kanakapura Road', landmark: 'Sapthagiri office, Gangadhar Nagar', offsetMins: -20 },
  { id: 'blr-banashankari', name: 'Banashankari', landmark: 'BDA Complex bus stop', offsetMins: -12 },
  { id: 'blr-majestic', name: 'Majestic', landmark: 'Kempegowda Bus Station, Gate 4', offsetMins: 0 },
  { id: 'blr-yeshwanthpur', name: 'Yeshwanthpur', landmark: 'Opposite railway station', offsetMins: 15 },
  { id: 'blr-silkboard', name: 'Silk Board', landmark: 'Central Silk Board junction', offsetMins: 18 },
  { id: 'blr-ecity', name: 'Electronic City', landmark: 'Toll gate, Hosur Road', offsetMins: 35 },
];

const bangaloreDropping: Stop[] = [
  { id: 'blr-d-ecity', name: 'Electronic City', landmark: 'Toll gate, Hosur Road', offsetMins: -35 },
  { id: 'blr-d-silkboard', name: 'Silk Board', landmark: 'Central Silk Board junction', offsetMins: -18 },
  { id: 'blr-d-majestic', name: 'Majestic', landmark: 'Kempegowda Bus Station', offsetMins: 0 },
  { id: 'blr-d-kanakapura', name: 'Kanakapura Road', landmark: 'Sapthagiri office', offsetMins: 12 },
];

function stops(prefix: string, entries: [string, string, number][]): Stop[] {
  return entries.map(([name, landmark, offsetMins]) => ({
    id: `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    landmark,
    offsetMins,
  }));
}

export const cities: City[] = [
  {
    code: 'BLR',
    name: 'Bangalore',
    state: 'Karnataka',
    boarding: bangaloreBoarding,
    dropping: bangaloreDropping,
  },
  {
    code: 'MYS',
    name: 'Mysore',
    state: 'Karnataka',
    boarding: stops('mys-b', [
      ['Mysore Bus Stand', 'City bus stand, Platform 2', 0],
      ['Hebbal Ring Road', 'Near Infosys campus gate', 12],
    ]),
    dropping: stops('mys-d', [
      ['Hebbal Ring Road', 'Near Infosys campus gate', -12],
      ['Mysore Bus Stand', 'City bus stand', 0],
      ['Chamundi Vihar', 'Stadium road', 10],
    ]),
  },
  {
    code: 'MNG',
    name: 'Mangalore',
    state: 'Karnataka',
    boarding: stops('mng-b', [
      ['State Bank', 'Opposite Hampankatta', 0],
      ['Kankanady', 'Junction bus stop', 10],
    ]),
    dropping: stops('mng-d', [
      ['Nanthoor', 'Ring road junction', -15],
      ['State Bank', 'Hampankatta', 0],
      ['Kankanady', 'Junction bus stop', 8],
    ]),
  },
  {
    code: 'UDP',
    name: 'Udupi',
    state: 'Karnataka',
    boarding: stops('udp-b', [['Service Bus Stand', 'Near Sri Krishna Temple', 0]]),
    dropping: stops('udp-d', [
      ['Manipal', 'Tiger Circle', -12],
      ['Service Bus Stand', 'Near Sri Krishna Temple', 0],
    ]),
  },
  {
    code: 'HBL',
    name: 'Hubli',
    state: 'Karnataka',
    boarding: stops('hbl-b', [
      ['Hubli Old Bus Stand', 'Near Durgad Bail', 0],
      ['Dharwad', 'Jubilee Circle', 40],
    ]),
    dropping: stops('hbl-d', [
      ['Hubli Old Bus Stand', 'Near Durgad Bail', 0],
      ['Dharwad', 'Jubilee Circle', 40],
    ]),
  },
  {
    code: 'SMG',
    name: 'Shivamogga',
    state: 'Karnataka',
    boarding: stops('smg-b', [['Shivamogga Bus Stand', 'Private stand, Gopi Circle', 0]]),
    dropping: stops('smg-d', [
      ['Sagar Road', 'Near Nehru Stadium', -10],
      ['Shivamogga Bus Stand', 'Private stand', 0],
    ]),
  },
  {
    code: 'CKM',
    name: 'Chikmagalur',
    state: 'Karnataka',
    boarding: stops('ckm-b', [['Chikmagalur Bus Stand', 'Near IB Circle', 0]]),
    dropping: stops('ckm-d', [
      ['Kadur', 'Highway junction', -45],
      ['Chikmagalur Bus Stand', 'Near IB Circle', 0],
    ]),
  },
  {
    code: 'MDK',
    name: 'Madikeri',
    state: 'Karnataka',
    boarding: stops('mdk-b', [['Madikeri Bus Stand', 'Private stand, General Thimayya Road', 0]]),
    dropping: stops('mdk-d', [
      ['Kushalnagar', 'Highway stop', -50],
      ['Madikeri Bus Stand', 'Private stand', 0],
    ]),
  },
  {
    code: 'HMP',
    name: 'Hampi',
    state: 'Karnataka',
    boarding: stops('hmp-b', [['Hospet Bus Stand', 'Near railway station', 0]]),
    dropping: stops('hmp-d', [
      ['Hospet', 'Near railway station', -20],
      ['Hampi Bazaar', 'Main road drop', 0],
    ]),
  },
];

export const routes: Route[] = [
  {
    id: 'blr-mys',
    from: 'BLR',
    to: 'MYS',
    distanceKm: 145,
    durationMins: 195,
    popular: true,
    note: 'Down the Mysore expressway — the short run, and our most frequent service.',
    departures: [
      { id: 'blr-mys-0700', departs: '07:00', coachId: 'seater-2x2', fare: 349 },
      { id: 'blr-mys-1430', departs: '14:30', coachId: 'semi-2x2', fare: 429 },
      { id: 'blr-mys-2230', departs: '22:30', coachId: 'sleeper-2x1', fare: 549 },
    ],
  },
  {
    id: 'blr-mng',
    from: 'BLR',
    to: 'MNG',
    distanceKm: 352,
    durationMins: 465,
    popular: true,
    note: 'Overnight through Shiradi Ghat. Sleeper berths, arrives by breakfast.',
    departures: [
      { id: 'blr-mng-2030', departs: '20:30', coachId: 'sleeper-2x1', fare: 899 },
      { id: 'blr-mng-2200', departs: '22:00', coachId: 'sleeper-2x1', fare: 949 },
      { id: 'blr-mng-2315', departs: '23:15', coachId: 'semi-2x2', fare: 749 },
    ],
  },
  {
    id: 'blr-udp',
    from: 'BLR',
    to: 'UDP',
    distanceKm: 405,
    durationMins: 510,
    popular: true,
    note: 'Straight through to the temple town, with a Manipal drop on the way in.',
    departures: [
      { id: 'blr-udp-2015', departs: '20:15', coachId: 'sleeper-2x1', fare: 949 },
      { id: 'blr-udp-2245', departs: '22:45', coachId: 'semi-2x2', fare: 799 },
    ],
  },
  {
    id: 'blr-hbl',
    from: 'BLR',
    to: 'HBL',
    distanceKm: 410,
    durationMins: 480,
    popular: true,
    note: 'North Karnataka overnight on NH-48, continuing to Dharwad.',
    departures: [
      { id: 'blr-hbl-2100', departs: '21:00', coachId: 'sleeper-2x1', fare: 899 },
      { id: 'blr-hbl-2330', departs: '23:30', coachId: 'semi-2x2', fare: 729 },
    ],
  },
  {
    id: 'blr-smg',
    from: 'BLR',
    to: 'SMG',
    distanceKm: 300,
    durationMins: 390,
    popular: false,
    note: 'Via Tumkur and Tiptur, into the Malnad belt.',
    departures: [
      { id: 'blr-smg-2145', departs: '21:45', coachId: 'sleeper-2x1', fare: 699 },
      { id: 'blr-smg-2300', departs: '23:00', coachId: 'semi-2x2', fare: 599 },
    ],
  },
  {
    id: 'blr-ckm',
    from: 'BLR',
    to: 'CKM',
    distanceKm: 245,
    durationMins: 330,
    popular: false,
    note: 'Coffee country. Overnight arrival before the estates open up.',
    departures: [
      { id: 'blr-ckm-2230', departs: '22:30', coachId: 'sleeper-2x1', fare: 649 },
      { id: 'blr-ckm-2345', departs: '23:45', coachId: 'semi-2x2', fare: 549 },
    ],
  },
  {
    id: 'blr-mdk',
    from: 'BLR',
    to: 'MDK',
    distanceKm: 265,
    durationMins: 345,
    popular: true,
    note: 'Into Coorg via Kushalnagar — the hill run, best taken overnight.',
    departures: [
      { id: 'blr-mdk-2215', departs: '22:15', coachId: 'sleeper-2x1', fare: 749 },
      { id: 'blr-mdk-2330', departs: '23:30', coachId: 'semi-2x2', fare: 629 },
    ],
  },
  {
    id: 'blr-hmp',
    from: 'BLR',
    to: 'HMP',
    distanceKm: 340,
    durationMins: 495,
    popular: false,
    note: 'Overnight to Hospet, dropping at Hampi Bazaar for the ruins.',
    departures: [
      { id: 'blr-hmp-2130', departs: '21:30', coachId: 'sleeper-2x1', fare: 899 },
    ],
  },
];

/* ── helpers ─────────────────────────────────────────────────────────────── */

export const cityByCode = (code: string): City | undefined =>
  cities.find((c) => c.code === code);

export const cityName = (code: string): string => cityByCode(code)?.name ?? code;

/** Routes run in both directions; the return leg mirrors the outbound one. */
export function findRoutes(from: string, to: string): { route: Route; reversed: boolean }[] {
  const matches: { route: Route; reversed: boolean }[] = [];
  for (const route of routes) {
    if (route.from === from && route.to === to) matches.push({ route, reversed: false });
    else if (route.to === from && route.from === to) matches.push({ route, reversed: true });
  }
  return matches;
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** "22:30" + 465 mins -> "06:15" */
export function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = (h * 60 + m + mins + 1440 * 3) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Days the arrival lands after departure — used for the "+1 day" ticket badge. */
export function dayOffset(time: string, mins: number): number {
  const [h, m] = time.split(':').map(Number);
  return Math.floor((h * 60 + m + mins) / 1440);
}
