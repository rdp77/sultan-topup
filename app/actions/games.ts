'use server';

import { GameService } from '@/services';

export async function loadMoreGamesAction(page: number) {
  return GameService.list(page);
}