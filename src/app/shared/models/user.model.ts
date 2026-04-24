export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string | null;
    is_verified: boolean;
    created_at: string;
}

export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    phone?: string;
}

export interface UpdateUserPayload {
    first_name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
}