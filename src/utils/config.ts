import 'dotenv/config';

export const config = {
    jwt: {
        key: process.env.SECURITY_JWT_KEY!,
        accessExpiration: Number(process.env.SECURITY_JWT_ACCESS_EXPIRATION ?? 1800000),
        refreshExpiration: Number(process.env.SECURITY_JWT_REFRESH_EXPIRATION ?? 86400000),
        userGenerator: process.env.SECURITY_JWT_USER_GENERATOR ?? 'management_system',
        hashedSecret: process.env.SECURITY_JWT_HASHED_SECRET!,
    },
};
