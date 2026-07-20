// Request body for POST /checkout
export interface CheckoutRequest {
  userId: string
  zoneId: string
  gameId: number
  productId: number
  sku: string
  quantity: number
  email: string
  whatsapp: string
  paymentMethod: string
}

// API Response from /checkout
export interface CheckoutResponse {
  success: boolean
  data?: CheckoutResult
  error?: string
}

// Checkout result with payment details
export interface CheckoutResult {
  orderId: string
  invoice: string
  paymentType: 'qris' | 'va' | 'ewallet'
  paymentData: PaymentData
  amount: number
  fee: number
  total: number
  expiryTime: string
}

// Discriminated union for different payment types
export type PaymentData = QRISPaymentData | VAPaymentData | EWalletPaymentData

export interface QRISPaymentData {
  type: 'qris'
  qrCode: string
  qrString: string
}

export interface VAPaymentData {
  type: 'va'
  vaNumber: string
  bank: string
}

export interface EWalletPaymentData {
  type: 'ewallet'
  deepLink: string
  paymentUrl: string
}
