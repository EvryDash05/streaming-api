import { BaseResponse } from "../infrastructure/models/response/common/baseResponse.js";
import { ErrorResponse } from "../infrastructure/models/response/common/errorReponse.js";

export function buildResponse<T>(message: string, data: T): BaseResponse<T> {
    return { message, data };
}

export function buildErrorResponse(message: string, details?: any): ErrorResponse {
    return { message, details };
}

export function buildHttpResponse<T>(
    statusCode: number,
    body: BaseResponse<T> | ErrorResponse
) {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    };
}