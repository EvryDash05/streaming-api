import bycript from "bcryptjs";
import { ProducerEntity } from "../../domain/entity/ProducersEntity";
import { UserEntity } from "../../domain/entity/UsersEntity";
import { Repository } from "../../domain/repository/interfaces/Repository";
import { AuthLoginRequest } from '../../infrastructure/models/request/auth/AuthLoginRequest';
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { ProducerRequest } from "../../infrastructure/models/request/ProducerRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { AuthService } from "../service/auth/AuthService";
import { errorResponse, successResponse } from "../../utils/HttpUtils";
import { UserRepositoryInterface } from "../../domain/repository/interfaces/UserRepositoryInterface";
import AuthorityRepositoryInterface from "../../domain/repository/interfaces/AuthorityRepositoryInterface";
import { ca } from "zod/v4/locales/index.cjs";
import { createJwtToken, createRefreshToken } from "../../infrastructure/security/JwtUtils";
import logger from "../../utils/logger";
import { AuthResponse } from "../../infrastructure/models/response/AuthResponse";

export class AuthBusiness implements AuthService {

    private readonly userRepository: UserRepositoryInterface;
    private readonly authorityRepository: AuthorityRepositoryInterface;

    public constructor(
        userRepository: UserRepositoryInterface,
        authorityRepository: AuthorityRepositoryInterface
    ) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
    }

    /* constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly authorityRepository: AuthorityRepositoryInterface
    ) {} */

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

    async authenticate(request: AuthLoginRequest): Promise<BaseResponse<AuthResponse>> {
        try {
            logger.info('In authentication method');
            const user = await this.userRepository.findUserByEmailAndPassword(request.email, request.password);
            
            if (!user) {
                return errorResponse("Credenciales inválidas", ["Email o contraseña incorrectos"], 401);
            }
    
            const authorities = await this.authorityRepository.findAuthorityByRoleName(user.role);

            const accessToken: string = await createJwtToken({
                sub: user.id.toString(),
                email: user.email,
                roles: user.role,
                authorities: authorities ? authorities.map(a => a.name) : []
            })

            const refreshToken: string = await createRefreshToken({
                sub: user.id.toString(),
                email: user.email,
                type: 'refresh'
            })

            const data = {
                accessToken, 
                refreshToken
            }
            
            return successResponse<AuthResponse>("Autenticación exitosa", data, 200);
        } catch (error: any) {
            return errorResponse("Error interno del servidor", error.message, 500);
        }
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
