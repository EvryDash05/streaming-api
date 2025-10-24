
export interface Repository<E, ID> {
    findById(id: ID): Promise<E | null>;
    findAll(): Promise<E[]>;
    save(entity: E): Promise<number>;
    update(entity: E): Promise<void>;
    delete(id: ID): Promise<void>;
}
