import { ZodTypeAny } from "zod";

export abstract class Request {
    // Classes should implement a static validateSchema method returning a Zod schema
    static validateSchema(): ZodTypeAny {
        throw new Error("Method not implemented.");
    }
}
