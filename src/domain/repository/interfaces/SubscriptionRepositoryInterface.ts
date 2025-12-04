import { SubscriptionEntity } from "../../entity/SubscriptionsEntity";
import { Repository } from "./Repository";

export interface SubscriptionRepositoryInterface extends Repository<SubscriptionEntity, number> {
    findActiveByUserId(userId: number): Promise<SubscriptionEntity | null>;
}