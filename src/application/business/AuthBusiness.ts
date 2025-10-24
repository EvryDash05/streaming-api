import bycript from "bcryptjs";
import { UserEntity } from "../../domain/entity/UsersEntity";
import { Repository } from "../../domain/repository/Repository";
import { AuthLoginRequest } from '../../infrastructure/models/request/auth/AuthLoginRequest';
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { AuthService } from "../service/auth/AuthService";
import { ProducerRequest } from "../../infrastructure/models/request/ProducerRequest";
import { ProducerEntity } from "../../domain/entity/ProducersEntity";
import { string } from "zod";

export class AuthBusiness implements AuthService {

    private readonly userRepository: Repository<UserEntity, number>;

    public constructor(userRepository: Repository<UserEntity, number>) {
        this.userRepository = userRepository;
    }

    async register(request: AuthRegisterRequest): Promise<BaseResponse<void>> {
        try {
            console.log('In register User')
            request.password_hash = await bycript.hash(request.password_hash, 10);
            const userEntity = this.mapToEntity(request, request.password_hash);
            await this.userRepository.save(userEntity);

            return {
                success: true,
                message: "Usuario registrado con éxito",
                statusCode: 201
            };
        } catch (error: any) {
            if (error.code === 'P2002') {
                const field = error.meta.target[0];
                return {
                    success: false,
                    message: `${field} ya está registrado`,
                    statusCode: 409
                };
            }

            return {
                success: false,
                message: "Error interno del servidor",
                errors: error.message,
                statusCode: 500
            };
        }
    }

    authenticate(request: AuthLoginRequest): Promise<BaseResponse<string[]>> {
        throw new Error("Method not implemented.");
    }

    refreshToken(token: string): Promise<BaseResponse<string[]>> {
        throw new Error("Method not implemented.");
    }

    private mapProducer(request?: ProducerRequest): ProducerEntity | undefined {
        if (!request) return undefined
        return {
            institutionName: request?.institution_name ?? null,
            description: request?.description ?? null,
            contactEmail: request?.contact_email ?? null,
            contactPhone: request?.contact_phone ?? null,
        };
    }

    private mapToEntity(request: AuthRegisterRequest, passwordHash: string): UserEntity {
        const userEntity: UserEntity = {
            email: request.email || "",
            passwordHash: passwordHash || "",
            fullName: request.full_name || "",
            phoneNumber: request.phone_number || "",
            country: request.country || "",
            preferredLanguage: request.preferred_language || "",
            role: request.role as any,
            producer: this.mapProducer(request.producerRequest)
        };
        return userEntity;
    }

}
