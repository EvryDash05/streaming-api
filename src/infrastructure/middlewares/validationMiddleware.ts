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

