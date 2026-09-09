import type { MetadataRoute } from 'next';

// Required for `output: 'export'` — the file is generated once at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Booking steps are per-visitor and have nothing to index.
      disallow: ['/booking/'],
    },
    sitemap: 'https://www.sapthagiritravels.in/sitemap.xml',
  };
}
