import middy from "@middy/core";
import S3Business from "../../../../application/business/S3Business";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";

export async function generatePresignedUrlHandler(): Promise<LambdaResponse> {
    const response = await new S3Business().generatePresignedUploadVideoUrl(
        `videos/${crypto.randomUUID()}.mp4`,
        3000
    );
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(generatePresignedUrlHandler)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['PRODUCER']))
    .use(AuthMiddlewares.cheackPermissions(['UPLOAD_VIDEO']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());
