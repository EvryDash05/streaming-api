
export const SAVE_VIDEO_QUERY = `
    INSERT INTO videos (
    producer_id,
    title,
    description,
    url,
    duration,
    category,
    created_by,
    last_update_by
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, title;
`

export const FIND_ALL_VIDEOS_QUERY = `
    SELECT * FROM videos;    
`

/* export const FIND_VIDEO_BY_ID_QUERY = `
    SELECT
        producer_id,
        title,
        description,
        url,
        duration,
        category,
        created_by,
        last_update_by
    FROM videos WHERE id = $1;    
` */

export const FIND_VIDEO_BY_ID_QUERY = `
    SELECT *
    FROM videos WHERE id = $1;    
`