import AppError from "./commons/AppError";

/**
* BusinessError
* -------------
* Represents domain-level or application logic errors.
* Typically thrown when a business rule or validation fails.
*
* Example: "User email already exists", "Invalid payment status"
*/
export class BusinessError extends AppError {
  constructor(message: string, errors?: Record<string, any> | null, code: number = 400) {
    super(message, code, errors);
  }
}

/**
* AuthError
* ---------
* Represents authentication-related errors, such as invalid tokens
* or missing credentials.
*
* Default HTTP status: 401 Unauthorized
*/
export class AuthError extends AppError {
  constructor(message = 'Unauthorized', errors?: Record<string, any> | null) {
    super(message, 401, errors);
  }
}

/**
* ForbiddenError
* --------------
* Represents authorization errors where the user is authenticated
* but does not have permission to perform the requested action.
*
* Default HTTP status: 403 Forbidden
*/
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', errors?: Record<string, any> | null) {
    super(message, 403, errors);
  }
}

/**
* RepositoryError
* ---------------
* Represents low-level data access or persistence errors.
* Usually thrown from the repository layer when a database
* operation fails (e.g., constraint violation, connection issue).
*
* Default HTTP status: 500 Internal Server Error
*/
export class RepositoryError extends AppError {
  constructor(message = 'Database error', errors?: Record<string, any> | null) {
    super(message, 500, errors);
  }
}
