import bycript from "bcryptjs";
import prisma from "../../infrastructure/database/prismaClient";
import { UserEntity } from "../entity/UsersEntity";
import { UserRepositoryInterface } from "./interfaces/UserRepositoryInterface";
import logger from "../../utils/logger";
import { role_enum } from "@prisma/client";

export class UserRepository implements UserRepositoryInterface {

    findById(id: number): Promise<UserEntity | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    async save(entity: UserEntity): Promise<number> {
        const { email, passwordHash: password_hash, fullName, country, phoneNumber, preferredLanguage, role } = entity;
        const roleId = role === "PRODUCER" ? 2 : 1;

        const userId = await prisma.$transaction(async (tx) => {
            const user = await tx.users.create({
                data: {
                    email,
                    password_hash,
                    role: role as role_enum,
                    user_roles: {
                        create: {
                            roles: { connect: { id: roleId } }
                        }
                    },
                    user_details: {
                        create: {
                            full_name: fullName ?? null,
                            country: country ?? null,
                            phone_number: phoneNumber ?? null,
                            preferred_language: preferredLanguage ?? null,
                            created_by: "system"
                        }
                    }
                },
                select: { id: true }
            });

            if (role === "PRODUCER" && role) {
                const { institutionName, description, contactEmail, contactPhone } = entity.producer || {};

                await tx.producers.create({
                    data: {
                        user_id: user.id,
                        institution_name: institutionName ?? null,
                        description: description ?? null,
                        contact_email: contactEmail ?? null,
                        contact_phone: contactPhone ?? null
                    }
                });
            }

            return user.id;
        });


        return userId;
    }

    async update(entity: UserEntity): Promise<void> {
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findUserByEmailAndPassword(email: string, password: string): Promise<{
        email: string;
        role: string;
        password_hash: string;
        created_at: Date | null;
        updated_at: Date | null;
        id: number;
    } | null> {
        logger.info(`Finding user by email: ${email}`);
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return null

        const isPasswordValid = await bycript.compare(password, user.password_hash);
        return isPasswordValid ? user : null;
    }

}
