import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import { AuthBusiness } from "../../../../application/business/AuthBusiness";
import { AuthorityRepository } from "../../../../domain/repository/AuthorityRepository";
import { UserRepository } from "../../../../domain/repository/userRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import { jsonBodyParser } from "../../../middlewares/parsingMiddleware";
import { zodValidator } from "../../../middlewares/validationMiddleware";
import { AuthLoginRequest } from "../../../models/request/auth/AuthLoginRequest";

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