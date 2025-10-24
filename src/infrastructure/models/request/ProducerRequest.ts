import { z, ZodTypeAny } from "zod";

export class ProducerRequest {
    public user_id: number;
    public institution_name: string;
    public description: string;
    public contact_email?: string;
    public contact_phone: string;

    public constructor(
        user_id: number,
        institution_name: string,
        description: string,
        contact_email: string,
        contact_phone: string,
    ) {
        this.user_id = user_id;
        this.institution_name = institution_name;
        this.description = description;
        this.contact_email = contact_email;
        this.contact_phone = contact_phone;
    }

    public static validateSchema(): ZodTypeAny {
        return z.object({
            institution_name: z.string()
                .trim()
                .min(2, "El nombre de la institución debe tener al menos 2 caracteres")
                .max(150, "El nombre de la institución no debe exceder los 150 caracteres"),

            description: z.string()
                .trim()
                .min(5, "La descripción debe tener al menos 5 caracteres")
                .max(500, "La descripción no debe exceder los 500 caracteres"),

            contact_email: z.string()
                .email("Correo electrónico inválido")
                .max(150, "El correo no debe exceder los 150 caracteres"),

            contact_phone: z.string()
                .regex(/^\+?[0-9\s\-]{7,20}$/, "Número de teléfono inválido"),

        });
    }
}
