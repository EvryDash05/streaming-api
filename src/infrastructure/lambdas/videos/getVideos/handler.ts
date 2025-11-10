import middy from "@middy/core";
import VideosBusiness from "../../../../application/business/VideosBusiness";
import VideoRepository from "../../../../domain/repository/VideoRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";

const videoRepository: VideoRepository = new VideoRepository();

export async function saveVideoHandler(): Promise<LambdaResponse> {
    const response = await new VideosBusiness(videoRepository).findAllVideos();
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(saveVideoHandler)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['USER', 'PRODUCER']))
    .use(AuthMiddlewares.cheackPermissions(['VIEW_CONTENT']));