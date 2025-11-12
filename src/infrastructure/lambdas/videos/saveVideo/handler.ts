import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import VideosBusiness from "../../../../application/business/VideosBusiness";
import VideoRepository from "../../../../domain/repository/VideoRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import { jsonBodyParser } from "../../../middlewares/parsingMiddleware";
import { zodValidator } from "../../../middlewares/validationMiddleware";
import VideoRequest from "../../../models/request/VideoRequest";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";

const videoRepository: VideoRepository = new VideoRepository();

export async function saveVideoHandler(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const response = await new VideosBusiness(videoRepository).saveVideo(
        event.body as unknown as VideoRequest,  // Request body
        Number(event.requestContext.authorizer?.jwt.sub) // Producer ID
    );
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(saveVideoHandler)
    .use(jsonBodyParser())
    .use(zodValidator(VideoRequest.validateSchema()))
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['PRODUCER']))
    .use(AuthMiddlewares.cheackPermissions(['UPLOAD_VIDEO']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());