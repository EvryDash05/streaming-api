import databaseClient from "../../infrastructure/config/database/databaseClient";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import { SubscriptionEntity } from "../entity/SubscriptionsEntity";
import { SubscriptionRepositoryInterface } from "./interfaces/SubscriptionRepositoryInterface";
import { FIND_ACTIVE_SUBSCRIPTION_QUERY, SAVE_SUBSCRIPTION_QUERY } from "./queries/subscriptionRepository.queries";

export class SubscriptionRepository implements SubscriptionRepositoryInterface {

    async findActiveByUserId(userId: number): Promise<SubscriptionEntity | null> {
        try {
            const result = await databaseClient.query<SubscriptionEntity>(
                FIND_ACTIVE_SUBSCRIPTION_QUERY,
                [userId]
            );

            if (result.rows.length === 0) return null;

            return result.rows[0]!;
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);
        }
    }

    findById(id: number): Promise<SubscriptionEntity | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<SubscriptionEntity[]> {
        throw new Error("Method not implemented.");
    }

    async save(entity: SubscriptionEntity): Promise<number> {
        try {
            const { user_id, plan_id, status, created_by } = entity;

            const result = await databaseClient.query<{ id: number }>(
                SAVE_SUBSCRIPTION_QUERY,
                [
                    user_id,
                    plan_id,
                    status,
                    created_by
                ]
            );

            return result.rows[0]!.id;
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);
        }
    }

    update(entity: SubscriptionEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}