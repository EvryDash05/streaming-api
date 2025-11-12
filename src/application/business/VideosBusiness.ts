import { VIDEO_ERRORS } from "../../constants/errors/errorsConstants";
import { VideoEntity } from "../../domain/entity/VideosEntity";
import { VideoRepositoryInterface } from "../../domain/repository/interfaces/VideoRepositoryInterface";
import VideoRequest from "../../infrastructure/models/request/VideoRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { VideoResponse } from "../../infrastructure/models/response/VideoRespose";
import { handleBusinessOperation } from "../../utils/errorHandler";
import { successResponse } from "../../utils/HttpUtils";
import loggerMessage from "../../utils/logger";
import { VideosService } from "../service/VideosService";
import { BusinessError } from "../../infrastructure/exceptions/Exceptions";
import { ProducerRepository } from "../../domain/repository/ProducerRepository";

class VideosBusiness implements VideosService {

    private readonly videoRepository: VideoRepositoryInterface;
    private readonly producerRepository: ProducerRepository = new ProducerRepository();

    public constructor(
        videoRepository: VideoRepositoryInterface,
    ) {
        this.videoRepository = videoRepository;
    }

    async saveVideo(request: VideoRequest, producerId: number): Promise<BaseResponse<number>> {

        const { id } = await this.producerRepository.findByUserId(producerId);

        console.log('Producer ID found:', id);

        if (!id) {
            throw new BusinessError('Productor no encontrado', {
                detail: 'No existe un productor con el ID proporcionado'
            }, 404);
        }

        const entity = this.mapToEntity(request, id);
        const videoId = await handleBusinessOperation(
            async () => await this.videoRepository.save(entity),
            VIDEO_ERRORS.SAVE
        )

        loggerMessage.info('Video saved with ID: ' + videoId);
        return successResponse<number>('Video guardado con éxito', videoId, 201);
    }

    async findVideoById(id: number): Promise<BaseResponse<VideoResponse>> {
        loggerMessage.info(`Find video by ID: ${id}`);

        const response = await handleBusinessOperation(
            async () => await this.videoRepository.findById(id),
            VIDEO_ERRORS.FIND_BY_ID
        )

        if (!response) {
            throw new BusinessError('Video no encontrado', {
                detail: 'No existe un video con el ID proporcionado'
            }, 404);
        }

        const videoResponse = this.mapToResponse(response!);
        return successResponse<VideoResponse>('Video encontrado', videoResponse, 200);
    }

    deleteVideoById(id: number): Promise<BaseResponse<boolean>> {
        throw new Error("Method not implemented.");
    }

    async findAllVideos(): Promise<BaseResponse<VideoResponse[]>> {
        const videos = await handleBusinessOperation(
            async () => await this.videoRepository.findAll(),
            VIDEO_ERRORS.FIND_ALL
        )

        if (videos.length === 0) {
            loggerMessage.info('No videos found');
            return successResponse<VideoResponse[]>('No se encontraron videos', [], 200);
        }

        const videosResponses = videos.map(video => this.mapToResponse(video));
        return successResponse<VideoResponse[]>('Videos obtenidos correctamente', videosResponses, 200);
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
            producerId: entity.producer_id,
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