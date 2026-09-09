'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Send } from 'lucide-react';
import { ErrorSummary, TextField, TextareaField } from '@/components/ui/Field';
import { contactMessageSchema, fieldErrors } from '@/lib/schemas';
import { operator } from '@/data/operator';

const empty = { name: '', phone: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof typeof empty, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactMessageSchema.safeParse(values);
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
        role="status"
        className="rounded-lg border border-seat-free/30 bg-seat-free/5 p-8 text-center"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-seat-free/10">
          <Check className="h-7 w-7 text-seat-free" aria-hidden="true" strokeWidth={2.5} />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-brand-900">Message noted</h3>
        <p className="mx-auto mt-2 max-w-md text-muted">
          This is a demonstration site, so the message was not actually sent. On the live site it
          reaches the office inbox.
        </p>
        <p className="mt-4 text-sm text-muted">
          For anything urgent, call{' '}
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
          Write another message
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
          onChange={(e) => set('name', e.target.value)}
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
          onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
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
        onChange={(e) => set('email', e.target.value)}
      />

      <TextField
        label="Subject"
        required
        placeholder="Ticket change, lost item, charter enquiry…"
        value={values.subject}
        error={errors.subject}
        onChange={(e) => set('subject', e.target.value)}
      />

      <TextareaField
        label="Message"
        required
        value={values.message}
        error={errors.message}
        onChange={(e) => set('message', e.target.value)}
      />

      <button
        type="submit"
        className="inline-flex min-h-[52px] items-center gap-2 rounded-sm bg-brand-700 px-6 font-semibold text-white transition-all hover:bg-brand-800 active:scale-[0.98]"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Send message
      </button>
    </form>
  );
}
