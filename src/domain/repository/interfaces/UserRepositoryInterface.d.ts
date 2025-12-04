import { UserEntity } from "../../entity/UsersEntity";
import { Repository } from "./Repository";

type UserRow = {
    id: number;
    email: string;
    role: string;
    passwordHash: string;
};

export interface UserRepositoryInterface extends Repository<UserEntity, number> {
    findUserByEmailAndPassword(email: string, password: string): Promise<UserRow | null>;
}

