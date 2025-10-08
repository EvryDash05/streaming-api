import * as jose from 'jose'
import {config} from "../../utils/config";

interface JwtPayload {
    sub: string;
    name: string;
    roles: string;
    authorities: string[];
}

const secret = new TextEncoder().encode(config.jwt.key);
const expirationTime = config.jwt.accessExpiration / 1000; // in seconds
const userGenerator = config.jwt.userGenerator;

const alg = 'HS256';

export async function createJwtToken(payload: JwtPayload): Promise<string> {
    return await new jose.SignJWT({payload})
        .setProtectedHeader({alg})
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .setJti(self.crypto.randomUUID())
        .setIssuer(userGenerator)
        .sign(secret)
}
