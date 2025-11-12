import middy from "@middy/core";
import VideosBusiness from "../../../../application/business/VideosBusiness";
import VideoRepository from "../../../../domain/repository/VideoRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import { APIGatewayProxyEvent } from "aws-lambda";
import loggerMessage from "../../../../utils/logger";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";

const videoRepository: VideoRepository = new VideoRepository();

export async function findVideoById(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const videoId = Number(event.pathParameters?.videoId);
    loggerMessage.debug('Received video ID: ' + videoId);
    const response = await new VideosBusiness(videoRepository).findVideoById(videoId);
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(findVideoById)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['USER', 'PRODUCER']))
    .use(AuthMiddlewares.cheackPermissions(['VIEW_CONTENT']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());