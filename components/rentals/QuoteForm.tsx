'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Send } from 'lucide-react';
import { ErrorSummary, SelectField, TextField, TextareaField } from '@/components/ui/Field';
import { fieldErrors, quoteSchema } from '@/lib/schemas';
import { rentalVehicles } from '@/data/rentals';
import { operator } from '@/data/operator';

const empty = {
  name: '',
  phone: '',
  email: '',
  vehicleId: '',
  tripType: '',
  fromCity: 'Bangalore',
  toCity: '',
  startDate: '',
  days: '1',
  passengers: '',
  notes: '',
};

export function QuoteForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof typeof empty) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = quoteSchema.safeParse({
      ...values,
      days: Number(values.days),
      passengers: Number(values.passengers),
      notes: values.notes || undefined,
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-seat-free/30 bg-seat-free/5 p-8 text-center"
        role="status"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-seat-free/10">
          <Check className="h-7 w-7 text-seat-free" aria-hidden="true" strokeWidth={2.5} />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-brand-900">
          Enquiry noted, {values.name.split(' ')[0]}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-muted">
          This is a demonstration site, so nothing was actually sent. On the live site this reaches
          the office and you get a written quote the same day.
        </p>
        <p className="mt-4 text-sm text-muted">
          To book now, call{' '}
          <a href={operator.headOffice.phoneHref} className="font-semibold tnum text-brand-700">
            {operator.headOffice.phone}
          </a>
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setSent(false);
          }}
          className="mt-6 min-h-[48px] rounded-sm border border-line bg-surface px-5 font-medium text-brand-800"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div ref={summaryRef} tabIndex={-1}>
        <ErrorSummary errors={errors} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Your name"
          required
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(e) => set('name')(e.target.value)}
        />
        <TextField
          label="Mobile number"
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          value={values.phone}
          error={errors.phone}
          onChange={(e) => set('phone')(e.target.value.replace(/\D/g, '').slice(0, 10))}
        />
      </div>

      <TextField
        label="Email"
        required
        type="email"
        inputMode="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(e) => set('email')(e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Vehicle"
          required
          value={values.vehicleId}
          error={errors.vehicleId}
          onChange={(e) => set('vehicleId')(e.target.value)}
        >
          <option value="">Choose a vehicle</option>
          {rentalVehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Trip type"
          required
          value={values.tripType}
          error={errors.tripType}
          onChange={(e) => set('tripType')(e.target.value)}
        >
          <option value="">Choose</option>
          <option value="one-way">One way</option>
          <option value="round-trip">Round trip</option>
          <option value="multi-day">Multi-day tour</option>
        </SelectField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Starting from"
          required
          value={values.fromCity}
          error={errors.fromCity}
          onChange={(e) => set('fromCity')(e.target.value)}
        />
        <TextField
          label="Going to"
          required
          placeholder="Tirupati, Coorg, Goa…"
          value={values.toCity}
          error={errors.toCity}
          onChange={(e) => set('toCity')(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Start date"
          required
          type="date"
          value={values.startDate}
          error={errors.startDate}
          onChange={(e) => set('startDate')(e.target.value)}
        />
        <TextField
          label="Number of days"
          required
          inputMode="numeric"
          value={values.days}
          error={errors.days}
          onChange={(e) => set('days')(e.target.value.replace(/\D/g, '').slice(0, 2))}
        />
        <TextField
          label="Passengers"
          required
          inputMode="numeric"
          value={values.passengers}
          error={errors.passengers}
          onChange={(e) => set('passengers')(e.target.value.replace(/\D/g, '').slice(0, 2))}
        />
      </div>

      <TextareaField
        label="Anything else we should know?"
        hint="Pickup points, halts, luggage, timings."
        value={values.notes}
        error={errors.notes}
        onChange={(e) => set('notes')(e.target.value)}
      />

      <button
        type="submit"
        className="inline-flex min-h-[52px] items-center gap-2 rounded-sm bg-gold-500 px-6 font-semibold text-brand-900 transition-all hover:bg-gold-400 active:scale-[0.98]"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Request a quote
      </button>
    </form>
  );
}
