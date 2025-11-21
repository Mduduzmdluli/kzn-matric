export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
    createdAt?: Date;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    error?: string;
    user?: User;
    token?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'instructor' | 'admin';
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}