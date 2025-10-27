import prisma from "../../infrastructure/database/prismaClient";
import logger from "../../utils/logger";
import { AuthorityEntity } from "../entity/AuthoritiesEntity";
import AuthorityRepositoryInterface from "./interfaces/AuthorityRepositoryInterface";

export class AuthorityRepository implements AuthorityRepositoryInterface {

    async findAuthorityByRoleName(roleName: string): Promise<AuthorityEntity[] | null> {
        logger.info(`Finding authorities by name ${roleName}`)
        const authorities = await prisma.role_authorities.findMany({
            where: { roles: { name: roleName } },
            include: { authorities: true }
        });

        logger.info('Authorities found:', authorities);
        return authorities.map(ra => ({
            id: ra.authorities.id,
            name: ra.authorities.name,
        }));
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
