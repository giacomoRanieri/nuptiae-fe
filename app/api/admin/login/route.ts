import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  authService,
  getAccessTokenCookieOptions,
} from "@/lib/server/services/auth.service";
import { AppError } from "@/lib/server/services/invitations.service";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const { access_token } = await authService.adminSignIn(username, password);

    const nextResponse = NextResponse.json({
      success: true,
      message: "Login successful",
    });
    nextResponse.cookies.set({
      ...getAccessTokenCookieOptions(),
      value: access_token,
    });

    return nextResponse;
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 401) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    logger.error("Admin login failed", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
