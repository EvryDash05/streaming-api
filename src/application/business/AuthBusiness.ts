import bycript from "bcryptjs";
import { ProducerEntity } from "../../domain/entity/ProducersEntity";
import { UserEntity } from "../../domain/entity/UsersEntity";
import { Repository } from "../../domain/repository/Repository";
import { AuthLoginRequest } from '../../infrastructure/models/request/auth/AuthLoginRequest';
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { ProducerRequest } from "../../infrastructure/models/request/ProducerRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { AuthService } from "../service/auth/AuthService";
import { errorResponse, successResponse } from "../../utils/HttpUtils";

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

            return successResponse<void>("Usuario registrado con éxito", null, 201);
        } catch (error: any) {
            if (error.code === 'P2002') {
                const field = error.meta.target[0];
                return errorResponse(`${field} ya registrado`, [`${field} duplicado`], 409);
            }

            return errorResponse("Error interno del servidor", error.message, 500);
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
