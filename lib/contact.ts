/**
 * Centralized Contact Support Configuration
 *
 * All contact support values are sourced from environment variables.
 * To change contact info, only update the .env file — all pages (contact,
 * legal, FAQ, etc.) will automatically reflect the new values.
 */

export const contactConfig = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'support@sultantopup.com',
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '+62 851-1135-5504',
  whatsappLink:
    process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_LINK ?? 'https://wa.me/message/MOTSNSGBUVNTJ1',
} as const

/**
 * Replace contact placeholder variables in a template string.
 * Supported placeholders:
 * - {{CONTACT_EMAIL}}
 * - {{CONTACT_WHATSAPP}}
 * - {{CONTACT_WHATSAPP_LINK}}
 */
export function applyContactTemplate(content: string): string {
  return content
    .replaceAll('{{CONTACT_EMAIL}}', contactConfig.email)
    .replaceAll('{{CONTACT_WHATSAPP_LINK}}', contactConfig.whatsappLink)
    .replaceAll('{{CONTACT_WHATSAPP}}', contactConfig.whatsapp)
}
