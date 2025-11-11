import { BaseResponse } from "../infrastructure/models/response/common/baseResponse";

export interface LambdaResponse<T = any> {
    statusCode: number;
    body: string | T;
    headers?: Record<string, string>;
}

export function successResponse<T = unknown>(
    message: string,
    data?: T | T[] | null,
    statusCode = 200
): BaseResponse<T> {
    return {
        success: true,
        statusCode,
        message,
        data: data ?? null,
        errors: null
    };
}

export function errorResponse<T = unknown>(
    message: string,
    errors?: string | string[] | Record<string, any> | null,
    statusCode = 400
): BaseResponse<T> {
    return {
        success: false,
        statusCode,
        message,
        data: null,
        errors: errors ?? null
    };
}

export function buildLambdaResponse<T = unknown>(
    statusCode: number,
    body: BaseResponse<T>
): LambdaResponse {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    };
}