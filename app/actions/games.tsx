'use server'

import { GameService } from '@/services/game.service'

export async function loadMoreGamesAction(page: number) {
  return GameService.list(page)
}
