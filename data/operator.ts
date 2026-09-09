/**
 * Company details. Everything the site says about Sapthagiri Travels comes
 * from here — change it once and it changes everywhere.
 */

export const operator = {
  name: 'Sapthagiri Travels',
  shortName: 'Sapthagiri',
  tagline: 'Seven hills. One road home.',
  foundedYear: 2008,

  headOffice: {
    label: 'Head Office',
    lines: [
      'Ground Floor, No. 69/1',
      'Kanakapura Road, Gangadhar Nagar',
      'Bengaluru Urban, Bangalore',
      'Karnataka 560078',
    ],
    phone: '9880764058',
    phoneHref: 'tel:+919880764058',
    email: 'sapthagiri74@gmail.com',
    mapsQuery: 'Sapthagiri Travels, Kanakapura Road, Gangadhar Nagar, Bengaluru 560078',
  },

  support: {
    label: 'Online Booking Support',
    note: 'e-Ticketing and e-Payment related issues',
    phone: '080-46333629',
    phoneHref: 'tel:+918046333629',
    email: 'support@mybusbookings.com',
  },

  hours: [
    { days: 'Monday – Saturday', time: '6:00 AM – 10:00 PM' },
    { days: 'Sunday', time: '7:00 AM – 9:00 PM' },
  ],

  /** Shown on the trust strip. Edit to match reality before going live. */
  stats: [
    { value: 17, suffix: '+', label: 'Years on the road' },
    { value: 42, suffix: '', label: 'Coaches in service' },
    { value: 8, suffix: '', label: 'Karnataka routes' },
    { value: 96, suffix: '%', label: 'On-time arrivals' },
  ],
} as const;

export type Operator = typeof operator;
