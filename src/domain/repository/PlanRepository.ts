import databaseClient from "../../infrastructure/config/database/databaseClient";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import { PlanEntity } from "../entity/PlanEntity";
import { PlanRepositoryInterface } from "./interfaces/PlanRepositoryInterface";
import { FIND_PLAN_BY_ID_QUERY } from "./queries/planRepository.queriest";

export class PlanRepository implements PlanRepositoryInterface {

    async findById(id: number): Promise<PlanEntity | null> {
        try {
            const result = await databaseClient.query<PlanEntity>(
                FIND_PLAN_BY_ID_QUERY,
                [id]
            );

            if (result.rows.length === 0) return null;

            return result.rows[0]!;
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);
        }
    }

    findAll(): Promise<PlanEntity[]> {
        throw new Error("Method not implemented.");
    }

    save(entity: PlanEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }

    update(entity: PlanEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}