import Link from 'next/link'
import Image from 'next/image'

function generateSocialMediaLinks() {
  return [
    { name: 'Instagram', url: 'https://instagram.com/sultantopupofficial' },
    { name: 'Tiktok', url: 'https://tiktok.com/@sultantopupofficial' },
    { name: 'Threads', url: 'https://threads.net/@sultantopupofficial' },
    { name: 'YouTube', url: 'https://youtube.com/@sultantopupofficial' },
    { name: 'Facebook', url: 'https://facebook.com/sultantopupofficial' },
  ]
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-300 flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Sultan Top Up Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Platform top up game tercepat di Indonesia. Proses otomatis 24 jam, pembayaran lengkap,
            harga bersahabat.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Sosial Media</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {generateSocialMediaLinks().map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Menu</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors duration-200 hover:text-foreground">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/lacak" className="transition-colors duration-200 hover:text-foreground">
                Lacak Pesanan
              </Link>
            </li>
            <li>
              <Link
                href="/leaderboard"
                className="transition-colors duration-200 hover:text-foreground"
              >
                Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors duration-200 hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors duration-200 hover:text-foreground"
              >
                Kontak
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/legal/privacy-policy"
                className="transition-colors duration-200 hover:text-foreground"
              >
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms-and-conditions"
                className="transition-colors duration-200 hover:text-foreground"
              >
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link
                href="/legal/refund-policy"
                className="transition-colors duration-200 hover:text-foreground"
              >
                Pengembalian Dana
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Sultan Top Up. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  )
}
