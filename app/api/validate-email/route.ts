import { NextResponse } from 'next/server'
import dns from 'node:dns/promises'

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ valid: false, reason: 'Email is required' }, { status: 400 })
    }

    const trimmed = email.trim()
    const atIdx = trimmed.lastIndexOf('@')
    if (atIdx === -1 || atIdx === trimmed.length - 1) {
      return NextResponse.json({ valid: false, reason: 'Missing domain' })
    }

    const domain = trimmed.slice(atIdx + 1)

    // Check MX records — if domain has no mail server, it can't receive email
    try {
      const records = await dns.resolveMx(domain)
      if (!records || records.length === 0) {
        return NextResponse.json({ valid: false, reason: `No mail server found for ${domain}` })
      }
      return NextResponse.json({ valid: true })
    } catch (dnsErr: unknown) {
      const msg = dnsErr instanceof Error ? dnsErr.message : String(dnsErr)
      // ENOTFOUND = domain doesn't exist at all
      // ENODATA = domain exists but no MX records
      return NextResponse.json({
        valid: false,
        reason: msg.includes('ENOTFOUND') ? `Domain ${domain} not found` : `No mail server for ${domain}`,
      })
    }
  } catch {
    return NextResponse.json({ valid: false, reason: 'Server error' }, { status: 500 })
  }
}
