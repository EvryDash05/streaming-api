import * as jose from 'jose';
import logger from '../../utils/logger';

interface JwtPayload extends jose.JWTPayload {
    sub: string;
    email: string;
    roles: string;
    authorities: string[];
}

const secret = new TextEncoder().encode(process.env.SECURITY_JWT_KEY!);
const now = Math.floor(Date.now() / 1000);
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
        .setExpirationTime(now + expirationTime)
        .setJti(crypto.randomUUID())
        .setIssuer(userGenerator)
        .sign(secret)
}

export async function createRefreshToken(payload: {
    sub: string,
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
        .setExpirationTime(now + refreshExpirationTime)
        .setJti(crypto.randomUUID())
        .setIssuer(userGenerator)
        .sign(secret);
}

export async function verifyJwtToken(token: string) {
    try {
        const { payload } = await jose.jwtVerify(token, secret, {
            issuer: process.env.SECURITY_JWT_USER_GENERATOR!,
            algorithms: ['HS256']
        });

        return payload;
    } catch (err) {
        console.error('Token inválido o expirado', err);
        return null;
    }
}
