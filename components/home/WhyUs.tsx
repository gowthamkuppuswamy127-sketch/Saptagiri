import { BadgeIndianRupee, Headset, MapPinned, ShieldCheck, Ticket, Timer } from 'lucide-react';
import { Reveal, RevealGroup, revealItem } from '@/components/motion/Reveal';
import { MotionItem } from '@/components/motion/MotionItem';

const reasons = [
  {
    icon: Timer,
    title: 'We leave on time',
    body: 'Departures are held to the printed time, not to whether the coach has filled up.',
  },
  {
    icon: MapPinned,
    title: 'Boarding points you know',
    body: 'Kanakapura Road, Banashankari, Majestic, Silk Board and Electronic City on every service.',
  },
  {
    icon: ShieldCheck,
    title: 'Drivers who know the ghats',
    body: 'Shiradi and Charmadi in the monsoon are not routes for a stand-in driver.',
  },
  {
    icon: Ticket,
    title: 'Pick your own berth',
    body: 'Choose the exact seat before you pay — window, lower deck, whichever you want.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'One fare, shown upfront',
    body: 'The price on the seat is the price you pay. Taxes are itemised, nothing is added later.',
  },
  {
    icon: Headset,
    title: 'A person on the phone',
    body: 'The booking line is answered by our own office, not a queue in another state.',
  },
];

export function WhyUs() {
  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="why-heading">
      <Reveal className="max-w-2xl">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Why travel with us
        </p>
        <h2 id="why-heading" className="mt-2 font-display text-3xl font-semibold text-brand-900 md:text-4xl">
          The things that matter at 5am
        </h2>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ icon: Icon, title, body }) => (
          <MotionItem key={title} variants={revealItem}>
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-brand-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          </MotionItem>
        ))}
      </RevealGroup>
    </section>
  );
}
