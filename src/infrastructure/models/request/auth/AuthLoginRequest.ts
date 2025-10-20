import { z, ZodTypeAny } from "zod";

export class AuthLoginRequest {
    public email: string;
    public password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public static schema(): ZodTypeAny {
        return z.object({
            email: z.string().email("Email inválido"),
            password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        });
    }
}
