
export interface LoginResponse {
    message?: string;
}

export interface AuthClient {
    login(guestId: string, token: string): Promise<Response>;
    adminLogin(username: string, password: string): Promise<Response>;
    refresh(): Promise<Response>;
}

const BASE_URL = process.env.NEXT_PUBLIC_REFRESH_ENDPOINT || 'http://localhost:3000';

export const authClient: AuthClient = {
    login: async (guestId: string, token: string) => {
        return fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: guestId, token }),
        });
    },

    adminLogin: async (username: string, password: string) => {
        return fetch(`${BASE_URL}/auth/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
    },

    refresh: async () => {
        return fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
        });
    }
};
