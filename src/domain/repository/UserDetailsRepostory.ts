import databaseClient from "../../infrastructure/config/database/databaseClient";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import { UserDetailsEntity } from "../entity/UserDetailsEntity";
import UserDetailsRepositoryInterface from "./interfaces/UserDetailsRepositoryInterface";
import { FIND_USER_DETAILS_BY_USER_ID_QUERY } from "./queries/userDetailsRepository.queries";

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
        const client = await (databaseClient as any).pool.connect();
        try {
            const userResult = await client.query(
                FIND_USER_DETAILS_BY_USER_ID_QUERY,
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
        } catch (error: any) {
            throw DatabaseErrorHelper.translate(error);
        } finally {
            client.release();
        }
    }

}