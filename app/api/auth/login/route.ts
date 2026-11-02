import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  authService,
  getAccessTokenCookieOptions,
} from "@/lib/server/services/auth.service";
import { AppError } from "@/lib/server/services/invitations.service";

export async function POST(request: Request) {
  try {
    const { id, token } = await request.json();

    if (!id || !token) {
      return NextResponse.json(
        { message: "Invitation ID and token are required" },
        { status: 400 }
      );
    }

    const { access_token } = await authService.signIn(id, token);

    const response = NextResponse.json({ message: "Login successful" });
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
    logger.error("Guest login failed", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
