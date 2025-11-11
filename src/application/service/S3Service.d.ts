import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";

interface S3Service {
    getAllFilesFrom(path: string): Promise<BaseResponse<string[]>>;
    generatePresignedUploadVideoUrl(key: string, expiresInSeconds?: number): Promise<BaseResponse<{
        presignedUrl: string;
    }>>;
    generatePresignedGetVideoUrl(key: string, expiresInSeconds?: number): Promise<BaseResponse<{
        presignedUrl: string;
    }>>;
}

export default S3Service;