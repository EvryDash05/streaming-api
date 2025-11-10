import { MiddlewareObj } from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { JWTPayload } from "jose";
import { LambdaResponse } from "../../../utils/HttpUtils";
import loggerMessage from "../../../utils/logger";
import { AuthError, ForbiddenError } from "../../exceptions/Exceptions";
import { verifyJwtToken } from "../JwtUtils";

class AuthMiddlewares {

    public static verifyJwt(): MiddlewareObj<
        APIGatewayEvent,
        APIGatewayProxyResult
    > {
        return {
            before: async (request: any): Promise<LambdaResponse | void> => {
                const headers = (request.event && request.event.headers) ? request.event.headers : {};

                if (!headers['Authorization']) {
                    loggerMessage.error('Token not provided')
                    throw new AuthError('Token no proporcionado', { detail: 'No se encontró el token de autorización' });
                }

                const jwtToken = headers['Authorization'].split(' ')[1];

                if (jwtToken.length < 2) {
                    loggerMessage.error('Invalid token format');
                    throw new AuthError('Token inválido', { detail: 'El token de autorización es inválido' });
                }

                const payload = await verifyJwtToken(jwtToken);
                request.auth = payload;

                if (!payload) {
                    loggerMessage.error('Invalid or expired token');
                    throw new AuthError('Token inválido', { detail: 'El token de autorización es inválido o ha expirdo' });
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

                if (!payload.roles || !allowedRoles.includes(payload.roles as string)) {
                    loggerMessage.error('Access denied dute to unauthorized role')
                    throw new ForbiddenError('Acceso denegado', { detail: 'No tienes permisos para acceder a este recurso' });
                }

                return;
            }
        }
    }

    public static cheackPermissions(allowedPermissions: string[]): MiddlewareObj<APIGatewayEvent, APIGatewayProxyResult> {
        return {
            before: async (request: any): Promise<LambdaResponse | void> => {
                const payload: JWTPayload = request.auth;

                const userPermissions: string[] = payload.authorities as string[] || [];

                if (!userPermissions || !allowedPermissions.every(permission => userPermissions.includes(permission))) {
                    loggerMessage.error('Access denied due to insufficient permissions')
                    throw new ForbiddenError('Acceso denegado', { detail: 'No tienes permisos para acceder a este recurso' });
                }

                return;
            }
        }
    }

}

export default AuthMiddlewares;