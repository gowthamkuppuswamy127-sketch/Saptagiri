import Link from 'next/link';
import { ArrowRight, Bus, Users } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { SearchWidget } from '@/components/home/SearchWidget';
import { TrustStrip } from '@/components/home/TrustStrip';
import { PopularRoutes } from '@/components/home/PopularRoutes';
import { FleetSection } from '@/components/home/FleetSection';
import { AboutStrip } from '@/components/home/AboutStrip';
import { WhyUs } from '@/components/home/WhyUs';
import { Reveal } from '@/components/motion/Reveal';
import { RidgeDivider } from '@/components/brand/Wordmark';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchWidget />
      <PopularRoutes />
      <TrustStrip />
      <FleetSection />
      <AboutStrip />
      <WhyUs />

      <section className="relative overflow-hidden bg-brand-700 py-16 md:py-20" aria-labelledby="charter-heading">
        <RidgeDivider className="absolute inset-x-0 top-0 text-brand-800/40" />

        <div className="container-page relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
              <Bus className="h-4 w-4" aria-hidden="true" />
              Charter hire
            </p>
            <h2 id="charter-heading" className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
              Taking the whole family, or the whole office?
            </h2>
            <p className="mt-3 max-w-xl text-brand-100">
              Hire a coach, minibus or tempo traveller with a driver — for weddings, temple trips,
              college tours and corporate travel anywhere in South India.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/rentals/"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-sm bg-gold-500 px-6 font-semibold text-brand-900 transition-all hover:bg-gold-400 active:scale-[0.98]"
            >
              <Users className="h-4.5 w-4.5" aria-hidden="true" />
              Get a quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
