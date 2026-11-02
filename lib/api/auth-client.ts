export interface LoginResponse {
  message?: string;
}

export interface AuthClient {
  login(guestId: string, token: string): Promise<Response>;
  adminLogin(username: string, password: string): Promise<Response>;
  refresh(): Promise<Response>;
}

export const authClient: AuthClient = {
  login: async (guestId: string, token: string) => {
    return fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: guestId, token }),
    });
  },

  adminLogin: async (username: string, password: string) => {
    return fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  },

  refresh: async () => {
    return fetch("/api/auth/refresh", {
      method: "POST",
    });
  },
};
