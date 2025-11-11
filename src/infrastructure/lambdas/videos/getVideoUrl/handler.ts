import middy from "@middy/core";
import S3Business from "../../../../application/business/S3Business";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import { APIGatewayProxyEvent } from "aws-lambda";
import loggerMessage from "../../../../utils/logger";

export async function generatePresignedGetVideoUrl(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const queryParams = event.queryStringParameters || {};
    const { path } = queryParams;
    loggerMessage.debug(`Received request to generate presigned URL for path: ${path}`);
    const response = await new S3Business().generatePresignedGetVideoUrl(
        path || "",
        36000
    );
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(generatePresignedGetVideoUrl)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['PRODUCER']))
    .use(AuthMiddlewares.cheackPermissions(['UPLOAD_VIDEO']))
    .use(errorHandlerMiddleware());
