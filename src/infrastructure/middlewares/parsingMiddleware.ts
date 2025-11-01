import { MiddlewareObj } from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpError } from "../exceptions/BadRequestException.js";
import logger from "../../utils/logger.js";

export function jsonBodyParser(): MiddlewareObj<
    APIGatewayEvent,
    APIGatewayProxyResult
> {
    return {
        before: async (request: any) => {
            const { body } = request.event;
            logger.info("Body: ", body);
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