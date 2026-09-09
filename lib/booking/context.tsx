'use client';

/**
 * The in-progress booking.
 *
 * State lives in three places on purpose:
 *   - the URL holds the search (from / to / date), so links are shareable and
 *     the back button behaves;
 *   - this context holds the draft while the visitor moves between steps;
 *   - sessionStorage mirrors the draft, so a refresh mid-booking loses nothing
 *     while closing the tab discards it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { readJson, removeRaw, writeJson } from '@/lib/storage/safe-storage';

const DRAFT_KEY = 'sg:booking:draft:v1';
export const HOLD_MINUTES = 10;

export interface DraftPassenger {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
}

export interface BookingDraft {
  tripId: string | null;
  seatIds: string[];
  boardingId: string | null;
  droppingId: string | null;
  passengers: Record<string, DraftPassenger>;
  contact: { phone: string; email: string };
  /** Epoch ms. The seat hold expires here and the draft is released. */
  holdExpiresAt: number | null;
}

const emptyDraft: BookingDraft = {
  tripId: null,
  seatIds: [],
  boardingId: null,
  droppingId: null,
  passengers: {},
  contact: { phone: '', email: '' },
  holdExpiresAt: null,
};

type Action =
  | { type: 'hydrate'; draft: BookingDraft }
  | { type: 'selectTrip'; tripId: string }
  | { type: 'toggleSeat'; seatId: string; max: number }
  | { type: 'setStops'; boardingId?: string; droppingId?: string }
  | { type: 'setPassenger'; seatId: string; value: Partial<DraftPassenger> }
  | { type: 'setContact'; value: Partial<{ phone: string; email: string }> }
  | { type: 'clear' };

function reducer(state: BookingDraft, action: Action): BookingDraft {
  switch (action.type) {
    case 'hydrate':
      return action.draft;

    case 'selectTrip':
      // Switching trips invalidates every seat-specific choice.
      return state.tripId === action.tripId
        ? state
        : { ...emptyDraft, tripId: action.tripId };

    case 'toggleSeat': {
      const held = state.seatIds.includes(action.seatId);
      if (!held && state.seatIds.length >= action.max) return state;

      const seatIds = held
        ? state.seatIds.filter((id) => id !== action.seatId)
        : [...state.seatIds, action.seatId];

      const passengers = { ...state.passengers };
      if (held) delete passengers[action.seatId];

      return {
        ...state,
        seatIds,
        passengers,
        holdExpiresAt:
          seatIds.length === 0 ? null : (state.holdExpiresAt ?? Date.now() + HOLD_MINUTES * 60_000),
      };
    }

    case 'setStops':
      return {
        ...state,
        boardingId: action.boardingId ?? state.boardingId,
        droppingId: action.droppingId ?? state.droppingId,
      };

    case 'setPassenger': {
      const existing: DraftPassenger = state.passengers[action.seatId] ?? {
        name: '',
        age: '',
        gender: '',
      };

      return {
        ...state,
        passengers: {
          ...state.passengers,
          [action.seatId]: { ...existing, ...action.value },
        },
      };
    }

    case 'setContact':
      return { ...state, contact: { ...state.contact, ...action.value } };

    case 'clear':
      return emptyDraft;

    default:
      return state;
  }
}

interface BookingContextValue {
  draft: BookingDraft;
  /** False until the sessionStorage draft has been read, so guards don't fire early. */
  ready: boolean;
  secondsLeft: number | null;
  selectTrip: (tripId: string) => void;
  toggleSeat: (seatId: string, max?: number) => void;
  setStops: (stops: { boardingId?: string; droppingId?: string }) => void;
  setPassenger: (seatId: string, value: Partial<DraftPassenger>) => void;
  setContact: (value: Partial<{ phone: string; email: string }>) => void;
  clear: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, dispatch] = useReducer(reducer, emptyDraft);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Hydrate after mount, never during render — the exported HTML must be
  // identical for every visitor.
  useEffect(() => {
    const stored = readJson<BookingDraft>('session', DRAFT_KEY, (value) => value as BookingDraft);
    if (stored && typeof stored === 'object' && Array.isArray(stored.seatIds)) {
      const expired = stored.holdExpiresAt !== null && stored.holdExpiresAt < Date.now();
      dispatch({ type: 'hydrate', draft: expired ? emptyDraft : { ...emptyDraft, ...stored } });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (draft.tripId === null) removeRaw('session', DRAFT_KEY);
    else writeJson('session', DRAFT_KEY, draft);
  }, [draft, ready]);

  // Drive the hold countdown.
  useEffect(() => {
    if (draft.holdExpiresAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [draft.holdExpiresAt]);

  const secondsLeft = useMemo(() => {
    if (draft.holdExpiresAt === null) return null;
    return Math.max(0, Math.round((draft.holdExpiresAt - now) / 1000));
  }, [draft.holdExpiresAt, now]);

  // Release the seats once the hold runs out.
  useEffect(() => {
    if (secondsLeft === 0) dispatch({ type: 'clear' });
  }, [secondsLeft]);

  const value = useMemo<BookingContextValue>(
    () => ({
      draft,
      ready,
      secondsLeft,
      selectTrip: (tripId) => dispatch({ type: 'selectTrip', tripId }),
      toggleSeat: (seatId, max = 6) => dispatch({ type: 'toggleSeat', seatId, max }),
      setStops: (stops) => dispatch({ type: 'setStops', ...stops }),
      setPassenger: (seatId, value) => dispatch({ type: 'setPassenger', seatId, value }),
      setContact: (value) => dispatch({ type: 'setContact', value }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [draft, ready, secondsLeft],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Convenience for the reducer's callers. */
export const useSeatLimit = () => 6;

export function useHoldExpiryRedirect(onExpire: () => void) {
  const { secondsLeft } = useBooking();
  const expired = secondsLeft === 0;
  const cb = useCallback(onExpire, [onExpire]);
  useEffect(() => {
    if (expired) cb();
  }, [expired, cb]);
}
