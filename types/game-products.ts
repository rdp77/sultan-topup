export interface GameProduct {
  id: number
  game_id: number
  is_active: boolean
  is_popular: boolean
  is_best_value: boolean
  order: number
  name: string
  amount: number
  bonus_amount: number
  sell_price: string
  base_price: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
