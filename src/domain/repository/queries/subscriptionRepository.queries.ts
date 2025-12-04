export const SAVE_SUBSCRIPTION_QUERY = `
    INSERT INTO subscriptions (
        user_id,
        plan_id,
        start_date,
        end_date,
        status,
        created_by,
        last_update_by
    )
    SELECT
        $1,
        p.id,
        CURRENT_DATE,
        CASE p.interval
            WHEN 'monthly' THEN CURRENT_DATE + INTERVAL '1 month'
            WHEN 'quarterly' THEN CURRENT_DATE + INTERVAL '3 months'
            WHEN 'yearly' THEN CURRENT_DATE + INTERVAL '1 year'
        END,
        $3,
        $4,
        $4
    FROM plans p
    WHERE p.id = $2
    AND p.is_active = TRUE
    RETURNING id;
`;

export const FIND_ACTIVE_SUBSCRIPTION_QUERY = `
    SELECT
        id,
        user_id,
        plan_id,
        start_date,
        end_date,
        status,
        created_at,
        last_update_at
    FROM subscriptions
    WHERE user_id = $1
    AND status = 'active'
    AND end_date >= CURRENT_DATE
    LIMIT 1;
`;
