import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Daftar — Sultan Top Up',
}

export default function RegisterPage() {
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16 md:px-6">
      <AuthForm mode="register" />
    </main>
  )
}
