import type { GameProduct } from '@/types/game-products'

export interface DenominationView {
  id: number
  sku: string
  amount: string
  price: number
  badge: 'popular' | 'best_value' | null
}

export function toDenominations(products: GameProduct[]): DenominationView[] {
  return products
    .filter((p) => p.is_active)
    .sort((a, b) => a.order - b.order)
    .map((p) => {
      let badge: 'best_value' | 'popular' | null = null

      if (p.is_best_value) {
        badge = 'best_value'
      } else if (p.is_popular) {
        badge = 'popular'
      }

      return {
        id: p.id,
        sku: String(p.id),
        amount: p.name,
        price: Math.round(Number.parseFloat(p.sell_price)),
        badge,
      }
    })
}
