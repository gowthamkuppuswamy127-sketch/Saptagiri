import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SaptagiriMark } from '@/components/brand/Wordmark';
import { operator } from '@/data/operator';
import { cities, routes } from '@/data/routes';

export function Footer() {
  const popular = routes.filter((r) => r.popular).slice(0, 5);
  const name = (code: string) => cities.find((c) => c.code === code)?.name ?? code;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <SaptagiriMark className="h-9 w-9" />
            <span className="font-display text-lg font-semibold text-brand-900">{operator.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted">
            Overnight sleeper and day coaches across Karnataka, running out of Bangalore since{' '}
            <span className="tnum">{operator.foundedYear}</span>.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-900">
            Popular routes
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {popular.map((route) => (
              <li key={route.id}>
                <Link
                  href={`/booking/results/?from=${route.from}&to=${route.to}`}
                  className="text-muted transition-colors hover:text-brand-700"
                >
                  {name(route.from)} to {name(route.to)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-900">
            Company
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/rentals/" className="text-muted transition-colors hover:text-brand-700">
                Charter &amp; vehicle hire
              </Link>
            </li>
            <li>
              <Link href="/my-bookings/" className="text-muted transition-colors hover:text-brand-700">
                My bookings
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="text-muted transition-colors hover:text-brand-700">
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-900">
            {operator.headOffice.label}
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-muted">
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
              <span>{operator.headOffice.lines.join(', ')}</span>
            </p>
            <p className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
              <a href={operator.headOffice.phoneHref} className="tnum hover:text-brand-700">
                {operator.headOffice.phone}
              </a>
            </p>
            <p className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
              <a href={`mailto:${operator.headOffice.email}`} className="break-all hover:text-brand-700">
                {operator.headOffice.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span className="tnum">{year}</span> {operator.name}. All rights reserved.
          </p>
          <p>
            Booking support{' '}
            <a href={operator.support.phoneHref} className="tnum hover:text-brand-700">
              {operator.support.phone}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
