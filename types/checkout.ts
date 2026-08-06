// Request body for POST /checkout
export interface CheckoutRequest {
  playerId: string;
  zoneId: string;
  gameId: number;
  productId: number;
  sku: string;
  quantity: number;
  email: string;
  whatsapp: string;
  paymentMethod: string;
}

// API Response from /checkout
export interface CheckoutResponse {
  success: boolean;
  data?: CheckoutResult;
  error?: string;
}

// Checkout result with payment details
export interface CheckoutOrderProduct {
  id: number;
  name: string;
  amount: number;
  sell_price: number;
}

export interface CheckoutOrderGame {
  id: number;
  name: string;
  slug: string;
}

export interface CheckoutOrder {
  id: number;
  invoice_number: string;
  subtotal: number;
  fee: number;
  total_price: number;
  status: string;
  quantity: number;
  product: CheckoutOrderProduct;
  game: CheckoutOrderGame;
}

export interface CheckoutPaymentMethod {
  id: number;
  code: string;
  name: string;
  type: string;
}

export interface CheckoutPaymentGateway {
  code: string;
  name: string;
}

export interface CheckoutPayment {
  id: number;
  status: string;
  expired_at: string;
  method: CheckoutPaymentMethod;
  gateway: CheckoutPaymentGateway;
  payment_url: string | null;
  payment_number: string;
  instructions: string[];
}

export interface CheckoutResult {
  order: CheckoutOrder;
  payment: CheckoutPayment;
}

export type CheckoutServiceResult =
  { success: true; data: CheckoutResult } | { success: false; error: string };
