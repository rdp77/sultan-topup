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
