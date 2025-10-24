export interface VideoEntity {
  id: number;
  producer_id: number;
  title: string;
  description?: string | null;
  url: string;
  duration?: number | null;
  category?: string | null;
  views?: number | null;
  likes?: number | null;
  dislikes?: number | null;
  penalty_applied?: boolean | null;
  created_by: string;
  created_at?: string | null;
  last_update_by?: string | null;
  last_update_at?: string | null;
}
