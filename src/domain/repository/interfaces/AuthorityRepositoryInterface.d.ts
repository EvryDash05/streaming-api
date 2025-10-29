
import { AuthorityEntity } from "../../entity/AuthoritiesEntity";
import { Repository } from "./Repository";

interface AuthorityRepositoryInterface extends Repository<AuthorityEntity, number> {
    findAuthorityByRoleName(roleName: string): Promise<string[] | null>;
}

export default AuthorityRepositoryInterface;