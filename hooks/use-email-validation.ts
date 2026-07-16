'use client'

import { useEffect, useMemo, useState } from 'react'
import isEmail from 'validator/lib/isEmail'

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}

interface EmailCheckResult {
  email: string
  valid: boolean | null
}

export function useEmailValidation(email: string) {
  const [result, setResult] = useState<EmailCheckResult | null>(null)
  const [fetchingRaw, setFetchingRaw] = useState(false)

  const trimmed = email.trim()
  const formatOk = useMemo(() => isEmail(trimmed), [trimmed])
  const debouncedEmail = useDebouncedValue(trimmed, 600)

  const isPending = formatOk && trimmed !== debouncedEmail

  useEffect(() => {
    if (!formatOk || trimmed !== debouncedEmail) return

    let cancelled = false

    ;(async () => {
      setFetchingRaw(true)
      try {
        const res = await fetch('/api/validate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: debouncedEmail }),
        })
        const data = await res.json()
        if (!cancelled) setResult({ email: debouncedEmail, valid: data.valid === true })
      } catch {
        if (!cancelled) setResult({ email: debouncedEmail, valid: null })
      } finally {
        if (!cancelled) setFetchingRaw(false)
      }
    })()

    return () => {
      cancelled = true
      setFetchingRaw(false)
    }
  }, [formatOk, trimmed, debouncedEmail])

  const serverValid = formatOk && result?.email === trimmed ? result.valid : null

  return {
    formatOk,
    checking: formatOk && (isPending || fetchingRaw),
    serverValid,
    isValid: formatOk && serverValid === true,
  }
}
