export const POSTGRES_ERROR_CODES = {
    UNIQUE_VIOLATION: '23505',
    FOREIGN_KEY_VIOLATION: '23503',
    CHECK_VIOLATION: '23514',
} as const;

/**
 * Error messages mapped to specific database tables and constraints.
 */
export const DB_ERROR_MAP = {
    users: {
        users_email_key: 'El correo electrónico ya está registrado.',
        users_pkey: 'El ID de usuario ya existe.',
    },
    user_details: {
        user_details_user_id_fkey: 'El usuario asociado no existe.',
    },
    profiles: {
        profiles_user_id_fkey: 'El usuario asociado al perfil no existe.',
    },
    producers: {
        producers_user_id_fkey: 'El usuario asociado al productor no existe.',
    },
    subscriptions: {
        subscriptions_user_id_fkey: 'El usuario de la suscripción no existe.',
    },
    videos: {
        videos_producer_id_fkey: 'El productor asociado al video no existe.',
    },
    watch_history: {
        watch_history_profile_id_fkey: 'El perfil del historial no existe.',
        watch_history_video_id_fkey: 'El video del historial no existe.',
    },
    favorites: {
        favorites_profile_id_fkey: 'El perfil del favorito no existe.',
        favorites_video_id_fkey: 'El video del favorito no existe.',
    },
    reviews: {
        reviews_profile_id_fkey: 'El perfil de la reseña no existe.',
        reviews_video_id_fkey: 'El video de la reseña no existe.',
        reviews_rating_check: 'La calificación debe estar entre 1 y 5.',
    },
    roles: {
        roles_name_key: 'Ya existe un rol con ese nombre.',
    },
    authorities: {
        authorities_name_key: 'Ya existe una autoridad con ese nombre.',
    },
    role_authorities: {
        role_authorities_pkey: 'Esa relación entre rol y autoridad ya existe.',
    },
    user_roles: {
        user_roles_pkey: 'El usuario ya tiene asignado ese rol.',
        user_roles_user_id_fkey: 'El usuario no existe.',
        user_roles_role_id_fkey: 'El rol no existe.',
    },
} as const;