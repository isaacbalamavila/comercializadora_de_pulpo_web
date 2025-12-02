export interface LoginResponse {
    id: string;
    email: string;
    userName: string;
    userLastName: string;
    role: string;
    roleId: number;
    accessToken: string;
    accessTokenExpiratesAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    firstLogin: boolean;
}