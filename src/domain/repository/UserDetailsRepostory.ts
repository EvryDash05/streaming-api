import databaseClient from "../../infrastructure/config/database/databaseClient";
import { UserDetailsEntity } from "../entity/UserDetailsEntity";
import UserDetailsRepositoryInterface from "./interfaces/UserDetailsRepositoryInterface";

export class UserDetailsRespository implements UserDetailsRepositoryInterface {

    findById(id: number): Promise<UserDetailsEntity | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<UserDetailsEntity[]> {
        throw new Error("Method not implemented.");
    }

    save(entity: UserDetailsEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }

    update(entity: UserDetailsEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findUserDetailsByUserId(userId: number): Promise<UserDetailsEntity | null> {
        const client = await(databaseClient as any).pool.connect();
        try {
            const userResult = await client.query(
                `SELECT
                    id,
                    user_id AS "userId",
                    full_name AS "fullName",
                    phone_number AS "phoneNumber",
                    country,
                    preferred_language AS "preferredLanguage"
                FROM user_details
                WHERE user_id = $1;`,
                [userId]
            )

            if (userResult.rows.length === 0) return null;

            const row = userResult.rows[0];

            return {
                id: row.id,
                userId: row.userId,
                fullName: row.fullName,
                phoneNumber: row.phoneNumber,
                country: row.country,
                preferredLanguage: row.preferredLanguage
            }
        } catch (err: any) {
            throw new Error(`Error al encontrar el usuario con id: ${userId}`);
        } finally {
            client.release();
        }
    }

}