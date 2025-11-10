import { z, ZodType } from "zod";
import { Request } from "./Request";

class VideoRequest extends Request {

    public title: string;
    public description: string;
    public url: string;
    public duration: number;
    public category: string;

    public constructor(
        title: string,
        description: string,
        url: string,
        duration: number,
        category: string,
    ) {
        super();
        this.title = title;
        this.description = description;
        this.url = url;
        this.duration = duration;
        this.category = category;
    }

    public static validateSchema(): ZodType {
        return z.object({
            title: z.string()
                .trim()
                .min(2, "El título debe tener al menos 2 caracteres")
                .max(100, "El título no debe exceder los 100 caracteres"),
            description: z.string()
                .trim()
                .min(10, "La descripción debe tener al menos 10 caracteres")
                .max(500, "La descripción no debe exceder los 500 caracteres"),
            url: z.string()
                .trim()
                .regex(
                    /^videos\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.mp4$/, 
                    "La URL del video no tiene el formato correcto"
                ),
            duration: z.number()
                .min(60, "La duración del video debe ser al menos 1 segundo")
                .max(300, "La duración del video no debe exceder los 5 minutos"),
            category: z.string()
                .trim()
                .min(2, "La categoría debe tener al menos 2 caracteres")
                .max(50, "La categoría no debe exceder los 50 caracteres"),
        })
    }

}

export default VideoRequest;