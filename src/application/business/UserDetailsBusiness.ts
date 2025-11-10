import { USER_DETAILS_ERRORS } from "../../constants/errors/errorsConstants";
import { UserDetailsEntity } from "../../domain/entity/UserDetailsEntity";
import UserDetailsRepositoryInterface from "../../domain/repository/interfaces/UserDetailsRepositoryInterface";
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { UserDetailsResponse } from "../../infrastructure/models/response/UserDetailReponse";
import { handleBusinessOperation } from "../../utils/errorHandler";
import { successResponse } from "../../utils/HttpUtils";
import { UserDetailService } from "../service/UserDetailService";

export class UserDetailsBusiness implements UserDetailService {

    private readonly userDetailRepository: UserDetailsRepositoryInterface;

    public constructor(
        userDetailRepository: UserDetailsRepositoryInterface,
    ) {
        this.userDetailRepository = userDetailRepository;
    }

    async createUserDetail(request: AuthRegisterRequest, userId: number) {
    }

    async findById(id: number): Promise<BaseResponse<UserDetailsResponse>> {
        const userDetail = await handleBusinessOperation(
            async () => await this.userDetailRepository.findUserDetailsByUserId(id),
            USER_DETAILS_ERRORS.FIND_BY_ID
        ) as UserDetailsEntity

        const data: UserDetailsResponse = {
            userId: userDetail.userId,
            fullName: userDetail.fullName!,
            phoneNumber: userDetail.phoneNumber!,
            country: userDetail.country!,
            preferredLanguage: userDetail.preferredLanguage!
        }

        return successResponse<UserDetailsResponse>("Detalle de usuario encontrado con éxito", data, 200);
    }

    findAll(): Promise<UserDetailsResponse[]> {
        throw new Error("Method not implemented.");
    }

    updateUser(request: any) {
        throw new Error("Method not implemented.");
    }

    deleteUserById(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}
