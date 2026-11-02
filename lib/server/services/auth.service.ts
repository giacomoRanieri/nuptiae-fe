import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthenticatedUser, Role } from "@/lib/models/invitation";
import { JwtPayload } from "@/lib/models/jwt";
import { logger } from "@/lib/logger";
import {
  AppError,
  invitationsService,
} from "@/lib/server/services/invitations.service";

export const ACCESS_TOKEN_COOKIE = "at";
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60; // 15 minutes

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SIGN_KEY || process.env.AUTH_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing JWT_SIGN_KEY (or AUTH_SECRET_KEY) environment variable");
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(payload: {
  sub: string;
  roles: Role[];
}): Promise<string> {
  return new SignJWT({ roles: payload.roles })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as JwtPayload;
}

export function getAccessTokenCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: ACCESS_TOKEN_COOKIE,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
    path: "/",
  };
}

export const authService = {
  async signIn(
    invitationId: string,
    token: string
  ): Promise<{ access_token: string }> {
    try {
      const inv = await invitationsService.findOneRaw(invitationId);
      if (inv.secret !== token) {
        throw new AppError("Unauthorized", 401);
      }
      const access_token = await signAccessToken({
        sub: inv._id.toHexString(),
        roles: [Role.User],
      });
      return { access_token };
    } catch (e) {
      logger.error("Guest auth failed:", e);
      throw new AppError("Unauthorized", 401);
    }
  },

  async adminSignIn(
    username: string,
    password: string
  ): Promise<{ access_token: string }> {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      logger.error("Missing ADMIN_USERNAME or ADMIN_PASSWORD env variables");
      throw new AppError("Server authentication configuration error", 500);
    }

    if (username !== adminUsername || password !== adminPassword) {
      throw new AppError("Unauthorized", 401);
    }

    const access_token = await signAccessToken({
      sub: "superuser",
      roles: [Role.Admin],
    });
    return { access_token };
  },

  async refreshToken(atCookie: string): Promise<{ access_token: string }> {
    try {
      const decoded = await verifyAccessToken(atCookie);
      if (!decoded.sub || !Array.isArray(decoded.roles)) {
        throw new AppError("Invalid token payload", 401);
      }
      const access_token = await signAccessToken({
        sub: decoded.sub,
        roles: decoded.roles as Role[],
      });
      return { access_token };
    } catch (e) {
      logger.error("Token refresh failed:", e);
      throw new AppError("Unauthorized", 401);
    }
  },

  async getAuthenticatedUser(): Promise<AuthenticatedUser> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) {
      throw new AppError("Authentication token is missing.", 401);
    }

    let tokenData: JwtPayload;
    try {
      tokenData = await verifyAccessToken(token);
    } catch (err) {
      logger.error("Token verification failed:", err);
      throw new AppError("Token not valid.", 401);
    }

    if (!tokenData.sub || !Array.isArray(tokenData.roles)) {
      throw new AppError("Token payload not valid.", 401);
    }

    if (tokenData.sub !== "superuser") {
      const exists = await invitationsService.exists(tokenData.sub);
      if (!exists) {
        throw new AppError("Invitation not valid.", 401);
      }
    }

    return {
      uid: tokenData.sub,
      roles: tokenData.roles.map((r) => r as Role),
    };
  },
};
