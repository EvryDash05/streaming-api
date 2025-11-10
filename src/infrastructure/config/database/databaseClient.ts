import { Pool } from 'pg'

class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL no definida en el entorno");
        }

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: { rejectUnauthorized: false },
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query<T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> {
        const client = await this.pool.connect();
        try {
            const res = await client.query<T>(sql, params);
            return res;
        } finally {
            client.release();
        }
    }

    public async close() {
        await this.pool.end();
    }
}

export default Database.getInstance();
