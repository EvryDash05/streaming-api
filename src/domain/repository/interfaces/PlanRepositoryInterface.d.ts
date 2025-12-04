import { PlanEntity } from "../../entity/PlanEntity";
import { Repository } from "./Repository";
import SubscriptionRepositoryInterface from "./SubscriptionRepositoryInterface";

export interface PlanRepositoryInterface extends Repository<PlanEntity, number> {
}