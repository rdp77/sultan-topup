import type { PaginatedResponse } from '@/types/pagination';
import { GameProduct } from './game-products';

export type GameListResponse = PaginatedResponse<Game>;
export interface GameDetailResponse {
  data: GameDetail;
}

export interface Game {
  is_popular: boolean;
  cover: string;
  name: string;
  slug: string;
  publisher: string;
  description: string;
}

export interface GameDetail {
  id: number;
  cover: string;
  name: string;
  slug: string;
  publisher: string;
  products: GameProduct[];
}
