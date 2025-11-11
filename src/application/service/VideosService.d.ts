import VideoRequest from "../../infrastructure/models/request/VideoRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { VideoResponse } from "../../infrastructure/models/response/VideoRespose";

export interface VideosService {
    saveVideo(request: VideoRequest, producerId: number): Promise<BaseResponse<number>>;
    findVideoById(id: number): Promise<BaseResponse<VideoResponse>>;
    deleteVideoById(id: number): Promise<BaseResponse<boolean>>;
    findAllVideos(): Promise<BaseResponse<VideoResponse[]>>;
    getVideoUrl(id: number): Promise<BaseResponse<string>>;
}
