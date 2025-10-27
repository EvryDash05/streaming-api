import en from "zod/v4/locales/en.cjs";
import prisma from "../../infrastructure/database/prismaClient";
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

        const response = await prisma.producers.create({
            data: {
                user_id,
                institution_name,
                description,
                contact_email,
                contact_phone,
            },
            select: { id: true }
        })

        return response.id;
    }

    update(entity: ProducerRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}