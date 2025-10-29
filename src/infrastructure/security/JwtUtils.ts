import * as jose from 'jose';

interface JwtPayload extends jose.JWTPayload {
    sub: string;
    email: string;
    roles: string;
    authorities: string[];
}

const secret = new TextEncoder().encode(process.env.SECURITY_JWT_KEY!);
const expirationTime = Number(process.env.SECURITY_JWT_ACCESS_EXPIRATION!) / 1000; // en segundos
const refreshExpirationTime = Number(process.env.SECURITY_JWT_REFRESH_EXPIRATION!) / 1000; // en segundos
const userGenerator = process.env.SECURITY_JWT_USER_GENERATOR!;

const alg = 'HS256';

export async function createJwtToken(payload: JwtPayload): Promise<string> {
    return await new jose.SignJWT({
        roles: payload.roles,
        email: payload.email,
        authorities: payload.authorities,
    })
        .setSubject(payload.sub)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .setJti(crypto.randomUUID())
        .setIssuer(userGenerator)
        .sign(secret)
}

export async function createRefreshToken(payload: {
    email: string,
    type: 'refresh'
}): Promise<string> {
    return await new jose.SignJWT({
        email: payload.email,
        type: 'refresh'
    })
        .setSubject(payload.sub)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(refreshExpirationTime)
        .setJti(crypto.randomUUID())
        .setIssuer(userGenerator)
        .sign(secret);
}
