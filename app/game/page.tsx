import { redirect } from 'next/navigation'

// /game tanpa slug — redirect ke home (#games section)
// Alternatif: bisa diganti halaman index game jika diperlukan nanti
export default function GameIndexPage() {
  redirect('/#games')
}
