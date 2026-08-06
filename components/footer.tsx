import Link from 'next/link';
import Image from 'next/image';

function generateSocialMediaLinks() {
  return [
    { name: 'Instagram', url: 'https://instagram.com/sultantopupofficial' },
    { name: 'Tiktok', url: 'https://tiktok.com/@sultantopupofficial' },
    { name: 'Threads', url: 'https://threads.net/@sultantopupofficial' },
    { name: 'YouTube', url: 'https://youtube.com/@sultantopup' },
    { name: 'Facebook', url: 'https://facebook.com/sultantopupofficial' },
  ];
}

export function Footer() {
  return (
    <footer className="border-border border-t">
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
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Platform top up game tercepat di Indonesia. Proses otomatis 24 jam, pembayaran lengkap,
            harga bersahabat.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Sosial Media</h3>
          <ul className="text-muted-foreground mt-3 flex flex-col gap-2 text-sm">
            {generateSocialMediaLinks().map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Menu</h3>
          <ul className="text-muted-foreground mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors duration-200">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/lacak" className="hover:text-foreground transition-colors duration-200">
                Lacak Pesanan
              </Link>
            </li>
            <li>
              <Link
                href="/leaderboard"
                className="hover:text-foreground transition-colors duration-200"
              >
                Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-foreground transition-colors duration-200">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors duration-200"
              >
                Kontak
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="text-muted-foreground mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link
                href="/legal/privacy-policy"
                className="hover:text-foreground transition-colors duration-200"
              >
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms-and-conditions"
                className="hover:text-foreground transition-colors duration-200"
              >
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link
                href="/legal/refund-policy"
                className="hover:text-foreground transition-colors duration-200"
              >
                Pengembalian Dana
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-border border-t py-4">
        <p className="text-muted-foreground text-center text-xs">
          © 2026 Sultan Top Up. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}
