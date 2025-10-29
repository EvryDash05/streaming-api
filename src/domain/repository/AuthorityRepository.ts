import databaseClient from "../../infrastructure/database/databaseClient";
import { AuthorityEntity } from "../entity/AuthoritiesEntity";
import AuthorityRepositoryInterface from "./interfaces/AuthorityRepositoryInterface";

export class AuthorityRepository implements AuthorityRepositoryInterface {

    async findAuthorityByRoleName(roleName: string): Promise<string[] | null> {
        console.info(`Finding authorities by role name: ${roleName}`);

        const result = await databaseClient.query<{name: string}>(
            `SELECT a.id, a.name
                FROM role_authorities ra
                JOIN roles r ON ra.role_id = r.id
                JOIN authorities a ON ra.authority_id = a.id
                WHERE r.name = $1
            `,
            [roleName]
        );

        if (result.rows.length === 0) return null;

        console.info("Authorities found:", result.rows);
        return result.rows.map(row => row.name);
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
