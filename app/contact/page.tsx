import type { Metadata } from 'next';
import { Clock, ExternalLink, Headset, Mail, MapPin, Phone } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';
import { operator } from '@/data/operator';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Sapthagiri Travels head office on Kanakapura Road, Bangalore. Phone, email and booking support for tickets, charter hire and e-ticketing issues.',
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  operator.headOffice.mapsQuery,
)}`;

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-brand-900 py-14 md:py-20">
        <div className="container-page">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">Contact us</h1>
            <p className="mt-3 max-w-xl text-brand-100">
              One office, on Kanakapura Road. Call it and a person picks up.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-900">Send us a message</h2>
            <p className="mt-2 text-muted">
              For anything that is not urgent. If your bus leaves today, please call instead.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-5">
            <Reveal>
              <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold text-brand-900">
                  {operator.headOffice.label}
                </h2>

                <address className="mt-4 space-y-4 text-sm not-italic">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                    <p className="text-muted">
                      {operator.headOffice.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                    <a
                      href={operator.headOffice.phoneHref}
                      className="font-medium tnum text-brand-700 hover:text-brand-800"
                    >
                      {operator.headOffice.phone}
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                    <a
                      href={`mailto:${operator.headOffice.email}`}
                      className="break-all font-medium text-brand-700 hover:text-brand-800"
                    >
                      {operator.headOffice.email}
                    </a>
                  </div>
                </address>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm border border-line bg-surface-2 px-4 font-medium text-brand-800 transition-colors hover:bg-brand-50"
                >
                  Get directions
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-brand-900">
                  <Headset className="h-4.5 w-4.5 text-gold-600" aria-hidden="true" />
                  {operator.support.label}
                </h2>
                <p className="mt-1.5 text-sm text-muted">{operator.support.note}</p>

                <div className="mt-4 space-y-3 text-sm">
                  <a
                    href={operator.support.phoneHref}
                    className="flex items-center gap-3 font-medium tnum text-brand-700 hover:text-brand-800"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                    {operator.support.phone}
                  </a>
                  <a
                    href={`mailto:${operator.support.email}`}
                    className="flex items-center gap-3 break-all font-medium text-brand-700 hover:text-brand-800"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                    {operator.support.email}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-brand-900">
                  <Clock className="h-4.5 w-4.5 text-gold-600" aria-hidden="true" />
                  Office hours
                </h2>
                <dl className="mt-4 space-y-2 text-sm">
                  {operator.hours.map((slot) => (
                    <div key={slot.days} className="flex justify-between gap-4">
                      <dt className="text-muted">{slot.days}</dt>
                      <dd className="font-medium tnum text-ink">{slot.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
