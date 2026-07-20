'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { calcFee, type PaymentMethod } from '@/lib/data'
import { getGameFormConfig } from '@/lib/game-form-config'
import type { DenominationView } from '@/lib/product-utils'
import { CheckoutService } from '@/services/checkout.service'
import type { CheckoutResult } from '@/types/checkout'
import { usePlayerIdValidation } from './use-player-id-validation'
import { useEmailValidation } from './use-email-validation'

interface UseCheckoutFormParams {
  gameId: number
  gameName: string
  gameSlug: string
}

export function useCheckoutForm({ gameId, gameName, gameSlug }: UseCheckoutFormParams) {
  const router = useRouter()
  const formConfig = getGameFormConfig(gameSlug)

  const [selectedDenom, setSelectedDenom] = useState<DenominationView | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [userId, setUserId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const playerId = usePlayerIdValidation()
  const emailValidation = useEmailValidation(email)

  function handleUserIdChange(value: string) {
    setUserId(value)
    playerId.reset()
  }

  const subPrice = useMemo(
    () => (selectedDenom ? selectedDenom.price * quantity : 0),
    [selectedDenom, quantity],
  )
  const fee = useMemo(
    () => (selectedDenom && selectedMethod ? calcFee(selectedMethod, selectedDenom.price) : 0),
    [selectedDenom, selectedMethod],
  )

  const waClean = whatsapp.replace(/\D/g, '')
  const waValid = /^08\d{8,12}$/.test(waClean)
  const idValid = userId.trim().length >= 3 && (!formConfig.needsZone || zoneId.trim().length >= 1)
  const idChecked = playerId.state === 'found'
  const canClick = selectedDenom !== null && idValid && idChecked && turnstileToken !== null
  const allValid =
    selectedDenom !== null &&
    idValid &&
    idChecked &&
    emailValidation.isValid &&
    waValid &&
    selectedMethod !== null &&
    turnstileToken !== null

  function getSubmitError(): string {
    if (!selectedDenom) return 'Pilih nominal terlebih dahulu.'
    if (!idValid)
      return `Isi ${formConfig.idLabel}${formConfig.needsZone ? ' dan Zone ID' : ''} dengan benar.`
    if (!idChecked) return 'Cek Akun terlebih dahulu.'
    if (!emailValidation.isValid) return 'Masukkan email yang valid.'
    if (!waValid) return 'Masukkan nomor WhatsApp yang valid.'
    if (!selectedMethod) return 'Pilih metode pembayaran.'
    if (!turnstileToken) return 'Selesaikan verifikasi keamanan di atas.'
    return ''
  }

  function handleSubmit() {
    setTouched(true)
    if (!canClick || submitting || !selectedDenom || !selectedMethod) return

    // Check for pending submission to prevent duplicate
    const pendingKey = sessionStorage.getItem('checkout:pending:key')
    if (pendingKey) {
      setCheckoutError('Pesanan masih diproses. Tunggu sebentar atau cek status pesanan.')
      return
    }

    setSubmitting(true)
    setCheckoutLoading(true)
    setCheckoutError(null)

    // Generate idempotency key
    const idempotencyKey = crypto.randomUUID()

    // Store pending key with timestamp
    sessionStorage.setItem('checkout:pending:key', idempotencyKey)
    sessionStorage.setItem(`checkout:pending:${idempotencyKey}`, Date.now().toString())

    // Build request
    const request = {
      userId: userId.trim(),
      zoneId: zoneId.trim(),
      gameId,
      productId: selectedDenom.id,
      sku: selectedDenom.sku,
      quantity,
      email: email.trim(),
      whatsapp: waClean,
      paymentMethod: selectedMethod.id,
    }

    CheckoutService.create(request, idempotencyKey)
      .then((response) => {
        if (response.success && response.data) {
          // Store result for /bayar page
          const result = response.data as CheckoutResult
          sessionStorage.setItem(`checkout:result:${result.orderId}`, JSON.stringify(result))

          // Track event
          posthog.capture('checkout_submitted', {
            game_name: gameName,
            game_slug: gameSlug,
            product_amount: selectedDenom.amount,
            product_price: selectedDenom.price,
            quantity,
            sub_price: subPrice,
            fee,
            total: subPrice + fee,
            payment_method_id: selectedMethod.id,
            payment_method_name: selectedMethod.name,
            invoice_id: result.invoice,
            order_id: result.orderId,
          })

          // Clear pending state
          sessionStorage.removeItem('checkout:pending:key')

          // Redirect to /bayar with order data
          const params = new URLSearchParams({
            orderId: result.orderId,
            invoice: result.invoice,
            game: gameName,
            product: `${selectedDenom.amount} × ${quantity}`,
            price: String(result.amount),
            fee: String(result.fee),
            method: selectedMethod.name,
            uid: formConfig.needsZone ? `${userId} (${zoneId})` : userId,
            payment: selectedMethod.id,
            paymentType: result.paymentType,
          })
          router.push(`/bayar?${params.toString()}`)
        } else {
          setCheckoutError(response.error ?? 'Terjadi kesalahan. Coba lagi.')
          setSubmitting(false)
          setCheckoutLoading(false)
          sessionStorage.removeItem('checkout:pending:key')
        }
      })
      .catch((error) => {
        console.error('Checkout error:', error)
        setCheckoutError('Gagal menghubungi server. Coba lagi.')
        setSubmitting(false)
        setCheckoutLoading(false)
        sessionStorage.removeItem('checkout:pending:key')
      })
  }

  return {
    formConfig,
    selectedDenom,
    setSelectedDenom,
    quantity,
    setQuantity,
    userId,
    handleUserIdChange,
    zoneId,
    setZoneId,
    whatsapp,
    setWhatsapp,
    email,
    setEmail,
    selectedMethod,
    setSelectedMethod,
    submitting,
    touched,
    turnstileToken,
    setTurnstileToken,
    playerId,
    emailValidation,
    subPrice,
    fee,
    waValid,
    idValid,
    canClick,
    allValid,
    getSubmitError,
    handleSubmit,
    checkoutLoading,
    checkoutError,
    setCheckoutError,
  }
}
