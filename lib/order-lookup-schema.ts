import { z } from 'zod';

/** Shared WA phone format — 08xxxxxxxx (8–12 digits after the 08 prefix). */
export const waPhoneSchema = z
  .string()
  .regex(/^08\d{8,12}$/, 'Nomor WA tidak valid (contoh: 0812xxxx)');

export const emailSchema = z.email('Format email tidak valid');

const checkoutRequestSchema = z.object({
  playerId: z.string().min(1).max(64),
  zoneId: z.string().max(32),
  gameId: z.number().int().positive(),
  productId: z.number().int().positive(),
  sku: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(100),
  email: emailSchema,
  whatsapp: waPhoneSchema,
  paymentMethod: z.string().min(1).max(64),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;

/** Validate an untrusted checkout request at the Server Action boundary. */
export function safeParseCheckoutRequest(
  input: unknown
): { success: true; data: CheckoutRequestInput } | { success: false; error: string } {
  const result = z.safeParse(checkoutRequestSchema, input);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: 'Data checkout tidak valid. Periksa kembali isian form.' };
}

export const orderLookupSchema = z.object({
  invoice: z.string().min(1, 'Nomor invoice wajib diisi'),
  contact: z
    .string()
    .min(1, 'Email atau nomor WA wajib diisi')
    .refine(
      (v) =>
        emailSchema.safeParse(v).success ||
        waPhoneSchema.safeParse(v.replace(/\D/g, '')).success,
      'Masukkan email atau nomor WA yang valid'
    ),
});

export type OrderLookupInput = z.infer<typeof orderLookupSchema>;

/** Returns per-field error messages for a lookup query, or null if valid. */
export function validateOrderLookup(input: {
  invoice?: string;
  contact?: string;
}): Record<string, string> | null {
  const parse = z.safeParse(orderLookupSchema, {
    invoice: (input.invoice ?? '').trim(),
    contact: (input.contact ?? '').trim(),
  });
  if (parse.success) return null;

  const errors: Record<string, string> = {};
  for (const issue of parse.error.issues) {
    const field = String(issue.path[0] ?? '');
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}