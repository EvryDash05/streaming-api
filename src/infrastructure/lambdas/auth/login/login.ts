import { APIGatewayProxyEvent } from "aws-lambda";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import middy from "@middy/core";
import { AuthLoginRequest } from "../../../models/request/auth/AuthLoginRequest";
import { AuthBusiness } from "../../../../application/business/AuthBusiness";
import { UserRepository } from "../../../../domain/repository/userRepository";
import { AuthorityRepository } from "../../../../domain/repository/AuthorityRepository";
import { jsonBodyParser } from "../../../middlewares/parsingMiddleware";
import { zodValidator } from "../../../middlewares/validationMiddleware";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";

/* Dependencies */
const userRepository = new UserRepository();
const authorityRepository = new AuthorityRepository();

export async function loginHandler(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const response = await new AuthBusiness(userRepository, authorityRepository).authenticate(event.body as unknown as AuthLoginRequest);
    return buildLambdaResponse(response.statusCode, response);
}


export const handler = middy(loginHandler)
    .use(jsonBodyParser())
    .use(zodValidator(AuthLoginRequest.validateSchema()))
    .use(errorHandlerMiddleware());