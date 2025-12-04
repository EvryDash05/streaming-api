import { PlanEntity } from "../../domain/entity/PlanEntity";
import { PlanRepositoryInterface } from "../../domain/repository/interfaces/PlanRepositoryInterface";
import { BusinessError } from "../../infrastructure/exceptions/Exceptions";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { PlanResponse } from "../../infrastructure/models/response/PlanResponse";
import { successResponse } from "../../utils/HttpUtils";
import { PlanService } from "../service/PlanService";

export class PlanBusiness implements PlanService {

    private readonly planRepository: PlanRepositoryInterface;

    constructor(
        planRepository: PlanRepositoryInterface
    ) {
        this.planRepository = planRepository;
    }

    async getAllPlans(): Promise<BaseResponse<PlanResponse[]>> {
        const plans = await this.planRepository.findAll();
    
        if(plans.length === 0) {
            throw new BusinessError('No se encontraron planes disponibles', {details: 'La base de datos no contiene planes'}, 404);
        }
    
        const plansResponse = plans.map(this.mapToResponse);

        return successResponse<PlanResponse[]>(
            'Planes obtenidos con éxito',
            plansResponse,
            200
        );
    }

    private mapToResponse(plan: PlanEntity): PlanResponse {
        return {
            id: plan.id,
            name: plan.name,
            description: plan.description!,
            price: plan.price
        };
    }

}