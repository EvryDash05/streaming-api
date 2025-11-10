import { MiddlewareObj } from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { BusinessError } from "../exceptions/Exceptions.js";

export function jsonBodyParser(): MiddlewareObj<
    APIGatewayEvent,
    APIGatewayProxyResult
> {
    return {
        before: async (request: any) => {
            try {
                request.event.body = JSON.parse(request.event.body);
            } catch {
                throw new BusinessError("InvalidBody", { detail: "El cuerpo de la solicitud no es un JSON válido" });
            }
        },
    };
};  