import { apiFetch } from '@/lib/api-client';
import type { LeaderboardListResponse } from '@/types/leaderboard';

export const LeaderboardService = {
  list() {
    return apiFetch<LeaderboardListResponse>('/leaderboard', {
      next: { revalidate: 60 },
    });
  },
};
