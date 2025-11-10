import bycript from "bcryptjs";
import databaseClient from "../../infrastructure/config/database/databaseClient";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import logger from "../../utils/logger";
import { UserEntity } from "../entity/UsersEntity";
import { UserRepositoryInterface, UserRow } from "./interfaces/UserRepositoryInterface";
import { FIND_USER_BY_EMAIL_QUERY, INSERT_PRODUCER_QUERY, INSERT_USER_DETAILS_QUERY, INSERT_USER_QUERY, INSERT_USER_ROLE_QUERY } from "./queries/userRepository.queries";

export class UserRepository implements UserRepositoryInterface {

    async findById(id: number): Promise<UserEntity | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    async save(entity: UserEntity): Promise<number> {
        const { email, passwordHash: password_hash, fullName, country, phoneNumber, preferredLanguage, role } = entity;
        const roleId = role === "PRODUCER" ? 2 : 1;

        const client = await (databaseClient as any).pool.connect();
        try {
            await client.query("BEGIN");

            const userResult = await client.query(INSERT_USER_QUERY,
                [email, password_hash, role]
            );
            const userId = userResult.rows[0].id;

            await client.query(INSERT_USER_ROLE_QUERY,
                [userId, roleId]
            );

            await client.query(INSERT_USER_DETAILS_QUERY,
                [userId, fullName ?? null, country ?? null, phoneNumber ?? null, preferredLanguage ?? null]
            );

            if (role === "PRODUCER" && entity.producer) {
                const { institutionName, description, contactEmail, contactPhone } = entity.producer;

                await client.query(
                    INSERT_PRODUCER_QUERY,
                    [userId, institutionName ?? null, description ?? null, contactEmail ?? null, contactPhone ?? null]
                );
            }

            
            await client.query("COMMIT");
            return userId;
        } catch (err) {
            await client.query("ROLLBACK");
            throw DatabaseErrorHelper.translate(err);
        } finally {
            client.release();
        }
    }

    async update(entity: UserEntity): Promise<void> {
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findUserByEmailAndPassword(email: string, password: string): Promise<UserRow | null> {
        logger.info(`Finding user by email: ${email}`);

        try {
            const result = await databaseClient.query<UserRow>(
                FIND_USER_BY_EMAIL_QUERY,
                [email]
            );

            if (result.rows.length === 0) return null;

            const row = result.rows[0];

            logger.info(`User row retrieved: ${JSON.stringify(row)}`);
            const isPasswordValid = await bycript.compare(password, row?.passwordHash!);
            if (!isPasswordValid) return null;

            const user: UserRow = {
                id: row!.id,
                email: row!.email,
                passwordHash: row!.passwordHash,
                role: row!.role
            };

            return user;
        } catch (err) {
            throw DatabaseErrorHelper.translate(err);
        }
    }

}
