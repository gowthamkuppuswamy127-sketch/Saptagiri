import { Check } from 'lucide-react';
import { Reveal, RevealGroup, revealItem } from '@/components/motion/Reveal';
import { MotionItem } from '@/components/motion/MotionItem';
import { CoachIllustration } from './CoachIllustration';
import { coaches } from '@/data/coaches';

export function FleetSection() {
  return (
    <section className="bg-surface-2 py-16 md:py-24" aria-labelledby="fleet-heading">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            The fleet
          </p>
          <h2 id="fleet-heading" className="mt-2 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
            Three coaches, picked for the run
          </h2>
          <p className="mt-3 text-muted">
            Long ghat routes get full berths. Short daytime hops get push-back seaters. You always
            see which coach you are booking before you pay.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
          {coaches.map((coach) => (
            <MotionItem key={coach.id} variants={revealItem}>
              <article className="flex h-full flex-col rounded-md border border-line bg-surface p-5 shadow-card">
                <CoachIllustration className="h-auto w-full" sleeper={coach.kind === 'sleeper'} />

                <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">{coach.name}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{coach.description}</p>

                <p className="mt-4 text-sm font-medium text-brand-700">
                  <span className="tnum">{coach.seats.length}</span>{' '}
                  {coach.kind === 'sleeper' ? 'berths' : 'seats'}
                </p>

                <ul className="mt-3 space-y-1.5 border-t border-line pt-4">
                  {coach.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seat-free" aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </article>
            </MotionItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
