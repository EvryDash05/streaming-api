import databaseClient from "../../infrastructure/config/database/databaseClient";
import { ProducerRequest } from "../../infrastructure/models/request/ProducerRequest";
import { Repository } from "./interfaces/Repository";


export class ProducerRepository implements Repository<ProducerRequest, number> {

    findById(id: number): Promise<ProducerRequest | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<ProducerRequest[]> {
        throw new Error("Method not implemented.");
    }

    async save(entity: ProducerRequest): Promise<number> {
        const { user_id, institution_name, description, contact_email, contact_phone } = entity;

        const result = await databaseClient.query<{ id: number }>(
            'INSERT INTO producers (user_id, institution_name, description, contact_email, contact_phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [user_id, institution_name ?? null, description ?? null, contact_email ?? null, contact_phone ?? null]
        );

        if (result.rows.length === 0) {
            throw new Error("No se pudo crear el productor");
        }

        return result.rows[0]!.id;
    }

    update(entity: ProducerRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}