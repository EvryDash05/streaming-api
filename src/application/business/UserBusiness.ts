import { AuthLoginRequest } from "../../infrastructure/models/request/AuthLoginRequest.js";
import { UserService } from "../service/UserService.js";

export class UserBusiness implements UserService {

    async createUser(request: AuthLoginRequest) {

        const { password, email } = request;

        const response = {
            message: 'Login success',
            email
        }

        return response;
    }

    findById(id: number) {
        throw new Error("Method not implemented.");
    }

    findAll() {
        throw new Error("Method not implemented.");
    }

    updateUser(request: any) {
        throw new Error("Method not implemented.");
    }

    deleteUserById(id: number) {
        throw new Error("Method not implemented.");
    }

}
