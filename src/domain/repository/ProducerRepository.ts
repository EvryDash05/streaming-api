import { ca } from "zod/v4/locales";
import databaseClient from "../../infrastructure/config/database/databaseClient";
import { ProducerRequest } from "../../infrastructure/models/request/ProducerRequest";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import { Repository } from "./interfaces/Repository";
import { FIND_PRODUCER_BY_USER_ID_QUERY, SAVE_PRODUCER_QUERY } from "./queries/producerRepository.queries";
import loggerMessage from "../../utils/logger";

export class ProducerRepository implements Repository<ProducerRequest, number> {

    findById(id: number): Promise<ProducerRequest | null> {
        /* try {
            const { user_id, institution_name, description, contact_email, contact_phone } = entity;

            const result = await databaseClient.query<{ id: number }>(
                SAVE_PRODUCER_QUERY,
                [user_id, institution_name ?? null, description ?? null, contact_email ?? null, contact_phone ?? null]
            );

            return result.rows[0]!.id;
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);

        } */
       throw new Error("Method not implemented.");
    }

    findAll(): Promise<ProducerRequest[]> {
        throw new Error("Method not implemented.");
    }

    async save(entity: ProducerRequest): Promise<number> {
        try {
            const { user_id, institution_name, description, contact_email, contact_phone } = entity;

            const result = await databaseClient.query<{ id: number }>(
                SAVE_PRODUCER_QUERY,
                [user_id, institution_name ?? null, description ?? null, contact_email ?? null, contact_phone ?? null]
            );

            return result.rows[0]!.id;
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);

        }
    }

    update(entity: ProducerRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findByUserId(userId: number): Promise<any | null> {
        try {
            const result = await databaseClient.query<any>(
                FIND_PRODUCER_BY_USER_ID_QUERY,
                [userId]
            );

            loggerMessage.info(`Producer found for user ID: ${userId} - ${JSON.stringify(result.rows[0])}`);

            return result.rows[0] || null;
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);
        }
    }

}