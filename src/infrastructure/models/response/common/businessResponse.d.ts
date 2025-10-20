
export interface BussinessReponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
