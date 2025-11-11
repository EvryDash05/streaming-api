import { S3Client } from "@aws-sdk/client-s3";

class S3Singleton {
    private static instance: S3Client;

    private constructor() { }

    public static getInstance(): S3Client {
        if (!S3Singleton.instance) {
            
            const isLocal = process.env.NODE_ENV === "development";

            const config: any = {
                region: process.env.S3_REGION || "us-east-1",
            };

            if (isLocal) {
                config.credentials = {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                };
            }

            S3Singleton.instance = new S3Client(config);
        }

        return S3Singleton.instance;
    }
}

export default S3Singleton;
