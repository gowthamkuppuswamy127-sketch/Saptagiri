import type { Metadata } from 'next';
import { Check, Phone } from 'lucide-react';
import { Reveal, RevealGroup, revealItem } from '@/components/motion/Reveal';
import { MotionItem } from '@/components/motion/MotionItem';
import { CoachIllustration } from '@/components/home/CoachIllustration';
import { QuoteForm } from '@/components/rentals/QuoteForm';
import { rentalFaqs, rentalVehicles, useCases } from '@/data/rentals';
import { operator } from '@/data/operator';
import { formatINR } from '@/lib/booking/fare';

export const metadata: Metadata = {
  title: 'Charter and vehicle hire',
  description:
    'Hire a coach, mini bus, tempo traveller or SUV with a driver from Bangalore — for weddings, temple trips, school tours and corporate travel across South India.',
};

export default function RentalsPage() {
  return (
    <>
      <section className="border-b border-line bg-brand-900 py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
              Charter hire
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-white md:text-5xl">
              Hire the whole vehicle, with a driver who knows the road
            </h1>
            <p className="mt-4 max-w-2xl text-brand-100">
              Weddings, temple runs, college tours, office offsites. Tell us where you are going and
              we will send a written quote the same day — no booking fee, nothing charged upfront.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 md:py-24" aria-labelledby="fleet-heading">
        <Reveal>
          <h2 id="fleet-heading" className="font-display text-3xl font-semibold text-brand-900">
            What we can send
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Rates below are indicative, per kilometre, calculated garage to garage. Tolls, parking
            and permits are charged at actuals.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rentalVehicles.map((vehicle) => (
            <MotionItem key={vehicle.id} variants={revealItem}>
              <article className="flex h-full flex-col rounded-md border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <CoachIllustration
                  className="h-auto w-full"
                  windows={vehicle.id.startsWith('tt') || vehicle.id === 'suv-7' ? 4 : 7}
                  sleeper={vehicle.id === 'sleeper-charter'}
                />

                <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
                  {vehicle.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{vehicle.seats}</p>
                <p className="mt-3 flex-1 text-sm text-muted">{vehicle.bestFor}</p>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                  <div>
                    <dt className="text-xs text-faint">Per km</dt>
                    <dd className="font-display font-semibold tnum text-brand-700">
                      {formatINR(vehicle.perKm)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-faint">Daily minimum</dt>
                    <dd className="font-medium tnum text-ink">{vehicle.minKm} km</dd>
                  </div>
                </dl>

                <ul className="mt-3 space-y-1.5">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seat-free" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            </MotionItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-surface-2 py-16 md:py-20" aria-labelledby="usecases-heading">
        <div className="container-page">
          <Reveal>
            <h2 id="usecases-heading" className="font-display text-3xl font-semibold text-brand-900">
              What people hire us for
            </h2>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <MotionItem key={useCase.title} variants={revealItem}>
                <div className="border-t-2 border-gold-500 pt-4">
                  <h3 className="font-display text-base font-semibold text-brand-900">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{useCase.body}</p>
                </div>
              </MotionItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-page py-16 md:py-24" aria-labelledby="quote-heading">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <Reveal>
              <h2 id="quote-heading" className="font-display text-3xl font-semibold text-brand-900">
                Ask for a quote
              </h2>
              <p className="mt-2 text-muted">
                Fill this in and the office will come back with a written price. Nothing is charged
                now.
              </p>
            </Reveal>

            <div className="mt-8">
              <QuoteForm />
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-md border border-line bg-surface p-5">
              <h3 className="font-display text-base font-semibold text-brand-900">
                Would rather just call?
              </h3>
              <p className="mt-2 text-sm text-muted">
                The office answers between 6am and 10pm, Monday to Saturday.
              </p>
              <a
                href={operator.headOffice.phoneHref}
                className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-brand-700 px-5 font-semibold text-white transition-colors hover:bg-brand-800"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="tnum">{operator.headOffice.phone}</span>
              </a>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold text-brand-900">
                Questions we get asked
              </h3>
              <dl className="mt-4 space-y-5">
                {rentalFaqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="text-sm font-semibold text-ink">{faq.q}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
