import { SubscriptionRequest } from "../../infrastructure/models/request/SubscriptionRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { CreateSubscriptionResponse } from "../../infrastructure/models/response/CreateSubscriptionRespons";

export interface SubscriptionService {
    subscribe(request: SubscriptionRequest): Promise<BaseResponse<CreateSubscriptionResponse>>;
}