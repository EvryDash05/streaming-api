import { PlanRepositoryInterface } from "../../domain/repository/interfaces/PlanRepositoryInterface";
import { UserRepositoryInterface } from "../../domain/repository/interfaces/UserRepositoryInterface";
import { preferenceClient } from "../../infrastructure/config/payment/MercadoPagoConfig";
import { BusinessError } from "../../infrastructure/exceptions/Exceptions";
import { SubscriptionRequest } from "../../infrastructure/models/request/SubscriptionRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { successResponse } from "../../utils/HttpUtils";
import { PaymentPreferenceResult, PaymentService } from "../service/PaymentService";

export class PaymentBusiness implements PaymentService {

    private readonly userRepository: UserRepositoryInterface;
    private readonly planRepository: PlanRepositoryInterface;

    constructor(
        userRepository: UserRepositoryInterface,
        planRepository: PlanRepositoryInterface
    ) {
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    async createPaymentPreference(request: SubscriptionRequest): Promise<BaseResponse<PaymentPreferenceResult>> {

        const { userId, planId } = request;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new BusinessError("Error al buscar el usuario", { detail: `El usuario con ID ${userId} no fue encontrado` }, 404);
        }

        const plan = await this.planRepository.findById(planId);

        if (!plan) {
            throw new BusinessError("Error al buscar el plan", { detail: `El plan con ID ${planId} no fue encontrado` }, 404);
        }

        const result = await preferenceClient.create({
            body: {
                items: [
                    {
                        id: `PLAN_${planId}`,
                        title: `Plan ${plan.name}`,
                        description: plan.description || `Suscripción a ${plan.name}`,
                        quantity: 1,
                        currency_id: 'PEN',
                        unit_price: Number(plan.price)
                    }
                ]
            }
        });

        return successResponse<PaymentPreferenceResult>(
            'Referencia de pago creada con éxito',
            {
                id: result.id!,
                initPoint: result.init_point!,
                sandboxInitPoint: result.sandbox_init_point!
            },
            201
        );
    }

}