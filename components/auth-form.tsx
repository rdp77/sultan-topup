'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'

export function AuthForm({ mode }: Readonly<{ mode: 'login' | 'register' }>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isLogin = mode === 'login'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 900)
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary">
          <Zap className="size-5 text-primary-foreground" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {isLogin ? 'Masuk ke Sultan Top Up' : 'Buat Akun Sultan Top Up'}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isLogin
            ? 'Lihat riwayat pesanan dan top up lebih cepat.'
            : 'Gratis dan cepat. Checkout tetap bisa tanpa akun.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-muted-foreground">
              Nama
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Nama kamu"
              className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm text-muted-foreground">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            required
            placeholder="nama@email.com"
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-sm text-muted-foreground">
            Kata Sandi
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={8}
            placeholder="Minimal 8 karakter"
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="press mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 enabled:hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {isLogin ? 'Masuk...' : 'Mendaftar...'}
            </>
          ) : isLogin ? (
            'Masuk'
          ) : (
            'Daftar'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            Belum punya akun?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
