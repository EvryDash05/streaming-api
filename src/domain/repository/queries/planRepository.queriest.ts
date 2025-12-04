export const FIND_PLAN_BY_ID_QUERY = `
    SELECT
        id,
        name,
        description,
        price,
        currency,
        interval,
        is_active,
        created_at,
        updated_at
    FROM plans
    WHERE id = $1
    LIMIT 1;
`;
