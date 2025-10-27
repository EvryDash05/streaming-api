import { UserEntity } from "../../entity/UsersEntity";
import { Repository } from "./Repository";

interface UserRepositoryInterface extends Repository<UserEntity, number> {
    findUserByEmailAndPassword(email: string, password: string): Promise<{
        email: string;
        role: RoleEntity;
        password_hash: string;
        created_at: Date | null;
        updated_at: Date | null;
        id: number;
    } | null>;
}

