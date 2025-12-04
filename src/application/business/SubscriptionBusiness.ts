import { SubscriptionEntity } from "../../domain/entity/SubscriptionsEntity";
import { PlanRepositoryInterface } from "../../domain/repository/interfaces/PlanRepositoryInterface";
import { SubscriptionRepositoryInterface } from "../../domain/repository/interfaces/SubscriptionRepositoryInterface";
import { UserRepositoryInterface } from "../../domain/repository/interfaces/UserRepositoryInterface";
import { BusinessError } from "../../infrastructure/exceptions/Exceptions";
import { SubscriptionRequest } from "../../infrastructure/models/request/SubscriptionRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { CreateSubscriptionResponse } from "../../infrastructure/models/response/CreateSubscriptionRespons";
import { successResponse } from "../../utils/HttpUtils";
import loggerMessage from "../../utils/logger";
import { SubscriptionService } from "../service/SubscriptionService";


export class SubscriptionBusiness implements SubscriptionService {

    private readonly subscriptionRepository: SubscriptionRepositoryInterface;
    private readonly userRepository: UserRepositoryInterface;
    private readonly planRepository: PlanRepositoryInterface;

    constructor(
        subscriptionRepository: SubscriptionRepositoryInterface,
        userRepository: UserRepositoryInterface,
        planRepository: PlanRepositoryInterface
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    async subscribe(request: SubscriptionRequest): Promise<BaseResponse<CreateSubscriptionResponse>> {
        loggerMessage.info('Starting subscription process');

        const user = await this.userRepository.findById(request.userId);

        loggerMessage.info('Finding user by id');

        if (!user) {
            throw new BusinessError('Usuario no encontrado');
        }

        loggerMessage.info('Finding plan by id');
        const plan = await this.planRepository.findById(request.planId);
        
        if (!plan || !plan.is_active) {
            throw new BusinessError('El plan no existe o no está disponible');
        }

        loggerMessage.info('Finding active susbcription for user');
        const activeSubscription = await this.subscriptionRepository.findActiveByUserId(user.id!);

        if (activeSubscription) {
            throw new BusinessError('Ya tienes una suscripción activa');
        }

        const subscriptionEntity: SubscriptionEntity = this.mapToEntity(request);

        loggerMessage.info('Saving subscription');
        const subscriptionId = await this.subscriptionRepository.save(subscriptionEntity);

        loggerMessage.info('Subscription created successfully');

        return successResponse<CreateSubscriptionResponse>(
            'Suscripción creada con éxito',
            {
                subscriptionId,
                status: 'active'
            },
            201
        );
    }

    private mapToEntity(request: SubscriptionRequest): SubscriptionEntity {
        return {
            user_id: request.userId,
            plan_id: request.planId,
            status: 'active',
            created_by: 'system'
        };
    }

}