export interface WatchHistoryEntity {
  id: number;
  profile_id: number;
  video_id: number;
  watched_at?: string | null;
  progress?: number | null;
}
