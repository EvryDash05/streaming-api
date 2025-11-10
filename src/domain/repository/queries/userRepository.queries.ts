export const INSERT_USER_QUERY = `
  INSERT INTO users (email, password_hash, role)
  VALUES ($1, $2, $3)
  RETURNING id;
`;

export const INSERT_USER_ROLE_QUERY = `
  INSERT INTO user_roles (user_id, role_id)
  VALUES ($1, $2);
`;

export const INSERT_USER_DETAILS_QUERY = `
  INSERT INTO user_details (
    user_id, 
    full_name, 
    country, 
    phone_number, 
    preferred_language, 
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, 'system');
`;

export const INSERT_PRODUCER_QUERY = `
  INSERT INTO producers (
    user_id, 
    institution_name, 
    description, 
    contact_email, 
    contact_phone
  )
  VALUES ($1, $2, $3, $4, $5);
`;

export const FIND_USER_BY_EMAIL_QUERY = `
  SELECT 
    id, 
    email, 
    password_hash AS "passwordHash", 
    role
  FROM users
  WHERE email = $1;
`;
