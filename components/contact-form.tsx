'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '10000000-ffff-ffff-ffff-000000000001'

declare global {
  interface Window {
    hcaptcha?: {
      render: (el: string, opts: Record<string, unknown>) => string
      reset: (id: string) => void
      getResponse: (id: string) => string
      remove: (id: string) => void
    }
  }
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const hcaptchaRef = useRef<HTMLDivElement>(null)
  const hcaptchaId = useRef<string>('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Load hCaptcha script and render widget
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="hcaptcha"]')

    const renderWidget = () => {
      if (!hcaptchaRef.current || !window.hcaptcha) return
      hcaptchaId.current = window.hcaptcha.render('hcaptcha-container', {
        sitekey: HCAPTCHA_SITE_KEY,
        theme: 'dark',
        size: 'normal',
      })
    }

    if (window.hcaptcha) {
      renderWidget()
      return
    }

    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://js.hcaptcha.com/1/api.js'
      script.async = true
      script.defer = true
      script.onload = renderWidget
      document.head.appendChild(script)
    } else {
      ;(existingScript as HTMLScriptElement).addEventListener('load', renderWidget)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('pending')
    setMessage('Mengirim pesan...')

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '')
    formData.append('subject', `[Kontak] ${formData.get('subject')?.toString() ?? 'Pesan Baru'}`)
    formData.append('from_name', 'Sultan Top Up Website')

    // Append hCaptcha token
    if (hcaptchaId.current && window.hcaptcha) {
      const token = window.hcaptcha.getResponse(hcaptchaId.current)
      if (token) {
        formData.append('h-captcha-response', token)
      }
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
        // Reset hCaptcha
        if (hcaptchaId.current && window.hcaptcha) {
          window.hcaptcha.reset(hcaptchaId.current)
        }
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

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClasses}>
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@contoh.com"
          className={inputClasses}
          disabled={isPending}
          autoComplete="email"
        />
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

      {/* hCaptcha */}
      <div className="flex justify-center">
        <div ref={hcaptchaRef} id="hcaptcha-container" />
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
