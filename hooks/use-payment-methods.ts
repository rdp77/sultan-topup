'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PaymentMethodService } from '@/services/payment-method.service'
import { type PaymentMethod, type PaymentGroup } from '@/lib/data'

interface UsePaymentMethodsResult {
  paymentGroups: PaymentGroup[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

/**
 * Fetches active payment methods from API and groups them by `group` field.
 * Caches results in sessionStorage keyed by optional gameId to avoid
 * re-fetching on every mount during the same session.
 */
export function usePaymentMethods(gameId?: number): UsePaymentMethodsResult {
  const [paymentGroups, setPaymentGroups] = useState<PaymentGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cacheKey = `payment-methods:${gameId ?? 'all'}`
  const fetchedRef = useRef(false)

  const fetchMethods = useCallback(() => {
    setIsLoading(true)
    setError(null)

    PaymentMethodService.list(gameId)
      .then((response) => {
        const active = response.data?.filter((m) => m.is_active) ?? []

        if (active.length === 0) {
          setPaymentGroups([])
          return
        }

        // Map API `fee_type` → local `feeType` and group by `group` field
        const methods: PaymentMethod[] = active.map((m) => ({
          id: m.id,
          name: m.name,
          fee: m.fee,
          feeType: m.fee_type,
        }))

        const grouped = groupMethods(methods, active)
        setPaymentGroups(grouped)

        // Cache in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(cacheKey, JSON.stringify(grouped))
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat metode pembayaran')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [gameId, cacheKey])

  useEffect(() => {
    if (fetchedRef.current) return

    // Try sessionStorage cache first (client-side)
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as PaymentGroup[]
          setPaymentGroups(parsed)
          setIsLoading(false)
          fetchedRef.current = true
          return
        } catch {
          // Invalid cache – fall through to fetch
        }
      }
    }

    fetchMethods()
    fetchedRef.current = true
  }, [fetchMethods, cacheKey])

  return { paymentGroups, isLoading, error, retry: fetchMethods }
}

function groupMethods(methods: PaymentMethod[], raw: Array<{ group: string }>): PaymentGroup[] {
  const map = new Map<string, PaymentMethod[]>()

  for (let i = 0; i < methods.length; i++) {
    const group = raw[i].group
    const existing = map.get(group)
    if (existing) {
      existing.push(methods[i])
    } else {
      map.set(group, [methods[i]])
    }
  }

  return Array.from(map, ([group, methods]) => ({ group, methods }))
}
