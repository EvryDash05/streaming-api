import { AuthLoginRequest } from "../../../infrastructure/models/request/auth/AuthLoginRequest";
import { AuthRegisterRequest } from "../../../infrastructure/models/request/auth/AuthRegisterRequest";
import { BussinessReponse } from "../../../infrastructure/models/response/common/businessResponse";

export interface AuthService {
    register(request: AuthRegisterRequest): Promise<BussinessReponse<number>>;
    authenticate(request: AuthLoginRequest): Promise<BusinessReponse<String[]>>;
    refreshToken(token: string): Promise<BussinessReponse<string[]>>;
}
