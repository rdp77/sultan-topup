import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Masuk — TopUpin',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center px-4 py-16 md:px-6">
        <AuthForm mode="login" />
      </main>
      <Footer />
    </div>
  )
}
