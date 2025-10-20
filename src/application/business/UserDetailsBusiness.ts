
import { PrismaClient } from "../../generated/prisma";
import { AuthRegisterRequest } from "../../infrastructure/models/request/auth/AuthRegisterRequest";
import { UserDetailService } from "../service/UserDetailService";

export class UserDetailsBusiness implements UserDetailService {

    async createUserDetail(request: AuthRegisterRequest, userId: number) {
        
        try {

        } catch (error) {

        }

        const prisma = new PrismaClient();



        return "response";
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
