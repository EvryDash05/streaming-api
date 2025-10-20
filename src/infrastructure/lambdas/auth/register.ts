import 'dotenv/config';
import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import { errorHandlingMiddleware, jsonBodyParser, zodValidator } from "../../middlewares/zodValidator";
import { AuthBusiness } from "../../../application/business/AuthBusiness";
import { AuthRegisterRequest } from "../../models/request/auth/AuthRegisterRequest";

export async function registerUserHandler(
    event: APIGatewayProxyEvent
): Promise<any> {
    const response = await new AuthBusiness().register(event.body as unknown as AuthRegisterRequest);
    return {
        statusCode: response.success ? 201 : 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
    };
}

export const handler = middy(registerUserHandler)
    .use(jsonBodyParser())
    .use(zodValidator(AuthRegisterRequest.validateSchema()))
    .use(errorHandlingMiddleware())