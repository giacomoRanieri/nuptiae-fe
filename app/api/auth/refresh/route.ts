import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  ACCESS_TOKEN_COOKIE,
  authService,
  getAccessTokenCookieOptions,
} from "@/lib/server/services/auth.service";
import { AppError } from "@/lib/server/services/invitations.service";

export async function POST(request: NextRequest) {
  try {
    const atCookie = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!atCookie) {
      return NextResponse.json(
        { message: "Missing access token cookie" },
        { status: 401 }
      );
    }

    const { access_token } = await authService.refreshToken(atCookie);

    const response = NextResponse.json({ message: "Token refreshed" });
    response.cookies.set({
      ...getAccessTokenCookieOptions(),
      value: access_token,
    });

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    logger.error("Token refresh failed", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
