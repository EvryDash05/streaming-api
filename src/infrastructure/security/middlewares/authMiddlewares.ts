import { MiddlewareObj } from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { JWTPayload } from "jose";
import { buildLambdaResponse, errorResponse, LambdaResponse } from "../../../utils/HttpUtils";
import logger from "../../../utils/logger";
import { verifyJwtToken } from "../JwtUtils";
import loggerMessage from "../../../utils/logger";

class AuthMiddlewares {

    public static verifyJwt(): MiddlewareObj<
        APIGatewayEvent,
        APIGatewayProxyResult
    > {
        return {
            before: async (request: any): Promise<LambdaResponse | void> => {
                logger.info('Verifying JWT token...');
                const headers = (request.event && request.event.headers) ? request.event.headers : {};

                if (!headers['Authorization']) {
                    logger.error('Token not provided')
                    errorResponse('Token no proporcionado', ['Falta el token de autorización'], 401);
                }

                const jwtToken = headers['Authorization'].split(' ')[1];

                if (jwtToken.length < 2) {
                    logger.error('Invalid token format');
                    const error = errorResponse('Token inválido', ['El token de autorización es inválido'], 401);
                    return buildLambdaResponse(error.statusCode, error);
                }

                logger.info(`Token: ${jwtToken}`);

                const payload = await verifyJwtToken(jwtToken);
                request.auth = payload;

                if (!payload) {
                    logger.error('Invalid or expired token');
                    const error = errorResponse('Token inválido o expirado', ['El token de autorización es inválido o ha expirado'], 401);
                    return buildLambdaResponse(error.statusCode, error);
                }

                request.event.requestContext = request.event.requestContext || {};
                request.event.requestContext.authorizer = {
                    ...(request.event.requestContext.authorizer || {}),
                    jwt: payload
                };

                return;
            }
        }
    }

    public static cheackRoles(allowedRoles: string[]): MiddlewareObj<APIGatewayEvent, APIGatewayProxyResult> {
        return {
            before: async (request: any): Promise<LambdaResponse | void> => {
                const payload: JWTPayload = request.auth;
                
                loggerMessage.info('Body: ' + payload);
                logger.info('Allowed roles: ' + allowedRoles);

                if (!payload.roles || !allowedRoles.includes(payload.roles as string)) {
                    logger.error('Access denied...')
                    const error = errorResponse('Acceso denegado', ['No tienes permisos para acceder a este recurso'], 403);
                    return buildLambdaResponse(error.statusCode, error);
                }

                return;
            }
        }
    }

    public static cheackPermissions(allowedPermissions: string[]): MiddlewareObj<APIGatewayEvent, APIGatewayProxyResult> {
        return {
            before: async (request: any): Promise<LambdaResponse | void> => {
                const payload: JWTPayload = request.auth;
                loggerMessage.info('Body: ' + request);
                logger.info('Allowed permissions: ' + allowedPermissions);

                const userPermissions: string[] = payload.authorities as string[] || [];

                if (!userPermissions || !allowedPermissions.every(permission => userPermissions.includes(permission))) {
                    logger.error('Access denied due to insufficient permissions')
                    const error = errorResponse('Acceso denegado', ['No tienes permisos suficientes para acceder a este recurso'], 403);
                    return buildLambdaResponse(error.statusCode, error);
                }

                return;
            }
        }
    }

}

export default AuthMiddlewares;