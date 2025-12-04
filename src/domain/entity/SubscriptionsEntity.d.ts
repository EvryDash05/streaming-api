export type SubscriptionStatusEntity = 'active' | 'inactive' | 'canceled';

export interface SubscriptionEntity {
  id?: number;
  user_id: number;
  plan_id: number;
  price?: string; // Prisma Decimal -> string
  start_date?: string; // date string
  end_date?: string; // date string
  status?: SubscriptionStatusEntity | null;
  created_by: string;
  created_at?: string | null;
  last_update_by?: string | null;
  last_update_at?: string | null;
}
