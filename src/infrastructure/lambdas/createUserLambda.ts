import { APIGatewayProxyEvent, APIGatewayProxyResult, AuthResponse } from "aws-lambda";
import { UserBusiness } from "../../application/business/UserBusiness.js";
import { buildHttpResponse, buildResponse } from "../../utils/HttpUtils.js";
import { BaseResponse } from "../models/response/common/baseResponse.js";
import middy from "@middy/core";
import { errorHandlingMiddleware, jsonBodyParser, zodValidator } from "../middlewares/zodValidator.js";
import { AuthLoginRequest } from "../models/request/AuthLoginRequest.js";


export const createUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = event.body as unknown as AuthLoginRequest;
    const { password, email } = body;

    const response = await new UserBusiness().createUser({ email, password });

    return buildHttpResponse<BaseResponse<AuthResponse>>(201, buildResponse('Login success', response));
}

export const handler = middy(createUserHandler)
    .use(jsonBodyParser())
    .use(zodValidator(AuthLoginRequest.schema()))
    .use(errorHandlingMiddleware())
