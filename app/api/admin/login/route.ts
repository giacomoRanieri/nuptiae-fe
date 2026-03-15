import { authClient } from "@/lib/api/auth-client";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { parseSetCookie, serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const response = await authClient.adminLogin(username, password);

    if (response.ok) {
      const setCookie = response.headers.getSetCookie();
      const atCookie = setCookie.find((cookie) => cookie.startsWith("at="));

      if (!atCookie) {
        return NextResponse.json({ success: false }, { status: 500 });
      }

      const parsedCookie = parseSetCookie(atCookie);

      const nextResponse = NextResponse.json({ success: true });
      let finalCookie = atCookie;
      if (process.env.NODE_ENV === "production") {
        parsedCookie.sameSite = "lax";
        parsedCookie.domain = ".giacomoloredana.it";
        //finalCookie = finalCookie.replace(/SameSite=Strict/i, "SameSite=Lax");
        //if (!finalCookie.includes("Domain=")) {
        //  finalCookie += "; Domain=.giacomoloredana.it";
        //}
      } else {
        parsedCookie.domain = "localhost";
        parsedCookie.secure = false;
        parsedCookie.sameSite = undefined;
        parsedCookie.path = "/";
        finalCookie = serialize(parsedCookie);
        //finalCookie = finalCookie.split(";")[0] + "; Path=/";
      }
      nextResponse.headers.set("Set-Cookie", finalCookie);

      return nextResponse;
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: response.status }
      );
    }
  } catch (error) {
    logger.error("Admin login failed", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
