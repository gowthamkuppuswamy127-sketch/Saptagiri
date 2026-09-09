import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { operator } from '@/data/operator';

export function AboutStrip() {
  return (
    <section className="bg-brand-900 py-16 md:py-24" aria-labelledby="about-heading">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          {/* Aspect ratio is reserved before the image loads, so nothing shifts. */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src="/media/coach.webp"
              alt="A Sapthagiri coach on a misty ghat road, hills rising behind it"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
            Since <span className="tnum">{operator.foundedYear}</span>
          </p>
          <h2 id="about-heading" className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
            Seven hills, and the roads between them
          </h2>
          <div className="mt-5 space-y-4 text-brand-100">
            <p>
              Sapthagiri runs out of one office on Kanakapura Road. The same coaches, the same
              drivers, the same routes — week after week, through the monsoon and out the other side.
            </p>
            <p>
              We are not the biggest operator in Karnataka. We would rather be the one you book
              again without checking the alternatives.
            </p>
          </div>

          <Link
            href="/contact/"
            className="mt-7 inline-flex items-center gap-2 font-medium text-gold-400 transition-colors hover:text-gold-200"
          >
            Visit the office
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
