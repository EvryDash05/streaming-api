import { errors } from "jose";
import { int, success } from "zod";

export interface HandlerBodyResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
}

export interface HandlerResponse {
    statusCode: number;
    body: HandlerBodyResponse<any> | string;
}