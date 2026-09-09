import type { Metadata, Viewport } from 'next';
import { Lexend, Source_Sans_3 } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { operator } from '@/data/operator';
import './globals.css';

// Self-hosted at build time, so the browser never calls Google at runtime and
// the content security policy needs no font exceptions.
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sapthagiritravels.in'),
  title: {
    default: `${operator.name} — Bus tickets and charter hire across Karnataka`,
    template: `%s · ${operator.name}`,
  },
  description:
    'Book AC sleeper and semi-sleeper bus tickets from Bangalore to Mysore, Mangalore, Udupi, Hubli, Shivamogga, Chikmagalur, Madikeri and Hampi. Charter buses and tempo travellers on hire.',
  keywords: [
    'Sapthagiri Travels',
    'Bangalore bus booking',
    'Karnataka bus tickets',
    'AC sleeper bus',
    'bus hire Bangalore',
    'tempo traveller rental',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: operator.name,
    title: `${operator.name} — Bus tickets across Karnataka`,
    description: 'AC sleeper and semi-sleeper coaches from Bangalore. Book seats online in under a minute.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
  // Never disable zoom — some visitors depend on it.
  maximumScale: 5,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: operator.name,
  description: 'Bus ticket booking and charter vehicle hire across Karnataka.',
  telephone: operator.headOffice.phone,
  email: operator.headOffice.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ground Floor, No. 69/1, Kanakapura Road, Gangadhar Nagar',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    postalCode: '560078',
    addressCountry: 'IN',
  },
  areaServed: 'Karnataka, India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${lexend.variable} ${sourceSans.variable}`}>
      <body className="min-h-dvh bg-surface antialiased">
        <script
          type="application/ld+json"
          // The only serialised HTML in the app, built from a typed object.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
