'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const steps = [
  { key: 'results', label: 'Bus' },
  { key: 'seats', label: 'Seats' },
  { key: 'passengers', label: 'Travellers' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Ticket' },
];

/**
 * The journey, drawn as the road climbing through the hills — one peak per
 * step, filling in as the booking advances.
 */
export function BookingStepper() {
  const pathname = usePathname();
  const current = Math.max(
    0,
    steps.findIndex((s) => pathname.includes(`/booking/${s.key}`)),
  );

  return (
    <nav aria-label="Booking progress" className="border-b border-line bg-surface">
      <ol className="container-page flex items-center gap-1 py-3 md:gap-2 md:py-4">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;

          return (
            <li key={step.key} className="flex flex-1 items-center gap-1 md:gap-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors ${
                    done
                      ? 'bg-seat-free text-white'
                      : active
                        ? 'bg-brand-700 text-white'
                        : 'bg-surface-2 text-faint'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <span className="tnum">{i + 1}</span>}
                </span>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    active ? 'text-brand-900' : done ? 'text-muted' : 'text-faint'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-gold-500"
                    initial={false}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <span className="sr-only" aria-live="polite">
        Step {current + 1} of {steps.length}: {steps[current]?.label}
      </span>
    </nav>
  );
}
