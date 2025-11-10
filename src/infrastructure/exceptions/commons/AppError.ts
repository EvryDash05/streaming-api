/**
* Base Application Error
* ----------------------
* This abstract class extends the built-in `Error` object and serves as the
* foundation for all domain-specific exceptions in the application.
*
* It provides a consistent structure for handling operational errors with
* a status code, a readable message, and optional metadata (e.g., validation details).
*/
class AppError extends Error {

    /**
    * @param message - A human-readable error message describing what went wrong.
    * @param statusCode - HTTP-like status code representing the error type (default: 500).
    * @param errors - Optional additional error details (e.g., validation errors, DB metadata).
    */
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500,
        public readonly errors?: Record<string, any> | null
    ) {
        super(message);
        this.name = new.target.name;
    }
}

export default AppError;