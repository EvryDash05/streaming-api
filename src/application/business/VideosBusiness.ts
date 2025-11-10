import { VideoEntity } from "../../domain/entity/VideosEntity";
import { VideoRepositoryInterface } from "../../domain/repository/interfaces/VideoRepositoryInterface";
import VideoRequest from "../../infrastructure/models/request/VideoRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { VideoResponse } from "../../infrastructure/models/response/VideoRespose";
import { errorResponse, successResponse } from "../../utils/HttpUtils";
import loggerMessage from "../../utils/logger";
import { VideosService } from "../service/VideosService";

class VideosBusiness implements VideosService {

    private readonly videoRepository: VideoRepositoryInterface;

    public constructor(
        videoRepository: VideoRepositoryInterface,
    ) {
        this.videoRepository = videoRepository;
    }

    async saveVideo(request: VideoRequest, producerId: number): Promise<BaseResponse<number>> {
        try {
            loggerMessage.info('Saving video for producer ID: ' + request);

            const entity = this.mapToEntity(request, producerId);
            const videoId = await this.videoRepository.save(entity);

            loggerMessage.info('Video saved with ID: ' + videoId);
            return successResponse<number>('Video guardado con éxito', videoId, 201);
        } catch (error: Error | any) {
            loggerMessage.error('Error saving video: ' + error.message);
            return errorResponse('Error al guardar el video', {
                message: error.message
            }, 500);
        }
    }

    findVideoById(id: number): Promise<BaseResponse<string>> {
        throw new Error("Method not implemented.");
    }

    deleteVideoById(id: number): Promise<BaseResponse<boolean>> {
        throw new Error("Method not implemented.");
    }

    async findAllVideos(): Promise<BaseResponse<VideoResponse[]>> {
        try {
            loggerMessage.info('Finding all videos');

            const videos = await this.videoRepository.findAll();

            const videosResponses = videos.map(video => this.mapToResponse(video));
            return successResponse<VideoResponse[]>('Videos retrieved successfully', videosResponses, 200);
        } catch (error) {
            return errorResponse('Error retrieving videos', {
                message: (error as Error).message
            }, 500);
        }
    }

    private mapToEntity(request: VideoRequest, producerId: number): VideoEntity {
        return {
            producer_id: producerId,
            title: request.title,
            description: request.description,
            url: request.url,
            duration: request.duration,
            category: request.category,
            created_by: producerId.toString(),
        }
    }

    private mapToResponse(entity: VideoEntity): VideoResponse {
        return {
            id: entity.id!,
            producer_id: entity.producer_id,
            title: entity.title,
            description: entity.description!,
            url: entity.url,
            duration: entity.duration!,
            category: entity.category!,
            views: entity.views!,
            likes: entity.likes!,
            dislikes: entity.dislikes!,
        }
    }

}

export default VideosBusiness;