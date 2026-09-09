'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Phone, X } from 'lucide-react';
import { Wordmark } from '@/components/brand/Wordmark';
import { operator } from '@/data/operator';

const links = [
  { href: '/', label: 'Home' },
  { href: '/rentals/', label: 'Rentals' },
  { href: '/my-bookings/', label: 'My Bookings' },
  { href: '/contact/', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on navigation, and stop the page scrolling behind it.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-surface/95 backdrop-blur-md' : 'bg-surface'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" aria-label={`${operator.name} home`} className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`relative rounded-sm px-3.5 py-2 text-[15px] font-medium transition-colors ${
                isActive(link.href) ? 'text-brand-700' : 'text-muted hover:text-brand-700'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={operator.headOffice.phoneHref}
            className="hidden items-center gap-2 rounded-sm border border-line px-3.5 py-2 text-sm font-medium text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-50 lg:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="tnum">{operator.headOffice.phone}</span>
          </a>

          <Link
            href="/#search"
            className="hidden rounded-sm bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 md:inline-block"
          >
            Book a seat
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-sm text-brand-900 md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-lift md:hidden"
          >
            <nav aria-label="Mobile" className="container-page flex flex-col py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`flex min-h-[52px] items-center rounded-sm px-2 text-base font-medium ${
                    isActive(link.href) ? 'text-brand-700' : 'text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 grid gap-2 border-t border-line pt-3">
                <Link
                  href="/#search"
                  className="flex min-h-[52px] items-center justify-center rounded-sm bg-brand-700 px-4 font-semibold text-white"
                >
                  Book a seat
                </Link>
                <a
                  href={operator.headOffice.phoneHref}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-line px-4 font-medium text-brand-800"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span className="tnum">{operator.headOffice.phone}</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
