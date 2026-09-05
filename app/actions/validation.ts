'use server';

import dns from 'node:dns/promises';

export interface ValidateEmailResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate an email by checking MX records for its domain.
 * Replaces the old POST /api/validate-email Route Handler.
 */
export async function validateEmailAction(email: string): Promise<ValidateEmailResult> {
  const trimmed = email.trim();
  const atIdx = trimmed.lastIndexOf('@');
  if (!trimmed || atIdx === -1 || atIdx === trimmed.length - 1) {
    return { valid: false, reason: 'Missing domain' };
  }

  const domain = trimmed.slice(atIdx + 1);

  // Check MX records — if domain has no mail server, it can't receive email
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { valid: false, reason: `No mail server found for ${domain}` };
    }
    return { valid: true };
  } catch (dnsErr: unknown) {
    let msg = 'Unknown DNS error';
    if (dnsErr instanceof Error) {
      msg = dnsErr.message;
    } else if (typeof dnsErr === 'string') {
      msg = dnsErr;
    }
    // ENOTFOUND = domain doesn't exist at all
    // ENODATA = domain exists but no MX records
    return {
      valid: false,
      reason: msg.includes('ENOTFOUND')
        ? `Domain ${domain} not found`
        : `No mail server for ${domain}`,
    };
  }
}