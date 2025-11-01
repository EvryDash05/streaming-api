import UserDetailsRepositoryInterface from "../../domain/repository/interfaces/UserDetailsRepositoryInterface";
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { BaseResponse } from "../../infrastructure/models/response/common/baseResponse";
import { UserDetailsResponse } from "../../infrastructure/models/response/UserDetailReponse";
import { errorResponse, successResponse } from "../../utils/HttpUtils";
import { UserDetailService } from "../service/UserDetailService";

type UserDetailsRow = {
    userId: number;
    fullName?: string | null;
    phoneNumber?: string | null;
    country?: string | null;
    preferredLanguage?: string | null;
}

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
        try {
            const userDetail = await this.userDetailRepository.findUserDetailsByUserId(id);

            if (!userDetail) {
                return errorResponse("Detalle de usuario no encontrado", [`No se encontró detalle para el usuario con id: ${id}`], 200);
            }

            const data: UserDetailsResponse = {
                userId: userDetail.userId,
                fullName: userDetail.fullName!,
                phoneNumber: userDetail.phoneNumber!,
                country: userDetail.country!,
                preferredLanguage: userDetail.preferredLanguage!
            }

            return successResponse<UserDetailsResponse>("Detalle de usuario encontrado con éxito", data, 200);
        } catch (error: any) {
            return errorResponse("Error interno del servidor", error.message, 500);
        }
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
