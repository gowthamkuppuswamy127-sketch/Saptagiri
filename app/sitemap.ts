import type { MetadataRoute } from 'next';

// Required for `output: 'export'` — the file is generated once at build time.
export const dynamic = 'force-static';

const BASE = 'https://www.sapthagiritravels.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/rentals/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact/`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/my-bookings/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
