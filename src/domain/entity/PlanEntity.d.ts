export type PlanIntervalEntity = 'monthly' | 'quarterly' | 'yearly';

export interface PlanEntity {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    currency?: string | null;
    interval: PlanIntervalEntity;
    max_profiles?: number | null;
    max_quality?: string | null;
    is_active?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
}
