import { redirect } from 'next/navigation';

// /game without a slug — redirect to home (#games section)
// Alternative: could be replaced with a game index page if needed later
export default function GameIndexPage() {
  redirect('/#games');
}
