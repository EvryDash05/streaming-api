export interface UserDetailsEntity {
  id: number;
  user_id: number;
  full_name?: string | null;
  phone_number?: string | null;
  country?: string | null;
  preferred_language?: string | null;
  created_by: string;
  created_at?: string | null;
  last_update_by?: string | null;
  last_update_at?: string | null;
}
