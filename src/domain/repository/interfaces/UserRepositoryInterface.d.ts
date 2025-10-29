import { UserEntity } from "../../entity/UsersEntity";
import { Repository } from "./Repository";

type UserRow = {
    id: number;
    email: string;
    role: string;
    passwordHash: string;
};

interface UserRepositoryInterface extends Repository<UserEntity, number> {
    findUserByEmailAndPassword(email: string, password: string): Promise<UserRow | null>;
}

