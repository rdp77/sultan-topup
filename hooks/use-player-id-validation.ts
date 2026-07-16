'use client'

import { useState } from 'react'

type ValidateState = 'idle' | 'loading' | 'found' | 'not-found' | 'error'

export function usePlayerIdValidation() {
  const [state, setState] = useState<ValidateState>('idle')
  const [player, setPlayer] = useState<string | null>(null)

  function reset() {
    setState('idle')
    setPlayer(null)
  }

  // Dummy lookup — ganti dengan API cek akun sungguhan begitu tersedia
  function validate(userId: string) {
    const val = userId.trim()
    if (!val || state === 'loading') return
    setState('loading')
    setPlayer(null)
    setTimeout(() => {
      const n = val.length
      if (n < 3 || n % 3 === 2) {
        setState('error')
        setPlayer(null)
      } else if (n % 3 === 0) {
        setState('found')
        setPlayer(`Player${val.slice(0, 3)}*** (Level ${27 + (n % 30)})`)
      } else {
        setState('not-found')
      }
    }, 800)
  }

  return { state, player, validate, reset }
}
