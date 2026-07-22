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
 * Fetches payment methods from API. The API returns data already grouped
 * (array of groups, each with a `payment_methods` array).
 * Maps `code` -> logo-friendly `id`, `fee_value` (string) -> `fee` (number),
 * and `fee_type` -> `feeType` to match the local `PaymentMethod` type.
 * Caches results in sessionStorage keyed by optional gameId.
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
        if (!response || response.length === 0) {
          setPaymentGroups([])
          return
        }

        const groups: PaymentGroup[] = response.map((g) => ({
          group: g.group_name,
          methods: g.payment_methods.map(mapMethod),
        }))

        setPaymentGroups(groups)

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(cacheKey, JSON.stringify(groups))
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
          // Invalid cache fall through to fetch
        }
      }
    }

    fetchMethods()
    fetchedRef.current = true
  }, [fetchMethods, cacheKey])

  return { paymentGroups, isLoading, error, retry: fetchMethods }
}

function mapMethod(m: {
  code: string
  name: string
  fee_type: 'flat' | 'percent'
  fee_value: string
}): PaymentMethod {
  return {
    id: m.code,
    name: m.name,
    fee: Math.round(Number.parseFloat(m.fee_value)),
    feeType: m.fee_type,
  }
}
