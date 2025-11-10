import middy from "@middy/core";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import { APIGatewayProxyEvent } from "aws-lambda";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import S3Business from "../../../../application/business/S3Business";
import logger from "../../../../utils/logger";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";

export async function generatePresignedUrlHandler(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    logger.info(`Role IAM: ` + process.env.LAMBDA_EXECUTION_ROLE!);
    const response = await new S3Business().generatePresignedUrl(
        process.env.S3_VIDEOS_BUCKET!,
        `videos/${crypto.randomUUID()}.mp4`,
        3000
    );
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(generatePresignedUrlHandler)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['PRODUCER']))
    .use(AuthMiddlewares.cheackPermissions(['UPLOAD_VIDEO']))
    .use(errorHandlerMiddleware());
