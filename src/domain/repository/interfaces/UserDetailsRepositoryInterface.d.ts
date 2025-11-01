import { UserDetailsEntity } from "../../entity/UserDetailsEntity";
import { Repository } from "./Repository";

interface UserDetailsRepositoryInterface extends Repository<UserDetailsEntity, number> {
    findUserDetailsByUserId(userId: number): Promise<UserDetailsEntity | null>;
}

export default UserDetailsRepositoryInterface;