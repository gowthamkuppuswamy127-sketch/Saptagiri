import Link from 'next/link';
import { ArrowRight, Clock, MoveRight } from 'lucide-react';
import { Reveal, RevealGroup, revealItem } from '@/components/motion/Reveal';
import { MotionItem } from '@/components/motion/MotionItem';
import { cityName, formatDuration, routes } from '@/data/routes';
import { coachById } from '@/data/coaches';
import { formatINR } from '@/lib/booking/fare';

export function PopularRoutes() {
  const featured = routes.filter((r) => r.popular);

  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="routes-heading">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Where we run
          </p>
          <h2 id="routes-heading" className="mt-2 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
            Overnight across Karnataka
          </h2>
        </div>
        <p className="max-w-sm text-muted">
          Eight routes out of Bangalore, most of them running after dark so you wake up where you
          need to be.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((route) => {
          const cheapest = route.departures.reduce((min, d) => Math.min(min, d.fare), Infinity);
          const coach = coachById(route.departures[0].coachId);

          return (
            <MotionItem key={route.id} variants={revealItem}>
              <Link
                href={`/booking/results/?from=${route.from}&to=${route.to}`}
                className="group flex h-full flex-col rounded-md border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex items-center gap-2 font-display text-lg font-semibold text-brand-900">
                  <span>{cityName(route.from)}</span>
                  <MoveRight
                    className="h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span>{cityName(route.to)}</span>
                </div>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{route.note}</p>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="tnum">{formatDuration(route.durationMins)}</span>
                  </span>
                  <span className="tnum">{route.distanceKm} km</span>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                  <div>
                    <p className="text-xs text-faint">From</p>
                    <p className="font-display text-xl font-semibold tnum text-brand-700">
                      {formatINR(cheapest)}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    {coach.kind === 'sleeper' ? 'Sleeper' : coach.kind === 'seater' ? 'Seater' : 'Semi-sleeper'}
                  </span>
                </div>
              </Link>
            </MotionItem>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-8">
        <Link
          href="/booking/results/?from=BLR&to=MYS"
          className="inline-flex items-center gap-2 font-medium text-brand-700 hover:text-brand-800"
        >
          See every route and timing
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
