import { PlanResponse } from "../../infrastructure/models/response/PlanResponse";

export interface PlanService {
    getAllPlans(): Promise<BaseResponse<PlanResponse[]>>;    
}