import { AuthLoginRequest } from "../../../infrastructure/models/request/auth/AuthLoginRequest";
import { AuthRegisterRequest } from "../../../infrastructure/models/request/auth/AuthRegisterRequest";
import { BaseResponse } from "../../../infrastructure/models/response/common/baseResponse";
// import { BussinessReponse } from "../../../infrastructure/models/response/common/businessResponse";

export interface AuthService {
    register(request: AuthRegisterRequest): Promise<BaseResponse>;
    authenticate(request: AuthLoginRequest): Promise<BaseResponse<string[]>>;
    refreshToken(token: string): Promise<BaseResponse<String[]>>;
}
