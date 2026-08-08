export type PaymentMethod = {
  id: string;
  name: string;
  fee: number;
  feeType: 'flat' | 'percent';
};

export function calcFee(method: PaymentMethod, price: number): number {
  return method.feeType === 'percent' ? Math.ceil((price * method.fee) / 100) : method.fee;
}

export type OrderStatus = 'success' | 'failed' | 'processing' | 'expired';

export type Order = {
  invoice: string;
  game: string;
  product: string;
  price: number;
  fee: number;
  total: number;
  method: string;
  userId: string;
  playerId: string;
  phone: string;
  status: OrderStatus;
  date: string;
};
