import bycript from "bcryptjs";
import { UserEntity } from "../entity/UsersEntity";
import { UserRepositoryInterface, UserRow } from "./interfaces/UserRepositoryInterface";
import logger from "../../utils/logger";
import databaseClient from "../../infrastructure/config/database/databaseClient";

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

            const userResult = await client.query(
                `INSERT INTO users (email, password_hash, role)
                VALUES ($1, $2, $3) RETURNING id`,
                [email, password_hash, role]
            );
            const userId = userResult.rows[0].id;

            await client.query(
                `INSERT INTO user_roles (user_id, role_id)
                VALUES ($1, $2)`,
                [userId, roleId]
            );

            // 3️⃣ Insertar en user_details
            await client.query(
                `INSERT INTO user_details (user_id, full_name, country, phone_number, preferred_language, created_by)
                VALUES ($1, $2, $3, $4, $5, 'system')`,
                [userId, fullName ?? null, country ?? null, phoneNumber ?? null, preferredLanguage ?? null]
            );

            // 4️⃣ Insertar en producers si aplica
            if (role === "PRODUCER" && entity.producer) {
                const { institutionName, description, contactEmail, contactPhone } = entity.producer;

                await client.query(
                    `INSERT INTO producers (user_id, institution_name, description, contact_email, contact_phone)
           VALUES ($1, $2, $3, $4, $5)`,
                    [userId, institutionName ?? null, description ?? null, contactEmail ?? null, contactPhone ?? null]
                );
            }

            await client.query("COMMIT");
            return userId;

        } catch (err) {
            await client.query("ROLLBACK");
            console.error("Error saving user:", err);
            throw err;
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
                `SELECT id, email, password_hash AS "passwordHash", role
                    FROM users
                    WHERE email = $1`,
                [email]
            );

            if (result.rows.length === 0) return null;

            const row = result.rows[0];

            logger.info(`User row retrieved: ${JSON.stringify(row)}`);
            const isPasswordValid = await bycript.compare(password, row?.passwordHash!);
            if (!isPasswordValid) return null;

            const user: UserRow = {
                id: row!.id ,
                email: row!.email,
                passwordHash: row!.passwordHash,
                role: row!.role
            };

            return user;
        } catch (err) {
            console.error("Error al encontrar el usuario", err);
            throw err;
        }
    }

}
