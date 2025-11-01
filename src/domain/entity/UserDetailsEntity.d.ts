export interface UserDetailsEntity {
  id: number;
  userId: number;
  fullName?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  preferredLanguage?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  last_update_by?: string | null;
  last_update_at?: string | null;
}
