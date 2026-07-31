export interface LeaderboardEntry {
  rank: number;
  name: string;
  total: number;
  transactions: number;
}

export interface LeaderboardListResponse {
  data: LeaderboardEntry[];
}
