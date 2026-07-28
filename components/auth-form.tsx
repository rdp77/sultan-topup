'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import posthog from 'posthog-js';

export function AuthForm({ mode }: Readonly<{ mode: 'login' | 'register' }>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isLogin = mode === 'login';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    posthog.capture(isLogin ? 'user_logged_in' : 'user_registered');
    setTimeout(() => router.push('/dashboard'), 900);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Sultan Top Up Logo"
          width={32}
          height={32}
          className="h-8 w-auto"
        />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {isLogin ? 'Masuk ke Sultan Top Up' : 'Buat Akun Sultan Top Up'}
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {isLogin
            ? 'Lihat riwayat pesanan dan top up lebih cepat.'
            : 'Gratis dan cepat. Checkout tetap bisa tanpa akun.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="text-muted-foreground mb-1.5 block text-sm">
              Nama
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Nama kamu"
              className="border-input bg-card placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
            />
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className="text-muted-foreground mb-1.5 block text-sm">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            required
            placeholder="nama@email.com"
            className="border-input bg-card placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="text-muted-foreground mb-1.5 block text-sm">
            Kata Sandi
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={8}
            placeholder="Minimal 8 karakter"
            className="border-input bg-card placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="press bg-primary text-primary-foreground enabled:hover:bg-primary/90 mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:opacity-60"
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

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {isLogin ? (
          <>
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
