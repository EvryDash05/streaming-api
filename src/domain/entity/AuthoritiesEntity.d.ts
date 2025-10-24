export interface AuthorityEntity {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string | null; // ISO date string
}
