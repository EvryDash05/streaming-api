import { count } from "console";
import { z, ZodTypeAny } from "zod";

export class AuthRegisterRequest {
    public email: string;
    public password_hash: string;
    public full_name: string;
    public phone_number?: string;
    public country?: string;
    public preferred_language?: string;

    public constructor(
        email: string,
        password_hash: string,
        full_name: string,
        phone_number?: string,
        country?: string,
        preferred_language?: string
    ) {
        this.email = email;
        this.password_hash = password_hash;
        this.full_name = full_name;
        this.phone_number = phone_number;
        this.country = country;
        this.preferred_language = preferred_language;
    }

    public static validateSchema(): ZodTypeAny {
        return z.object({
            email: z.string()
                .email("Email inválido"),
            password_hash: z.string()
                .min(8, "La contraseña debe tener al menos 8 caracteres")
                .refine(val => /[A-Za-z]/.test(val), { message: "Debe contener al menos una letra" })
                .refine(val => /\d/.test(val), { message: "Debe contener al menos un número" })
                .refine(val => /[!@#$%^&*]/.test(val), { message: "Debe contener al menos un carácter especial" }),
            full_name: z.string().trim()
                .min(2, "El nombre completo debe tener al menos 2 caracteres")
                .max(100, "El nombre completo no debe exceder los 100 caracteres"),
            phone_number: z.string()
                .regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido"),
            country: z.string()
                .min(2, "El país debe tener al menos 2 caracteres")
                .max(56, "El país no debe exceder los 56 caracteres")
                .regex(/^[a-zA-Z\s]+$/, "El país solo debe contener letras y espacios"),
            preferred_language: z.string()
                .min(2, "El idioma preferido debe tener al menos 2 caracteres")
                .max(30, "El idioma preferido no debe exceder los 30 caracteres")
                .regex(/^[a-zA-Z\s]+$/, "El idioma preferido solo debe contener letras y espacios")
        })
    }

}
