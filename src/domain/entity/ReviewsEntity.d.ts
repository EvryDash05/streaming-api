export interface ReviewEntity {
  id: number;
  profile_id: number;
  video_id: number;
  rating: number;
  comment?: string | null;
  created_at?: string | null;
}
