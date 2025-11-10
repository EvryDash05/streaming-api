export const FIND_USER_DETAILS_BY_USER_ID_QUERY = `
    SELECT
        id,
        user_id AS "userId",
        full_name AS "fullName",
        phone_number AS "phoneNumber",
        country,
        preferred_language AS "preferredLanguage"
    FROM user_details
    WHERE user_id = $1;
`