'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calcFee, type PaymentMethod } from '@/lib/data'
import { getGameFormConfig } from '@/lib/game-form-config'
import type { DenominationView } from '@/lib/product-utils'
import { usePlayerIdValidation } from './use-player-id-validation'
import { useEmailValidation } from './use-email-validation'

interface UseCheckoutFormParams {
  gameName: string
  gameSlug: string
}

export function useCheckoutForm({ gameName, gameSlug }: UseCheckoutFormParams) {
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
    setSubmitting(true)
    const params = new URLSearchParams({
      game: gameName,
      product: `${selectedDenom.amount} × ${quantity}`,
      price: String(subPrice),
      fee: String(fee),
      method: selectedMethod.name,
      uid: formConfig.needsZone ? `${userId} (${zoneId})` : userId,
      payment: selectedMethod.id,
      invoice: `INV-${Date.now().toString(36).toUpperCase()}`,
    })
    setTimeout(() => router.push(`/bayar?${params.toString()}`), 600)
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
  }
}
