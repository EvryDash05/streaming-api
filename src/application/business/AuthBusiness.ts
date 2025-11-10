import bycript from "bcryptjs";
import { USER_ERRORS } from "../../constants/errors/errorsConstants";
import { ProducerEntity } from "../../domain/entity/ProducersEntity";
import { UserEntity } from "../../domain/entity/UsersEntity";
import AuthorityRepositoryInterface from "../../domain/repository/interfaces/AuthorityRepositoryInterface";
import { UserRepositoryInterface } from "../../domain/repository/interfaces/UserRepositoryInterface";
import { AuthError } from "../../infrastructure/exceptions/Exceptions";
import { AuthLoginRequest } from '../../infrastructure/models/request/auth/AuthLoginRequest';
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { ProducerRequest } from "../../infrastructure/models/request/ProducerRequest";
import { AuthResponse } from "../../infrastructure/models/response/AuthResponse";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { createJwtToken, createRefreshToken } from "../../infrastructure/security/JwtUtils";
import { handleBusinessOperation } from "../../utils/errorHandler";
import { successResponse } from "../../utils/HttpUtils";
import loggerMessage from "../../utils/logger";
import { AuthService } from "../service/auth/AuthService";

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

    async register(request: AuthRegisterRequest): Promise<BaseResponse<void>> {
        console.log('In register User')
        
        request.password_hash = await bycript.hash(request.password_hash, 10);
        const userEntity = this.mapToEntity(request, request.password_hash);
        await handleBusinessOperation(
            async () => await this.userRepository.save(userEntity),
            USER_ERRORS.SAVE
        );

        return successResponse<void>("Usuario registrado con éxito", null, 201);
    }

    async authenticate(request: AuthLoginRequest): Promise<BaseResponse<AuthResponse>> {
        loggerMessage.info('In authentication method');
        const user = await this.userRepository.findUserByEmailAndPassword(request.email, request.password);

        if (!user) {
            throw new AuthError('Credenciales inválidas', { detail: 'El email o la contraseña son incorrectos' });
        }

        const authorities = await this.authorityRepository.findAuthorityByRoleName(user.role);

        loggerMessage.info('Generating tokens...');

        const accessToken: string = await createJwtToken({
            sub: user.id.toString(),
            email: user.email,
            roles: user.role,
            authorities: authorities || [],
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

        loggerMessage.info('Authentication successful, returning tokens');
        return successResponse<AuthResponse>("Autenticación exitosa", data, 200);
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
