import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import { UserDetailsBusiness } from "../../../../application/business/UserDetailsBusiness";
import { UserDetailsRespository } from "../../../../domain/repository/UserDetailsRepostory";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";

const userRepository = new UserDetailsRespository();

export async function findUserDetailByUserIdhandler(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const userId = Number(event.requestContext.authorizer?.jwt.sub);
    const response = await new UserDetailsBusiness(userRepository).findById(userId);
    return buildLambdaResponse(response.statusCode, response);
}


export const handler = middy(findUserDetailByUserIdhandler)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['USER', 'ADMIN', 'PRODUCER']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());
