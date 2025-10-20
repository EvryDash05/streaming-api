import bycript from "bcryptjs";
import prisma from "../../infrastructure/database/prismaClient";
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { AuthService } from "../service/auth/AuthService";
import { BussinessReponse } from '../../infrastructure/models/response/common/businessResponse';
import { AuthLoginRequest } from '../../infrastructure/models/request/auth/AuthLoginRequest';

export class AuthBusiness implements AuthService {

    async register(request: AuthRegisterRequest): Promise<any> {
        try {
            const response = await prisma.$transaction(async (tx) => {
                const { email, full_name, password_hash, country, phone_number, preferred_language } = request;
                const encryptedPassword = await bycript.hash(password_hash, 10);
                
                console.log("Registering user:", request);
                console.log("Encrypted password:", encryptedPassword);
                await prisma.users.create({
                    data: {
                        email,
                        password_hash: encryptedPassword,
                        /* user_roles: {
                            create: {
                                roles: "user",
                                role_id: 2
                            }
                        }, */
                        user_details: {
                            create: {
                                full_name: full_name || null,
                                country: country || null,
                                phone_number: phone_number || null,
                                preferred_language: preferred_language || null,
                                created_by: "system"
                            }
                        }
                    }
                });

                return { success: true, message: "Usuario registrado con éxito" };
            });

            return response;
        } catch (error: any) {
            if (error.code === 'P2002') {
                const field = error.meta.target[0];
                return { success: false, message: `${field} ya está registrado` };
            }
            return { success: false, message: "Error interno del servidor", error: error.message };
        }
    }

    authenticate(request: AuthLoginRequest): Promise<BussinessReponse<string[]>> {
        throw new Error("Method not implemented.");
    }

    refreshToken(token: string): Promise<BussinessReponse<string[]>> {
        throw new Error("Method not implemented.");
    }

}
