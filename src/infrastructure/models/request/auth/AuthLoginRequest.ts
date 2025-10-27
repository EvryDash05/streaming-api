import { z, ZodTypeAny } from "zod";
import { Request } from "../Request";

export class AuthLoginRequest extends Request {
    public email: string;
    public password: string;

    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }

    public static validateSchema(): ZodTypeAny {
        return z.object({
            email: z.string().email("Email inválido"),
            password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        });
    }
}
