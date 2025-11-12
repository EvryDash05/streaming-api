import { get } from "http";
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

export const getCorsHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
    'Content-Type': 'application/json'
});

export function buildLambdaResponse<T = unknown>(
    statusCode: number,
    body: BaseResponse<T>
): LambdaResponse {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: getCorsHeaders()
    };
}