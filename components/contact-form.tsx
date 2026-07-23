'use client'

import { useState, useCallback } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2, AlertTriangle, Check } from 'lucide-react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useEmailValidation } from '@/hooks/use-email-validation'

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? ''
const HCAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? '50b2fe65-b00b-4b9e-ad62-3ba471098be2'

const waRegex = /^08\d{8,12}$/

const subjectOptions = [
  { value: '', label: 'Pilih subjek pesan' },
  { value: 'Pertanyaan Umum', label: 'Pertanyaan Umum' },
  { value: 'Bantuan Transaksi', label: 'Bantuan Transaksi' },
  { value: 'Kerjasama', label: 'Kerjasama' },
  { value: 'Lainnya', label: 'Lainnya' },
]

type AlertStatus = 'idle' | 'pending' | 'success' | 'error'

function getAlertClasses(status: AlertStatus): string {
  if (status === 'success') {
    return 'border-success/30 bg-success/5 text-success'
  }
  if (status === 'error') {
    return 'border-destructive/30 bg-destructive/5 text-destructive'
  }
  return 'border-border bg-card text-muted-foreground'
}

function StatusAlert({ status, message }: Readonly<{ status: AlertStatus; message: string }>) {
  const alertClasses = getAlertClasses(status)

  let icon: React.ReactNode = null
  if (status === 'success') {
    icon = <CheckCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
  } else if (status === 'error') {
    icon = <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
  }

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-sm ${alertClasses}`}
    >
      {icon}
      <span>{message}</span>
    </div>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<AlertStatus>('idle')
  const [alertMessage, setAlertMessage] = useState('')
  const [touched, setTouched] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [hcaptchaToken, setHcaptchaToken] = useState('')

  const emailValidation = useEmailValidation(email)

  const waClean = whatsapp.replace(/\D/g, '')
  const waValid = waClean === '' || waRegex.test(waClean)

  const nameError = touched && name.trim().length < 2 ? 'Nama minimal 2 karakter' : null
  const subjectError = touched && !subject ? 'Pilih subjek pesan' : null
  const bodyError = touched && body.trim().length < 10 ? 'Pesan minimal 10 karakter' : null

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      e.preventDefault()
      setTouched(true)

      if (name.trim().length < 2) {
        setStatus('error')
        setAlertMessage('Nama minimal 2 karakter.')
        return
      }
      if (!emailValidation.isValid) {
        setStatus('error')
        setAlertMessage('Masukkan email yang valid.')
        return
      }
      if (waClean && !waRegex.test(waClean)) {
        setStatus('error')
        setAlertMessage('Masukkan nomor WhatsApp yang valid (08xx).')
        return
      }
      if (!subject) {
        setStatus('error')
        setAlertMessage('Pilih subjek pesan.')
        return
      }
      if (body.trim().length < 10) {
        setStatus('error')
        setAlertMessage('Pesan minimal 10 karakter.')
        return
      }
      if (!hcaptchaToken) {
        setStatus('error')
        setAlertMessage('Selesaikan verifikasi keamanan.')
        return
      }

      setStatus('pending')
      setAlertMessage('Mengirim pesan...')

      const formData = new FormData(e.currentTarget)

      // Guard: access_key must be set in env during build
      if (!WEB3FORMS_ACCESS_KEY) {
        setStatus('error')
        setAlertMessage('Konfigurasi form belum lengkap. Hubungi admin.')
        return
      }

      formData.append('access_key', WEB3FORMS_ACCESS_KEY)
      formData.append('from_name', 'Sultan Top Up Website')
      formData.append('h-captcha-response', hcaptchaToken)

      // Build subject manually to avoid duplicate/array issue
      formData.delete('category')
      formData.set('subject', `[Kontak] ${subject}`)

      if (waClean) {
        formData.set('phone', waClean)
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setAlertMessage(
            data.message || 'Pesan berhasil dikirim! Tim kami akan membalas dalam 1x24 jam.',
          )
          setName('')
          setEmail('')
          setWhatsapp('')
          setSubject('')
          setBody('')
          setHcaptchaToken('')
          setTouched(false)
        } else {
          setStatus('error')
          setAlertMessage(data.message || 'Gagal mengirim pesan. Silakan coba lagi.')
        }
      } catch {
        setStatus('error')
        setAlertMessage('Terjadi kesalahan jaringan. Silakan coba lagi nanti.')
      }
    },
    [name, emailValidation.isValid, waClean, subject, body, hcaptchaToken],
  )

  const labelClasses = 'text-sm text-muted-foreground'
  const inputClasses =
    'mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30'
  const isPending = status === 'pending'

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          Nama <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          className={inputClasses}
          disabled={isPending}
          autoComplete="name"
        />
        {nameError && <p className="mt-1.5 text-xs text-destructive">{nameError}</p>}
      </div>

      {/* Email + WhatsApp row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="email" className={labelClasses}>
            Email <span className="text-destructive">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={`${inputClasses} mt-0 pr-10`}
              disabled={isPending}
              autoComplete="email"
            />
            {emailValidation.formatOk && emailValidation.checking && (
              <Loader2
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            )}
            {emailValidation.formatOk && emailValidation.serverValid === true && (
              <Check
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-success"
                aria-hidden="true"
              />
            )}
            {emailValidation.formatOk && emailValidation.serverValid === false && (
              <AlertTriangle
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-destructive"
                aria-hidden="true"
              />
            )}
          </div>
          {touched && email !== '' && !emailValidation.formatOk && (
            <p className="mt-1.5 text-xs text-destructive">Format email tidak valid</p>
          )}
          {touched && emailValidation.formatOk && emailValidation.serverValid === false && (
            <p className="mt-1.5 text-xs text-destructive">
              Domain email tidak ditemukan. Pastikan alamat email benar.
            </p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="whatsapp" className={labelClasses}>
            Nomor WhatsApp
          </label>
          <input
            id="whatsapp"
            name="phone"
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
            placeholder="08xxxxxxxxxx"
            className={inputClasses}
            disabled={isPending}
            autoComplete="tel"
          />
          {touched && whatsapp !== '' && !waValid && (
            <p className="mt-1.5 text-xs text-destructive">
              Masukkan nomor WhatsApp yang valid (08xx)
            </p>
          )}
        </div>
      </div>

      {/* Subject - uses name="category" to avoid FormData array collision */}
      <div>
        <label htmlFor="category" className={labelClasses}>
          Subjek <span className="text-destructive">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClasses}
          disabled={isPending}
        >
          {subjectOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </select>
        {subjectError && <p className="mt-1.5 text-xs text-destructive">{subjectError}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClasses}>
          Pesan <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis pesan kamu di sini..."
          className={`${inputClasses} resize-y min-h-30`}
          disabled={isPending}
        />
        {bodyError && <p className="mt-1.5 text-xs text-destructive">{bodyError}</p>}
      </div>

      {/* hCaptcha - React library for proper SPA lifecycle */}
      <div className="flex justify-center">
        <HCaptcha
          sitekey={HCAPTCHA_SITEKEY}
          reCaptchaCompat={false}
          onVerify={setHcaptchaToken}
          onExpire={() => setHcaptchaToken('')}
          onError={() => setHcaptchaToken('')}
          theme="dark"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="press inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Kirim Pesan
          </>
        )}
      </button>

      {alertMessage && <StatusAlert status={status} message={alertMessage} />}
    </form>
  )
}
