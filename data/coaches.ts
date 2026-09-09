/**
 * Coach layouts. Seats are generated from a small spec rather than listed by
 * hand, so changing a coach means changing three numbers, not forty rows.
 *
 * Coordinates are always expressed in "vertical" orientation — front of the
 * bus at the top, seats laid out across the width. The seat map swaps row and
 * column when it renders horizontally on desktop.
 */

export type CoachKind = 'sleeper' | 'semi-sleeper' | 'seater';
export type DeckId = 'lower' | 'upper';

export interface SeatDef {
  id: string;
  label: string;
  deck: DeckId;
  kind: CoachKind;
  col: number;
  row: number;
  /** Sleeper berths occupy two grid rows so they read as beds, not chairs. */
  rowSpan: number;
  window: boolean;
  ladiesOnly: boolean;
  /** Added to (or taken off) the trip's base fare. */
  priceDelta: number;
}

export interface Coach {
  id: string;
  name: string;
  kind: CoachKind;
  /** Total grid columns including the aisle. */
  cols: number;
  aisleCol: number;
  rowsPerDeck: number;
  decks: DeckId[];
  seats: SeatDef[];
  amenities: string[];
  description: string;
}

interface CoachSpec {
  id: string;
  name: string;
  kind: CoachKind;
  /** Seat columns to the left of the aisle, then to the right. */
  left: number;
  right: number;
  rows: number;
  decks: DeckId[];
  amenities: string[];
  description: string;
  /** Upper berths are cheaper; window seats on day coaches cost a little more. */
  upperDelta?: number;
  windowDelta?: number;
}

function buildSeats(spec: CoachSpec): SeatDef[] {
  const seats: SeatDef[] = [];
  const aisleCol = spec.left + 1;
  const rowSpan = spec.kind === 'sleeper' ? 2 : 1;
  const lastCol = spec.left + 1 + spec.right;

  for (const deck of spec.decks) {
    let n = 0;
    for (let row = 1; row <= spec.rows; row++) {
      for (let c = 1; c <= spec.left + spec.right; c++) {
        // Skip the aisle when mapping seat index to grid column.
        const col = c <= spec.left ? c : c + 1;
        n += 1;

        const isWindow = col === 1 || col === lastCol;
        const prefix = spec.decks.length > 1 ? (deck === 'lower' ? 'L' : 'U') : '';
        const label = `${prefix}${n}`;

        seats.push({
          id: `${spec.id}-${deck}-${label}`,
          label,
          deck,
          kind: spec.kind,
          col,
          row: (row - 1) * rowSpan + 1,
          rowSpan,
          window: isWindow,
          // A small block of seats reserved for women travelling alone, as most
          // Karnataka operators do. Front rows of the lower deck.
          ladiesOnly: deck === 'lower' && row === 1 && col <= 2,
          priceDelta:
            (deck === 'upper' ? (spec.upperDelta ?? 0) : 0) +
            (isWindow ? (spec.windowDelta ?? 0) : 0),
        });
      }
    }
  }

  return seats;
}

function makeCoach(spec: CoachSpec): Coach {
  return {
    id: spec.id,
    name: spec.name,
    kind: spec.kind,
    cols: spec.left + 1 + spec.right,
    aisleCol: spec.left + 1,
    rowsPerDeck: spec.rows * (spec.kind === 'sleeper' ? 2 : 1),
    decks: spec.decks,
    seats: buildSeats(spec),
    amenities: spec.amenities,
    description: spec.description,
  };
}

export const coaches: Coach[] = [
  makeCoach({
    id: 'sleeper-2x1',
    name: 'AC Sleeper (2+1)',
    kind: 'sleeper',
    left: 2,
    right: 1,
    rows: 6,
    decks: ['lower', 'upper'],
    upperDelta: -50,
    amenities: ['Air conditioned', 'Personal berth curtain', 'Reading light', 'Charging point', 'Blanket & pillow', 'Emergency exit'],
    description: 'Full-length berths, two on one side and a single on the other. The overnight coach.',
  }),
  makeCoach({
    id: 'semi-2x2',
    name: 'AC Semi-Sleeper (2+2)',
    kind: 'semi-sleeper',
    left: 2,
    right: 2,
    rows: 10,
    decks: ['lower'],
    windowDelta: 20,
    amenities: ['Air conditioned', 'Reclining seat', 'Footrest', 'Charging point', 'Reading light'],
    description: 'Deep-reclining seats with a footrest. Comfortable for shorter overnight runs.',
  }),
  makeCoach({
    id: 'seater-2x2',
    name: 'Non-AC Seater (2+2)',
    kind: 'seater',
    left: 2,
    right: 2,
    rows: 11,
    decks: ['lower'],
    windowDelta: 20,
    amenities: ['Push-back seat', 'Charging point', 'Large windows', 'Overhead storage'],
    description: 'The daytime coach. Push-back seats and windows that actually open.',
  }),
];

export const coachById = (id: string): Coach =>
  coaches.find((c) => c.id === id) ?? coaches[0];

export const seatsForDeck = (coach: Coach, deck: DeckId): SeatDef[] =>
  coach.seats.filter((s) => s.deck === deck);

export const deckLabel = (deck: DeckId): string =>
  deck === 'lower' ? 'Lower deck' : 'Upper deck';
