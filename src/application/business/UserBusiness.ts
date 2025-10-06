import { AuthLoginRequest } from "../../infrastructure/models/request/AuthLoginRequest.js";
import { PrismaClient } from "../../generated/prisma";
import {UserService} from "../service/UserService";

export class UserBusiness implements UserService {

    async createUser(request: AuthLoginRequest) {

        const prisma = new PrismaClient();
        const { password, email } = request;

        const response = await prisma.playing_with_neon.findMany();
        console.log(response);

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
