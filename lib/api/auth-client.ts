
export interface LoginResponse {
    message?: string;
}

export interface AuthClient {
    login(guestId: string, token: string): Promise<Response>;
    adminLogin(password: string): Promise<Response>; // Simplified for now based on needs
    refresh(): Promise<Response>;
}

const BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace('/graphql', '') || 'http://localhost:3000';

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

    adminLogin: async (password: string) => {
        // Current requirement doesn't fully specify admin flow but adding stub
        return fetch(`${BASE_URL}/auth/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });
    },

    refresh: async () => {
        return fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
        });
    }
};
