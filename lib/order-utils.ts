import type { Order, OrderApiItem } from '@/types/order';

/** Maps a raw API order item to the local `Order` view model. */
export function toOrder(item: OrderApiItem): Order {
  return {
    invoice: item.invoice_number,
    game: item.game,
    product: item.product,
    price: item.total_price,
    fee: 0,
    total: item.total_price,
    method: item.payment_method,
    userId: item.email,
    phone: item.phone,
    playerId: item.player_id,
    status: item.status || 'failed',
    date: item.created_at,
  };
}