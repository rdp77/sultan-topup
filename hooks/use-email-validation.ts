'use client'

import { useEffect, useMemo, useState } from 'react'
import isEmail from 'validator/lib/isEmail'

export function useEmailValidation(email: string) {
  const [checking, setChecking] = useState(false)
  const [serverValid, setServerValid] = useState<boolean | null>(null)

  const formatOk = useMemo(() => isEmail(email.trim()), [email])

  useEffect(() => {
    if (!formatOk) {
      setServerValid(null)
      return
    }
    setChecking(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/validate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })
        const data = await res.json()
        setServerValid(data.valid === true)
      } catch {
        setServerValid(null)
      } finally {
        setChecking(false)
      }
    }, 600)
    return () => clearTimeout(t)
  }, [email, formatOk])

  return { formatOk, checking, serverValid, isValid: formatOk && serverValid === true }
}
