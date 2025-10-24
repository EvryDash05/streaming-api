import prisma from "../../infrastructure/database/prismaClient";
import { UserEntity } from "../entity/UsersEntity";
import { Repository } from "./Repository";

export class UserRepository implements Repository<UserEntity, number> {

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
                    role: role === 'PRODUCER' ? 'producer' : 'user',
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

}
