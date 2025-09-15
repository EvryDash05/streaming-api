import { AuthLoginRequest } from "../../infrastructure/models/request/AuthLoginRequest.ts";

export interface UserService {
    createUser(request: AuthLoginRequest);
    findById(id: number);
    findAll();
    updateUser(request: any);
    deleteUserById(id: number);
}
