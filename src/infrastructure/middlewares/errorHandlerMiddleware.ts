import { MiddlewareObj, Request } from '@middy/core';
import { buildLambdaResponse, errorResponse } from '../../utils/HttpUtils';
import loggerMessage from '../../utils/logger';
import AppError from '../exceptions/commons/AppError';

/**
* errorHandlerMiddleware
* ----------------------
* Global error-handling middleware for AWS Lambda (using Middy).
*
* This middleware centralizes error translation and HTTP response formatting.
* It ensures that any error thrown during Lambda execution (whether expected or unexpected)
* is properly logged, converted into a standardized response structure, and returned
* to the API Gateway or client.
*
* It handles both:
*  - Known application errors (instances of AppError and its subclasses)
*  - Unknown or unexpected runtime errors
*
* @returns {MiddlewareObj} Middy-compatible middleware object with an `onError` handler.
*/
export function errorHandlerMiddleware(): MiddlewareObj {
  const middleware: MiddlewareObj = {
    onError: async (request: Request) => {
      const error = request.error as any;

      loggerMessage.error('Lambda error:' + error);

      let statusCode = 500;
      let message = 'Internal Server Error';
      let errors: Record<string, any> | null = null;

      // Handle known application errors (AppError or its subclasses)
      if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errors = error.errors ?? null;
      } else {
        // Provides minimal safe information to the client to avoid leaking internals.
        errors = { message: error.message || 'Unexpected error' };
      }

      // Build a standardized JSON response body using the shared response helpers.
      const body = errorResponse(message, errors, statusCode);

      // Construct the full Lambda response (statusCode + JSON body + headers)
      request.response = buildLambdaResponse(statusCode, body);
    },
  };

  return middleware;
}