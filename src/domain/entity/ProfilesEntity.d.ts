export type ProfileTypeEntity = 'standard' | 'kids';

export interface ProfileEntity {
  id: number;
  user_id: number;
  profile_name: string;
  profile_picture_url?: string | null;
  profile_type?: ProfileTypeEntity | null;
  preferred_language?: string | null;
  favorite_genres?: any | null; // JSON
  recommended_genres?: any | null; // JSON
  created_at?: string | null;
  updated_at?: string | null;
}
