import { MiddlewareObj } from "@middy/core";
import { getCorsHeaders } from "../../utils/HttpUtils";

/**
 * Middleware que asegura que TODAS las respuestas tengan headers CORS
 * Incluso si algún otro middleware los sobrescribe accidentalmente
 */
export function corsMiddleware(): MiddlewareObj {
    return {
        after: async (request: any) => {
            if (request.response) {
                request.response.headers = {
                    ...request.response.headers,
                    ...getCorsHeaders()
                };
            }
        },

        onError: async (request: any) => {
            // Este se ejecuta DESPUÉS del errorHandlerMiddleware
            // Solo como seguridad adicional
            if (request.response && request.response.headers) {
                request.response.headers = {
                    ...request.response.headers,
                    ...getCorsHeaders()
                };
            }
        }
    };
}