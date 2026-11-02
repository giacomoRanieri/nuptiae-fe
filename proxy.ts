import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./app/i18n";
import { logger } from "./lib/logger";
import { JwtPayload } from "./lib/models/jwt";
import {
  ACCESS_TOKEN_COOKIE,
  authService,
  getAccessTokenCookieOptions,
  verifyAccessToken,
} from "./lib/server/services/auth.service";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  let payload: JwtPayload | null = null;
  if (accessToken) {
    try {
      payload = await verifyAccessToken(accessToken);
    } catch (e) {
      logger.error("Middleware failed to parse access token", e);
      accessToken = undefined;
    }
  }

  // Extract path parts
  const parts = pathname.split("/");

  // Admin route protection
  if (pathname.includes("/admin") && !pathname.includes("/admin/login")) {
    let isAdmin = false;

    if (accessToken) {
      if (payload?.roles?.includes("admin")) {
        isAdmin = true;
      } else {
        logger.warn("User is not admin", payload);
      }
    }

    if (!isAdmin) {
      const loginUrl = request.nextUrl.clone();
      const locale = parts[1] || "it";
      loginUrl.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(loginUrl);
    }
  }

  // Participant route protection & auto-login
  if (pathname.includes("/participant/")) {
    const participantIndex = parts.indexOf("participant");
    if (participantIndex !== -1 && parts[participantIndex + 1]) {
      const participantId = parts[participantIndex + 1];
      const token = searchParams.get("token");

      let isOwner = false;
      let isAdmin = false;

      if (payload) {
        isAdmin = !!payload.roles?.includes("admin");
        isOwner = payload.sub === participantId;
      }

      // If not admin and not the owner of this page
      if (!isAdmin && !isOwner) {
        if (token) {
          // Authenticate directly in-process without an extra HTTP self-fetch
          try {
            const { access_token } = await authService.signIn(
              participantId,
              token
            );
            const nextUrl = request.nextUrl.clone();
            const response = NextResponse.redirect(nextUrl);
            response.cookies.set({
              ...getAccessTokenCookieOptions(),
              value: access_token,
            });
            return response;
          } catch (e) {
            logger.error("Middleware Login error", e);
            const errorUrl = request.nextUrl.clone();
            errorUrl.pathname = `/${parts[1] || "it"}/error`;
            return NextResponse.redirect(errorUrl);
          }
        } else {
          // Not an admin, not the owner, and no access token provided: hard reject
          logger.error("Middleware Login error: invalid credentials");
          const errorUrl = request.nextUrl.clone();
          errorUrl.pathname = `/${parts[1] || "it"}/error`;
          return NextResponse.redirect(errorUrl);
        }
      }
    }
  }

  // Fallback to next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, plus participant pages handling
  matcher: ["/((?!api|_next|.*\\..*).*)", "/", "/(it)/:path*"],
};
