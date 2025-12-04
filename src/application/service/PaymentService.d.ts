import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";

export interface PaymentPreferenceResult {
    id: string;
    initPoint: string;
    sandboxInitPoint?: string;
}

export interface PaymentService {
    createPaymentPreference(request: SubscriptionRequest): Promise<BaseResponse<PaymentPreferenceResult>>;
}