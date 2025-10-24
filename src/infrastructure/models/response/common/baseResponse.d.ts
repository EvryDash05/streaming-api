export interface BaseResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T | T[] | null;
    errors?: string | string[] | Record<string, any> | null;
}
