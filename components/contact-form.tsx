'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import isEmail from 'validator/lib/isEmail'
import HCaptcha from '@hcaptcha/react-hcaptcha'

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? ''

const waRegex = /^08\d{8,12}$/

function validateWhatsApp(raw: string): boolean {
  const clean = raw.replace(/\D/g, '')
  return waRegex.test(clean)
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const emailValid = email === '' || isEmail(email.trim())
  const phoneValid = phone === '' || validateWhatsApp(phone)

  // Load web3forms client script (handles hCaptcha automatically)
  useEffect(() => {
    if (document.querySelector('script[src*="web3forms.com/client"]')) return
    const script = document.createElement('script')
    script.src = 'https://web3forms.com/client/script.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched(true)

    const form = e.currentTarget
    const formEmail = form.email?.value?.trim() ?? ''
    const formPhone = form.phone?.value?.trim() ?? ''

    if (!isEmail(formEmail)) {
      setStatus('error')
      setMessage('Masukkan email yang valid.')
      return
    }

    const phoneClean = formPhone.replace(/\D/g, '')
    if (phoneClean && !waRegex.test(phoneClean)) {
      setStatus('error')
      setMessage('Masukkan nomor WhatsApp yang valid (08xx).')
      return
    }

    setStatus('pending')
    setMessage('Mengirim pesan...')

    const formData = new FormData(form)
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('subject', `[Kontak] ${formData.get('subject')?.toString() ?? 'Pesan Baru'}`)
    formData.append('from_name', 'Sultan Top Up Website')

    // If phone was provided, append it as a separate field for the email notification
    if (phoneClean) {
      formData.set('phone', phoneClean)
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Pesan berhasil dikirim! Tim kami akan membalas dalam 1x24 jam.')
        form.reset()
        setEmail('')
        setPhone('')
        setTouched(false)
      } else {
        setStatus('error')
        setMessage(data.message || 'Gagal mengirim pesan. Silakan coba lagi.')
      }
    } catch {
      setStatus('error')
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi nanti.')
    }
  }, [])

  const labelClasses = 'text-sm font-medium text-foreground'
  const inputClasses =
    'mt-1.5 block w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20'
  const isPending = status === 'pending'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
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
          placeholder="Nama kamu"
          className={inputClasses}
          disabled={isPending}
          autoComplete="name"
        />
      </div>

      {/* Email + Phone row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className={inputClasses}
            disabled={isPending}
            autoComplete="email"
          />
          {touched && email !== '' && !emailValid && (
            <p className="mt-1.5 text-xs text-destructive">Format email tidak valid</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Nomor WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="08xxxxxxxxxx"
            className={inputClasses}
            disabled={isPending}
            autoComplete="tel"
          />
          {touched && phone !== '' && !phoneValid && (
            <p className="mt-1.5 text-xs text-destructive">
              Masukkan nomor WhatsApp yang valid (08xx)
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className={labelClasses}>
          Subjek <span className="text-destructive">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          minLength={3}
          placeholder="Subjek pesan kamu"
          className={inputClasses}
          disabled={isPending}
        />
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
          placeholder="Tulis pesan kamu di sini..."
          className={`${inputClasses} resize-y min-h-[120px]`}
          disabled={isPending}
        />
      </div>

      {/* hCaptcha - web3forms zero-config */}
      <div className="flex justify-center">
        <div className="h-captcha" data-captcha="true" />
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

      {/* Status message */}
      {message && (
        <div
          role="alert"
          className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-sm ${
            status === 'success'
              ? 'border-success/30 bg-success/5 text-success'
              : status === 'error'
                ? 'border-destructive/30 bg-destructive/5 text-destructive'
                : 'border-border bg-card text-muted-foreground'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : status === 'error' ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : null}
          <span>{message}</span>
        </div>
      )}
    </form>
  )
}
