import { AuthLoginRequest } from "../../../infrastructure/models/request/auth/AuthLoginRequest";
import { AuthRegisterRequest } from "../../../infrastructure/models/request/auth/AuthRegisterRequest";
import { AuthResponse } from "../../../infrastructure/models/response/AuthResponse";
import { BaseResponse } from "../../../infrastructure/models/response/common/baseResponse";

export interface AuthService {
    register(request: AuthRegisterRequest): Promise<BaseResponse>;
    authenticate(request: AuthLoginRequest): Promise<BaseResponse<AuthResponse>>;
    refreshToken(token: string): Promise<BaseResponse<String[]>>;
}
