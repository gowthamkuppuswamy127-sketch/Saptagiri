'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Info, Loader2, Lock, QrCode, Smartphone, Landmark, Wallet } from 'lucide-react';
import { TextField } from '@/components/ui/Field';
import { StickyBar } from '@/components/booking/StickyBar';
import { getTrip, processPayment } from '@/lib/api/client';
import type { Booking, PaymentMethod, Trip } from '@/lib/api/types';
import { useBooking } from '@/lib/booking/context';
import { computeFare, formatINR, seatPrice } from '@/lib/booking/fare';
import { generatePnr } from '@/lib/booking/pnr';
import { saveBooking } from '@/lib/storage/bookings-repo';
import { coachById } from '@/data/coaches';
import { upiSchema } from '@/lib/schemas';

const methods: { id: PaymentMethod; label: string; hint: string; icon: typeof Smartphone }[] = [
  { id: 'upi', label: 'UPI', hint: 'GPay, PhonePe, Paytm or any UPI app', icon: Smartphone },
  { id: 'netbanking', label: 'Net banking', hint: 'All major Indian banks', icon: Landmark },
  { id: 'wallet', label: 'Wallet', hint: 'Paytm, Amazon Pay, Mobikwik', icon: Wallet },
];

const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank'];
const wallets = ['Paytm', 'Amazon Pay', 'Mobikwik', 'Freecharge'];

