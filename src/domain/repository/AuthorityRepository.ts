import databaseClient from "../../infrastructure/config/database/databaseClient";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import loggerMessage from "../../utils/logger";
import { AuthorityEntity } from "../entity/AuthoritiesEntity";
import AuthorityRepositoryInterface from "./interfaces/AuthorityRepositoryInterface";
import { FIND_AUTHORITIES_BY_ROLENAME_QUERY } from "./queries/authoritiesRepository.queries";

export class AuthorityRepository implements AuthorityRepositoryInterface {

    async findAuthorityByRoleName(roleName: string): Promise<string[] | null> {
        try {
            loggerMessage.info(`Finding authorities by role name: ${roleName}`);

            const result = await databaseClient.query<{ name: string }>(
                FIND_AUTHORITIES_BY_ROLENAME_QUERY,
                [roleName]
            );

            if (result.rows.length === 0) return null;

            console.info("Authorities found:", result.rows);
            return result.rows.map(row => row.name);
        } catch (error) {
            throw DatabaseErrorHelper.translate(error);
        }
    }

    findById(id: number): Promise<AuthorityEntity | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<AuthorityEntity[]> {
        throw new Error("Method not implemented.");
    }

    save(entity: AuthorityEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }

    update(entity: AuthorityEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }


}
