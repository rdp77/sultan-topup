export type Game = {
  slug: string
  name: string
  publisher: string
  image: string
  currency: string
  idLabel: string
  idPlaceholder: string
  needsZone: boolean
  popular: boolean
}

export type Denomination = {
  id: string
  amount: string
  price: number
  badge?: 'popular' | 'best-value'
}

export type PaymentMethod = {
  id: string
  name: string
  fee: number
  feeType: 'flat' | 'percent'
}

export type PaymentGroup = {
  group: string
  methods: PaymentMethod[]
}

export const games: Game[] = [
  {
    slug: 'mobile-legends',
    name: 'Mobile Legends',
    publisher: 'Moonton',
    image: '/games/mobile-legends.png',
    currency: 'Diamonds',
    idLabel: 'User ID',
    idPlaceholder: 'Contoh: 12345678',
    needsZone: true,
    popular: true,
  },
  {
    slug: 'free-fire',
    name: 'Free Fire',
    publisher: 'Garena',
    image: '/games/free-fire.png',
    currency: 'Diamonds',
    idLabel: 'Player ID',
    idPlaceholder: 'Contoh: 987654321',
    needsZone: false,
    popular: true,
  },
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    publisher: 'Tencent',
    image: '/games/pubg-mobile.png',
    currency: 'UC',
    idLabel: 'Character ID',
    idPlaceholder: 'Contoh: 5123456789',
    needsZone: false,
    popular: true,
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    publisher: 'HoYoverse',
    image: '/games/genshin-impact.png',
    currency: 'Genesis Crystals',
    idLabel: 'UID',
    idPlaceholder: 'Contoh: 800123456',
    needsZone: false,
    popular: false,
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    publisher: 'Riot Games',
    image: '/games/valorant.png',
    currency: 'Points',
    idLabel: 'Riot ID',
    idPlaceholder: 'Contoh: Pemain#1234',
    needsZone: false,
    popular: false,
  },
  {
    slug: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    publisher: 'HoYoverse',
    image: '/games/honkai-star-rail.png',
    currency: 'Oneiric Shards',
    idLabel: 'UID',
    idPlaceholder: 'Contoh: 700123456',
    needsZone: false,
    popular: false,
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corp.',
    image: '/games/roblox.png',
    currency: 'Robux',
    idLabel: 'Username',
    idPlaceholder: 'Contoh: pemain_keren',
    needsZone: false,
    popular: false,
  },
  {
    slug: 'cod-mobile',
    name: 'Call of Duty Mobile',
    publisher: 'Activision',
    image: '/games/cod-mobile.png',
    currency: 'CP',
    idLabel: 'Player UID',
    idPlaceholder: 'Contoh: 6712345678901234',
    needsZone: false,
    popular: false,
  },
]

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug)
}

export const denominations: Record<string, Denomination[]> = {
  'mobile-legends': [
    { id: 'ml-1', amount: '86 Diamonds', price: 21500 },
    { id: 'ml-2', amount: '172 Diamonds', price: 42500 },
    { id: 'ml-3', amount: '257 Diamonds', price: 63500, badge: 'popular' },
    { id: 'ml-4', amount: '344 Diamonds', price: 84500 },
    { id: 'ml-5', amount: '514 Diamonds', price: 126500, badge: 'best-value' },
    { id: 'ml-6', amount: '706 Diamonds', price: 168500 },
    { id: 'ml-7', amount: '1050 Diamonds', price: 249000 },
    { id: 'ml-8', amount: '2195 Diamonds', price: 512000 },
  ],
}

const defaultDenoms: Denomination[] = [
  { id: 'd-1', amount: '100', price: 16000 },
  { id: 'd-2', amount: '310', price: 48000 },
  { id: 'd-3', amount: '520', price: 79000, badge: 'popular' },
  { id: 'd-4', amount: '1060', price: 155000 },
  { id: 'd-5', amount: '2180', price: 305000, badge: 'best-value' },
  { id: 'd-6', amount: '5600', price: 760000 },
]

