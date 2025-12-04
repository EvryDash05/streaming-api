import { z, ZodTypeAny } from "zod";

export class SubscriptionRequest {

    public userId: number;
    public planId: number;

    public constructor(
        userId: number,
        planId: number
    ) {
        this.userId = userId;
        this.planId = planId;
    }

    public static validateSchema(): ZodTypeAny {
        return z.object({
            userId: z.number()
                .int("El ID del usuario debe ser un número entero")
                .positive("El ID del usuario debe ser mayor que cero"),

            planId: z.number()
                .int("El ID del plan debe ser un número entero")
                .positive("El ID del plan debe ser mayor que cero"),
        });
    }
}
