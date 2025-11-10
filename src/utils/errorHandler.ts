import { POSTGRES_ERROR_CODES } from "../constants/errors/dbErrorConstast";
import { BusinessError, RepositoryError } from "../infrastructure/exceptions/Exceptions";

/**
* mapErrorCodeMessage
* -------------------
* Maps specific PostgreSQL error codes to application-level standardized error identifiers.
*
* This function helps the business layer interpret low-level database errors
* in a consistent and readable way without exposing internal database codes
* or implementation details to higher layers or end-users.
*
* @param code - The PostgreSQL error code returned from a database exception.
* @returns A standardized application error code string.
*/
function mapErrorCodeMessage(code: string): string {
    switch (code) {
        case POSTGRES_ERROR_CODES.UNIQUE_VIOLATION:
            return '[DUPLICATE_VALUE]';
        case POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION:
            return '[FK_INVALID]';
        case POSTGRES_ERROR_CODES.CHECK_VIOLATION:
            return '[CHECK_VIOLATION]';
        default:
            return '[GENERIC_DATABASE_ERROR]';
    }
}

/**
* handleBusinessOperation
* -----------------------
* A standardized wrapper for executing business operations that interact with repositories.
*
* This function provides a clean and reusable pattern for:
*  - Executing a business operation that may throw a RepositoryError.
*  - Translating low-level repository errors into higher-level BusinessError exceptions.
*  - Preserving consistent error messages and structures across the business layer.
*
* @template T - The expected return type of the wrapped operation.
* @param operation - An asynchronous function representing the business logic to execute.
* @param businessMessage - A human-readable message to include if a business error occurs.
* @returns A Promise resolving to the operation result of type `T`.
*
* @throws {BusinessError} If a repository-level error occurs during execution.
* @throws {Error} For any other unexpected error types.
*/
export async function handleBusinessOperation<T>(
    operation: () => Promise<T>,
    businessMessage: string
): Promise<T> {
    try {
        return await operation();        
    } catch (error) {
        if (error instanceof RepositoryError) {
            throw new BusinessError(businessMessage, {
                code: mapErrorCodeMessage(error.errors?.code),
                detail: error.message
            });
        }
        throw error;
    }
}