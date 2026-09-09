'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2, ShieldCheck, User } from 'lucide-react';
import { ErrorSummary, SelectField, TextField } from '@/components/ui/Field';
import { StickyBar } from '@/components/booking/StickyBar';
import { getTrip } from '@/lib/api/client';
import type { Trip } from '@/lib/api/types';
import { useBooking } from '@/lib/booking/context';
import { computeFare, seatPrice, formatINR } from '@/lib/booking/fare';
import { coachById } from '@/data/coaches';
import { contactSchema, fieldErrors, passengerSchema } from '@/lib/schemas';

export default function PassengersPage() {
  const router = useRouter();
  const { draft, ready, setPassenger, setContact } = useBooking();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  // Guard: arriving here without seats means the draft was lost or the link
  // was opened directly. Send them back rather than rendering an empty form.
  useEffect(() => {
    if (!ready) return;
    if (!draft.tripId) {
      router.replace('/');
      return;
    }
    if (draft.seatIds.length === 0) {
      router.replace(`/booking/seats/?trip=${encodeURIComponent(draft.tripId)}`);
    }
  }, [ready, draft.tripId, draft.seatIds.length, router]);

  useEffect(() => {
    if (!draft.tripId) return;
    let live = true;
    getTrip(draft.tripId).then((t) => live && setTrip(t));
    return () => {
      live = false;
    };
  }, [draft.tripId]);

  if (!ready || !trip || draft.seatIds.length === 0) {
    return (
      <p className="container-page flex items-center gap-2 py-16 text-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading your selection…
      </p>
    );
  }

  const coach = coachById(trip.coachId);
  const fare = computeFare(trip, draft.seatIds);

  const validate = (): boolean => {
    const found: Record<string, string> = {};

    for (const seatId of draft.seatIds) {
      const seat = coach.seats.find((s) => s.id === seatId);
      const label = seat?.label ?? seatId;
      const entry = draft.passengers[seatId];
      const parsed = passengerSchema.safeParse({
        name: entry?.name ?? '',
        age: Number(entry?.age),
        gender: entry?.gender,
      });

      if (!parsed.success) {
        for (const [field, message] of Object.entries(fieldErrors(parsed.error))) {
          found[`${seatId}.${field}`] = `Seat ${label}: ${message}`;
        }
        continue;
      }

      // A seat reserved for women has to actually be occupied by one,
      // otherwise the reservation means nothing at boarding.
      if (seat?.ladiesOnly && parsed.data.gender !== 'female') {
        found[`${seatId}.gender`] =
          `Seat ${label} is reserved for women. Choose a different seat for this traveller.`;
      }
    }

    const contact = contactSchema.safeParse(draft.contact);
    if (!contact.success) Object.assign(found, fieldErrors(contact.error));

    setErrors(found);

    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return false;
    }
    return true;
  };

  const submit = () => {
    if (validate()) router.push('/booking/payment/');
  };

  return (
    <div className="container-page py-6 pb-32 md:py-10 md:pb-36">
      <Link
        href={`/booking/seats/?trip=${encodeURIComponent(trip.id)}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Change seats
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-brand-900 md:text-3xl">
        Who is travelling?
      </h1>
      <p className="mt-1.5 text-muted">
        Names must match the ID each traveller carries — the conductor checks them at boarding.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <div ref={summaryRef} tabIndex={-1}>
            <ErrorSummary errors={errors} />
          </div>

          {draft.seatIds.map((seatId, index) => {
            const seat = coach.seats.find((s) => s.id === seatId);
            const entry = draft.passengers[seatId] ?? { name: '', age: '', gender: '' };

            return (
              <fieldset key={seatId} className="rounded-md border border-line bg-surface p-5">
                <legend className="flex items-center gap-2 px-1">
                  <User className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  <span className="font-display text-sm font-semibold text-brand-900">
                    Traveller {index + 1}
                  </span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium tnum text-brand-700">
                    Seat {seat?.label}
                  </span>
                  {seat?.ladiesOnly && (
                    <span className="rounded-full bg-seat-ladies/10 px-2 py-0.5 text-xs font-medium text-seat-ladies">
                      Women only
                    </span>
                  )}
                </legend>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_100px_140px]">
                  <TextField
                    label="Full name"
                    required
                    value={entry.name}
                    autoComplete="name"
                    placeholder="As printed on ID"
                    error={errors[`${seatId}.name`]}
                    onChange={(e) => setPassenger(seatId, { name: e.target.value })}
                  />
                  <TextField
                    label="Age"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={entry.age}
                    error={errors[`${seatId}.age`]}
                    onChange={(e) =>
                      setPassenger(seatId, { age: e.target.value.replace(/\D/g, '').slice(0, 3) })
                    }
                  />
                  <SelectField
                    label="Gender"
                    required
                    value={entry.gender}
                    error={errors[`${seatId}.gender`]}
                    onChange={(e) =>
                      setPassenger(seatId, {
                        gender: e.target.value as 'male' | 'female' | 'other' | '',
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </SelectField>
                </div>
              </fieldset>
            );
          })}

          <fieldset className="rounded-md border border-line bg-surface p-5">
            <legend className="px-1 font-display text-sm font-semibold text-brand-900">
              Where should the ticket go?
            </legend>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                label="Mobile number"
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="10-digit number"
                value={draft.contact.phone}
                error={errors.phone}
                onChange={(e) =>
                  setContact({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                }
              />
              <TextField
                label="Email"
                required
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={draft.contact.email}
                error={errors.email}
                onChange={(e) => setContact({ email: e.target.value })}
              />
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seat-free" aria-hidden="true" />
              These details stay in this browser. Nothing is sent to a server or shared with anyone.
            </p>
          </fieldset>
        </div>

        <aside className="rounded-md border border-line bg-surface-2 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-sm font-semibold text-brand-900">Fare summary</h2>

          <ul className="mt-3 space-y-2 text-sm">
            {draft.seatIds.map((seatId) => {
              const seat = coach.seats.find((s) => s.id === seatId);
              return (
                <li key={seatId} className="flex justify-between gap-4">
                  <span className="text-muted">
                    Seat <span className="tnum">{seat?.label}</span>
                  </span>
                  <span className="tnum text-ink">{formatINR(seatPrice(trip, seatId))}</span>
                </li>
              );
            })}
            <li className="flex justify-between gap-4 border-t border-line pt-2">
              <span className="text-muted">GST</span>
              <span className="tnum text-ink">{formatINR(fare.gst)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-line pt-2">
              <span className="font-semibold text-brand-900">Total</span>
              <span className="font-display font-semibold tnum text-brand-700">
                {formatINR(fare.total)}
              </span>
            </li>
          </ul>
        </aside>
      </div>

      <StickyBar
        primaryLabel="Continue to payment"
        total={fare.total}
        hint={`${draft.seatIds.length} ${draft.seatIds.length === 1 ? 'traveller' : 'travellers'}`}
        onPrimary={submit}
      />
    </div>
  );
}
