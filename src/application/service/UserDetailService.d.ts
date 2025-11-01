import { promises } from "dns";
import { UserDetailsResponse } from "../../infrastructure/models/response/UserDetailReponse";

export interface UserDetailService {
    createUserDetail(request: AuthRegisterRequest, userId: number);
    findById(id: number): Promise<BaseResponse<UserDetailsResponse>>;
    findAll(): Promise<BaseResponse<UserDetailsResponse[]>>;
    updateUser(request: any);
    deleteUserById(id: number): Promise<BaseResponse<boolean>>;
}