export function getDenominations(game: Game): Denomination[] {
  const list = denominations[game.slug]
  if (list) return list
  return defaultDenoms.map((d) => ({
    ...d,
    amount: `${d.amount} ${game.currency}`,
  }))
}

export const paymentGroups: PaymentGroup[] = [
  {
    group: 'QRIS',
    methods: [{ id: 'qris', name: 'QRIS (Semua E-Wallet & Bank)', fee: 0.7, feeType: 'percent' }],
  },
  {
    group: 'E-Wallet',
    methods: [
      { id: 'gopay', name: 'GoPay', fee: 1000, feeType: 'flat' },
      { id: 'ovo', name: 'OVO', fee: 1000, feeType: 'flat' },
      { id: 'dana', name: 'DANA', fee: 1000, feeType: 'flat' },
      { id: 'shopeepay', name: 'ShopeePay', fee: 1500, feeType: 'flat' },
    ],
  },
  {
    group: 'Virtual Account',
    methods: [
      { id: 'bca', name: 'BCA Virtual Account', fee: 4000, feeType: 'flat' },
      { id: 'bni', name: 'BNI Virtual Account', fee: 4000, feeType: 'flat' },
      { id: 'bri', name: 'BRI Virtual Account', fee: 4000, feeType: 'flat' },
      { id: 'mandiri', name: 'Mandiri Virtual Account', fee: 4000, feeType: 'flat' },
    ],
  },
]

export function calcFee(method: PaymentMethod, price: number): number {
  return method.feeType === 'percent' ? Math.ceil((price * method.fee) / 100) : method.fee
}

export function formatRupiah(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`
}

export type OrderStatus = 'success' | 'failed' | 'processing' | 'expired'

export type Order = {
  invoice: string
  game: string
  product: string
  price: number
  fee: number
  total: number
  method: string
  userId: string
  status: OrderStatus
  date: string
}

export const mockOrders: Order[] = [
  {
    invoice: 'INV-20260702-8F3K',
    game: 'Mobile Legends',
    product: '514 Diamonds',
    price: 126500,
    fee: 886,
    total: 127386,
    method: 'QRIS',
    userId: '12345678 (2001)',
    status: 'success',
    date: '2 Juli 2026, 14:32',
  },
  {
    invoice: 'INV-20260628-2QWE',
    game: 'Free Fire',
    product: '520 Diamonds',
    price: 79000,
    fee: 1000,
    total: 80000,
    method: 'GoPay',
    userId: '987654321',
    status: 'success',
    date: '28 Juni 2026, 09:15',
  },
  {
    invoice: 'INV-20260620-7HJL',
    game: 'PUBG Mobile',
    product: '1060 UC',
    price: 155000,
    fee: 4000,
    total: 159000,
    method: 'BCA Virtual Account',
    userId: '5123456789',
    status: 'processing',
    date: '20 Juni 2026, 21:47',
  },
  {
    invoice: 'INV-20260615-4ZXC',
    game: 'Genshin Impact',
    product: '2180 Genesis Crystals',
    price: 305000,
    fee: 2135,
    total: 307135,
    method: 'QRIS',
    userId: '800123456',
    status: 'expired',
    date: '15 Juni 2026, 11:03',
  },
]

export type LeaderboardEntry = {
  rank: number
  name: string
  total: number
  transactions: number
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Rizky***', total: 12450000, transactions: 87 },
  { rank: 2, name: 'Putri***', total: 9870000, transactions: 64 },
  { rank: 3, name: 'Andi***', total: 8340000, transactions: 71 },
  { rank: 4, name: 'Dewi***', total: 6120000, transactions: 45 },
  { rank: 5, name: 'Bagas***', total: 5890000, transactions: 52 },
  { rank: 6, name: 'Siti***', total: 4760000, transactions: 38 },
  { rank: 7, name: 'Fajar***', total: 4210000, transactions: 41 },
  { rank: 8, name: 'Nadia***', total: 3980000, transactions: 29 },
  { rank: 9, name: 'Yoga***', total: 3540000, transactions: 33 },
  { rank: 10, name: 'Intan***', total: 3120000, transactions: 26 },
]
