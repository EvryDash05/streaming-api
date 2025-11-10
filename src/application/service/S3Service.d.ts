import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";

interface S3Service {
    getAllFilesFrom(path: string): Promise<BaseResponse<string[]>>;
    generatePresignedUrl(bucket: string, key: string, expiresInSeconds?: number): Promise<BaseResponse<{
        presignedUrl: string;
    }>>;
}

export default S3Service;