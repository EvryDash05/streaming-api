export const FIND_AUTHORITIES_BY_ROLENAME_QUERY = `SELECT a.id, a.name
    FROM role_authorities ra
    JOIN roles r ON ra.role_id = r.id
    JOIN authorities a ON ra.authority_id = a.id
    WHERE r.name = $1
`