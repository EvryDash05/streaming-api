
export interface AuthService {
    authenticate(username: string, password: string): Promise<string>;
    refreshToken(token: string): Promise<string>;
}
