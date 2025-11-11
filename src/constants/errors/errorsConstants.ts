/**
* Centralized error messages for repository operations.
*/

export const REPOSITORY_ERRORS = {
    METHOD_NOT_IMPLEMENTED: 'Method not implemented.',
    DATABASE_TRANSACTION: 'Error en la transacción con la base de datos',
    GENERIC_ERROR: 'Error de integridad de base de datos.'
};

export const VIDEO_ERRORS = {
    METHOD_NOT_IMPLEMENTED: 'Method not implemented.',
    FIND_ALL: 'Error al obtener los videos',
    FIND_BY_ID: 'Error al encontrar el video por id',
    SAVE: 'Error al guardar el video',
    DELETE: 'Error al eliminar el video',
    UPDATE: 'Error al actualizar el video',
};

export const USER_ERRORS = {
    SAVE: 'Error al registrar el usuario',
    FIND_BY_EMAIL: 'Error al encontrar el usuario',
    UPDATE: 'Error al actualizar el usuario',
    DELETE: 'Error al eliminar el usuario',
    METHOD_NOT_IMPLEMENTED: 'Method not implemented.',
};

export const USER_DETAILS_ERRORS = {
    SAVE: 'Error al guardar el detalle del usuario',
    FIND_BY_ID: 'Error al encontrar el usuario por id',
    UPDATE: 'Error al actualizar el detaillle del usuario',
    DELETE: 'Error al eliminar el detalle del usuario',
    METHOD_NOT_IMPLEMENTED: 'Method not implemented.',
};
