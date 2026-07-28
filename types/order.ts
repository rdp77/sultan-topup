// Raw item from GET /orders (Laravel API)
export interface OrderApiItem {
  invoice_number: string;
  status: 'completed' | 'failed' | 'pending';
  payment_status: string;
  provider_status: string;
  game: string;
  product: string;
  quantity: number;
  email: string;
  phone: string;
  total_price: number;
  payment_method: string;
  created_at: string;
}

// GET /orders -> { data: [...] }
export interface OrderListApiResponse {
  data: OrderApiItem[];
}

// GET /orders/lookup?invoice=...&email=... -> { data: {...} }
// Not found -> { message: "Order not found" }
export interface OrderLookupResponse {
  data?: OrderApiItem | null;
  message?: string;
}
