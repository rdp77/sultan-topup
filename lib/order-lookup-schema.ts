import { z } from 'zod';

export const orderLookupSchema = z.object({
  invoice: z.string().min(1, 'Nomor invoice wajib diisi'),
  contact: z
    .string()
    .min(1, 'Email atau nomor WA wajib diisi')
    .refine(
      (v) => v.includes('@') || /^08\d{8,12}$/.test(v.replace(/\D/g, '')),
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
    const field = issue.path[0] as string;
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}