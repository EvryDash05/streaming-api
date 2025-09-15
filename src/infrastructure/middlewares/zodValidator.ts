import { MiddlewareObj } from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodTypeAny } from "zod";
import { HttpError } from "../exceptions/BadRequestException.js";

export function zodValidator(schema: ZodTypeAny): MiddlewareObj<
    APIGatewayEvent,
    APIGatewayProxyResult
> {
    return {
        before: async (request: any): Promise<void> => {
            const parsed = schema.safeParse(request.event.body);

            if (!parsed.success) {
                console.error(parsed.error)
                const badFields = parsed.error.issues.map(err => ({
                    field: err.path.length === 1 ? err.path[0] : err,
                    error_message: err.message
                }))

                throw new HttpError(400, 'Bad request', badFields);
            }

        }
    };
}

export function jsonBodyParser() {
    return {
        before: async (request: any) => {
            const { body } = request.event;
            console.log("Body: ", body);
            try {
                request.event.body = JSON.parse(request.event.body);
            } catch {
                throw new HttpError(400, "Cuerpo inválido, no es JSON válido", {
                    receivedBody: body,
                    expectedFormat: "JSON"
                });
            }
        },
    };
};

export function errorHandlingMiddleware() {
    return {
        onError: async (request: any) => {
            const { error } = request;

            console.error(error);

            if (error instanceof HttpError) {
                request.response = {
                    statusCode: request.error.statusCode,
                    body: JSON.stringify({
                        message: request.error.message,
                        details: request.error.details
                    })
                }
            }

        }
    }
}

