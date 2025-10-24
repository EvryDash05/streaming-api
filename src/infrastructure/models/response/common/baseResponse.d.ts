export interface BaseResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string | string[] | Record<string, any>;
    statusCode: number;
}
