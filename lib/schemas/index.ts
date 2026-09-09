import { z } from 'zod';

/** Indian mobile numbers: ten digits starting 6–9. */
const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
/** Letters, spaces, apostrophes and hyphens — no digits, no angle brackets. */
const NAME = /^[\p{L}][\p{L}\s'.-]{1,49}$/u;

export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE, 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9');

export const emailSchema = z
  .string()
  .trim()
  .max(120, 'That email address is too long')
  .regex(EMAIL, 'Enter a valid email address, like name@example.com');

export const nameSchema = z
  .string()
  .trim()
  .regex(NAME, 'Use letters only, between 2 and 50 characters');

export const passengerSchema = z.object({
  name: nameSchema,
  age: z
    .number({ message: 'Enter an age' })
    .int('Enter a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Enter a valid age'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender' }),
});

export const contactSchema = z.object({
  phone: phoneSchema,
  email: emailSchema,
});

export const searchSchema = z.object({
  from: z.string().min(2, 'Choose where you are leaving from'),
  to: z.string().min(2, 'Choose where you are going'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a travel date'),
});

export const upiSchema = z
  .string()
  .trim()
  .regex(/^[\w.\-]{2,64}@[a-zA-Z]{2,32}$/, 'Enter a UPI ID, like yourname@bank');

export const contactMessageSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  subject: z.string().trim().min(3, 'Add a short subject').max(120, 'Keep the subject under 120 characters'),
  message: z.string().trim().min(10, 'Tell us a little more').max(1500, 'Keep it under 1500 characters'),
});

export const quoteSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  vehicleId: z.string().min(1, 'Choose a vehicle'),
  tripType: z.enum(['one-way', 'round-trip', 'multi-day'], { message: 'Choose a trip type' }),
  fromCity: z.string().trim().min(2, 'Where does the trip start?'),
  toCity: z.string().trim().min(2, 'Where is it going?'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a start date'),
  days: z.number().int().min(1, 'At least one day').max(60, 'Call us for trips over 60 days'),
  passengers: z.number().int().min(1, 'At least one passenger').max(60, 'Call us for groups over 60'),
  notes: z.string().trim().max(1000, 'Keep notes under 1000 characters').optional(),
});

export type PassengerInput = z.infer<typeof passengerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

/** Flattens a ZodError into { field: message } for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
