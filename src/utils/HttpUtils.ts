import { BaseResponse } from "../infrastructure/models/response/common/baseResponse";

export interface LambdaResponse<T = any> {
    statusCode: number;
    body: string | T;
    headers?: Record<string, string>;
}


export function buildHttpResponse<T = unknown>(
    statusCode: number,
    body: BaseResponse<T>
): LambdaResponse {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    };
}