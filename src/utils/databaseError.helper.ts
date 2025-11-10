import { DB_ERROR_MAP, POSTGRES_ERROR_CODES } from '../constants/errors/dbErrorConstast';
import { REPOSITORY_ERRORS } from '../constants/errors/errorsConstants';
import { RepositoryError } from '../infrastructure/exceptions/Exceptions';

/**
* DatabaseErrorHelper
* -------------------
* This class acts as a translator between native PostgreSQL errors
* and domain-specific RepositoryError objects used within the application.
*
* The main goal is to centralize the logic for mapping raw SQL error codes
* into meaningful, human-readable messages with contextual metadata.
*/
class DatabaseErrorHelper {

    /**
    * Translates a native PostgreSQL error into a structured RepositoryError.
    *
    * @param error - The raw error object thrown by the database client.
    * @returns RepositoryError - A standardized error object with contextual details.
    */
    static translate(error: any): RepositoryError {
        const { code, table, constraint, detail } = error;

        if (code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION ||
            code === POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION ||
            code === POSTGRES_ERROR_CODES.CHECK_VIOLATION) {

            // Try to retrieve a more specific, friendly message from the DB_ERROR_MAP
            // If not found, fallback to a generic repository error message
            const message =
                DB_ERROR_MAP[table]?.[constraint] ||
                REPOSITORY_ERRORS.GENERIC_ERROR;

            return new RepositoryError(message, {
                code,
                table,
                constraint,
                detail,
            });
        }

        // Default fallback: handle any other database transaction or unknown error.
        return new RepositoryError(REPOSITORY_ERRORS.DATABASE_TRANSACTION, {
            code,
            table,
            detail,
        });
    }
}

export default DatabaseErrorHelper;