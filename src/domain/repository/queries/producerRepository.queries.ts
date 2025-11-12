export const SAVE_PRODUCER_QUERY = `
    INSERT INTO producers 
        (user_id, institution_name, description, contact_email, contact_phone) 
        VALUES ($1, $2, $3, $4, $5) 
    RETURNING id;
`;

export const FIND_PRODUCER_BY_USER_ID_QUERY = `
    SELECT id, user_id, institution_name, description, contact_email, contact_phone 
    FROM producers 
    WHERE user_id = $1;
`