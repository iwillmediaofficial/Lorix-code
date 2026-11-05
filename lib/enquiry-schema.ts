import { z } from 'zod';

export const enquiryTypes = [
  { value: 'product', label: 'Product enquiry' },
  { value: 'partner', label: 'Become a channel partner' },
  { value: 'distribution', label: 'Distribution opportunity' },
  { value: 'support', label: 'Technical support' },
  { value: 'sodium_ion', label: 'Sodium-ion: register interest' },
  { value: 'other', label: 'Other business enquiry' },
] as const;

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+ ]/g, ''))
    .refine((v) => /^\+?[0-9 ]{10,16}$/.test(v), 'Please enter a valid phone number'),
  enquiryType: z.enum(['product', 'partner', 'distribution', 'support', 'sodium_ion', 'other']),
  cityState: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(5, 'Please tell us a little more').max(2000),
  consent: z.literal('on', { message: 'Please agree so we can contact you' }),
  sourcePage: z.string().max(200).optional().default('/'),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;
