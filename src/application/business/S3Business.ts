import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Singleton from "../../infrastructure/config/aws/S3/S3Client";
import { BusinessError } from "../../infrastructure/exceptions/Exceptions";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { successResponse } from "../../utils/HttpUtils";
import loggerMessage from "../../utils/logger";
import S3Service from "../service/S3Service";

class S3Business implements S3Service {

    getAllFilesFrom(path: string): Promise<BaseResponse<string[]>> {
        throw new Error("Method not implemented.");
    }

    async generatePresignedUrl(bucket: string, key: string, expiresInSeconds: number): Promise<BaseResponse<{
        presignedUrl: string;
        path: string;
    }>> {
        try {
            const command = new PutObjectCommand({ Bucket: bucket, Key: key });
            const token = await getSignedUrl(S3Singleton.getInstance(), command, { expiresIn: expiresInSeconds });

            loggerMessage.info(`Presigned URL generated for key: ${key}`);
            return successResponse("Token prefirmado generado correctamente", { presignedUrl: token, path: key }, 200);
        } catch (error: any) {
            loggerMessage.error(`Error generating presigned URL for key: ${key} - ${error.message}`);
            throw new BusinessError("Error al generar el token prefirmado", error.message, 500);
        }
    }

}

export default S3Business;