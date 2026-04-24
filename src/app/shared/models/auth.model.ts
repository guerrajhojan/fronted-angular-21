import { User } from './user.model';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    tokens: AuthTokens;
}