export default function PaymentPage() {
  const router = useRouter();
  const { draft, ready } = useBooking();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [upi, setUpi] = useState('');
  const [bank, setBank] = useState(banks[0]);
  const [wallet, setWallet] = useState(wallets[0]);
  const [showQr, setShowQr] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState(false);

  // Once payment succeeds the draft is deliberately left alone until the
  // confirmation page takes over — clearing it here would trip this guard and
  // bounce the traveller home instead of to their ticket.
  useEffect(() => {
    if (!ready || paid) return;
    if (!draft.tripId) {
      router.replace('/');
      return;
    }
    if (draft.seatIds.length === 0) {
      router.replace(`/booking/seats/?trip=${encodeURIComponent(draft.tripId)}`);
    }
  }, [ready, paid, draft.tripId, draft.seatIds.length, router]);

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
        Loading your booking…
      </p>
    );
  }

  const coach = coachById(trip.coachId);
  const fare = computeFare(trip, draft.seatIds);

  const pay = async () => {
    if (method === 'upi' && !showQr) {
      const parsed = upiSchema.safeParse(upi);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? 'Enter a valid UPI ID');
        return;
      }
    }

    setError(null);
    setBusy(true);

    const { reference } = await processPayment();

    const booking: Booking = {
      pnr: generatePnr(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      trip,
      seatIds: draft.seatIds,
      passengers: draft.seatIds.map((seatId) => {
        const seat = coach.seats.find((s) => s.id === seatId);
        const entry = draft.passengers[seatId];
        return {
          name: entry?.name ?? '',
          age: Number(entry?.age ?? 0),
          gender: (entry?.gender || 'other') as 'male' | 'female' | 'other',
          seatId,
          seatLabel: seat?.label ?? seatId,
          deck: seat?.deck ?? 'lower',
        };
      }),
      boardingId: draft.boardingId ?? '',
      droppingId: draft.droppingId ?? '',
      contact: draft.contact,
      fare,
      payment: { method, reference, simulated: true },
    };

    saveBooking(booking);
    setPaid(true);
    router.push(`/booking/confirmation/?pnr=${encodeURIComponent(booking.pnr)}`);
  };

  return (
    <div className="container-page py-6 pb-32 md:py-10 md:pb-36">
      <Link
        href="/booking/passengers/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Traveller details
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-brand-900 md:text-3xl">Payment</h1>

      {/* The honest banner. This flow takes no money and stores no card data. */}
      <div className="mt-4 flex items-start gap-3 rounded-md border border-gold-200 bg-gold-100 p-4">
        <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-600" aria-hidden="true" />
        <div className="text-sm text-gold-600">
          <p className="font-semibold">Demonstration checkout — no payment is taken.</p>
          <p className="mt-1 text-gold-600/90">
            No card number is ever requested or stored on this site. When the live gateway is
            switched on, payment happens on the bank&apos;s own hosted page.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <fieldset>
            <legend className="font-display text-sm font-semibold text-brand-900">
              How would you like to pay?
            </legend>

            <div className="mt-3 space-y-2">
              {methods.map(({ id, label, hint, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex min-h-[64px] cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors ${
                    method === id ? 'border-brand-500 bg-brand-50' : 'border-line hover:bg-surface-2'
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === id}
                    onChange={() => {
                      setMethod(id);
                      setError(null);
                    }}
                    className="h-4 w-4 accent-brand-700"
                  />
                  <Icon className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">{label}</span>
                    <span className="block truncate text-xs text-muted">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 rounded-md border border-line bg-surface p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={method}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {method === 'upi' && (
                  <div>
                    {!showQr ? (
                      <>
                        <TextField
                          label="UPI ID"
                          placeholder="yourname@bank"
                          autoComplete="off"
                          value={upi}
                          error={error ?? undefined}
                          hint="A collect request would be sent to this ID."
                          onChange={(e) => {
                            setUpi(e.target.value);
                            setError(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowQr(true)}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800"
                        >
                          <QrCode className="h-4 w-4" aria-hidden="true" />
                          Scan a QR code instead
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <DemoQr />
                        <p className="mt-3 text-sm text-muted">
                          Scan with any UPI app to pay{' '}
                          <strong className="tnum text-ink">{formatINR(fare.total)}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowQr(false)}
                          className="mt-3 text-sm font-medium text-brand-700 hover:text-brand-800"
                        >
                          Enter a UPI ID instead
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {method === 'netbanking' && (
                  <Picker label="Choose your bank" options={banks} value={bank} onChange={setBank} />
                )}

                {method === 'wallet' && (
                  <Picker label="Choose a wallet" options={wallets} value={wallet} onChange={setWallet} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <Lock className="h-3.5 w-3.5 text-seat-free" aria-hidden="true" />
            This page never asks for a card number, CVV or PIN.
          </p>
        </div>

        <aside className="rounded-md border border-line bg-surface-2 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-sm font-semibold text-brand-900">
            {trip.fromName} to {trip.toName}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {new Date(`${trip.date}T00:00:00`).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}{' '}
            · <span className="tnum">{trip.departs}</span>
          </p>

          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
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
            <li className="flex justify-between gap-4">
              <span className="text-muted">GST</span>
              <span className="tnum text-ink">{formatINR(fare.gst)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-line pt-2">
              <span className="font-semibold text-brand-900">Amount payable</span>
              <span className="font-display font-semibold tnum text-brand-700">
                {formatINR(fare.total)}
              </span>
            </li>
          </ul>
        </aside>
      </div>

      <StickyBar
        primaryLabel={busy ? 'Processing…' : `Pay ${formatINR(fare.total)}`}
        total={fare.total}
        hint="Demo checkout"
        busy={busy}
        onPrimary={pay}
      />

      <AnimatePresence>{busy && <ProcessingOverlay />}</AnimatePresence>
    </div>
  );
}

function Picker({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-muted">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-sm border p-3 text-sm transition-colors ${
              value === option ? 'border-brand-500 bg-brand-50 font-medium' : 'border-line hover:bg-surface-2'
            }`}
          >
            <input
              type="radio"
              name={label}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 accent-brand-700"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A decorative QR block. It encodes nothing and links nowhere. */
function DemoQr() {
  const cells = Array.from({ length: 144 }, (_, i) => {
    const x = i % 12;
    const y = Math.floor(i / 12);
    const finder = (x < 3 && y < 3) || (x > 8 && y < 3) || (x < 3 && y > 8);
    return finder || (x * 7 + y * 13 + x * y) % 3 === 0;
  });

  return (
    <div
      className="mx-auto grid aspect-square w-40 grid-cols-12 gap-px rounded-sm border border-line bg-white p-2"
      role="img"
      aria-label="Demonstration QR code — not a real payment code"
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? 'bg-brand-900' : 'bg-white'} />
      ))}
    </div>
  );
}

function ProcessingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-brand-900/70 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="mx-4 max-w-sm rounded-lg bg-surface p-8 text-center shadow-lift">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-700" aria-hidden="true" />
        <p className="mt-4 font-display text-lg font-semibold text-brand-900">Contacting your bank</p>
        <p className="mt-1.5 text-sm text-muted">
          Do not close this page. This usually takes a few seconds.
        </p>
      </div>
    </motion.div>
  );
}
