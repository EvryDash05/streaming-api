export const SAVE_PRODUCER_QUERY = `
    INSERT INTO producers 
        (user_id, institution_name, description, contact_email, contact_phone) 
        VALUES ($1, $2, $3, $4, $5) 
    RETURNING id;
`;

