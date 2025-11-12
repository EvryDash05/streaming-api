import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import 'dotenv/config';
import { AuthBusiness } from "../../../../application/business/AuthBusiness";
import { UserRepository } from '../../../../domain/repository/userRepository';
import { buildLambdaResponse, LambdaResponse } from '../../../../utils/HttpUtils';
import { AuthRegisterRequest } from "../../../models/request/auth/AuthRegisterRequest";
import { AuthorityRepository } from "../../../../domain/repository/AuthorityRepository";
import { jsonBodyParser } from "../../../middlewares/parsingMiddleware";
import { zodValidator } from "../../../middlewares/validationMiddleware";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";

/* Dependencies */
const userRepository = new UserRepository();
const authorityRepository = new AuthorityRepository();

export async function registerUserHandler(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const response = await new AuthBusiness(userRepository, authorityRepository).register(event.body as unknown as AuthRegisterRequest);
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(registerUserHandler)
    .use(jsonBodyParser())
    .use(zodValidator(AuthRegisterRequest.validateSchema()))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());
