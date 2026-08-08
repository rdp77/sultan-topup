import { PaymentMethod } from '@/types/payment-method';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(n: number | string): string {
  return `Rp ${Number(n).toLocaleString('id-ID')}`;
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function calcFee(method: PaymentMethod, price: number): number {
  return method.feeType === 'percent' ? Math.ceil((price * method.fee) / 100) : method.fee;
}
