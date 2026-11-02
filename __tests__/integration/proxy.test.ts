import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "@/lib/models/invitation";
import {
  authService,
  signAccessToken,
} from "@/lib/server/services/auth.service";
import middleware from "@/proxy";

vi.mock("@/app/i18n", () => ({
  routing: { locales: ["it"], defaultLocale: "it" },
}));

vi.mock("next-intl/middleware", () => ({
  default: () => () => NextResponse.next(),
}));

const invId = "507f1f77bcf86cd799439011";

describe("proxy (Next.js middleware)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SIGN_KEY = "test-secret-signing-key-32-bytes!!";
  });

  it("redirects unauthenticated user from /it/admin to /it/admin/login", async () => {
    const req = new NextRequest("http://localhost:3000/it/admin");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/it/admin/login"
    );
  });

  it("redirects non-admin user from /it/admin to /it/admin/login", async () => {
    const userToken = await signAccessToken({
      sub: invId,
      roles: [Role.User],
    });
    const req = new NextRequest("http://localhost:3000/it/admin", {
      headers: { cookie: `at=${userToken}` },
    });

    const res = await middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/it/admin/login"
    );
  });

  it("allows authenticated admin to access /it/admin", async () => {
    const adminToken = await signAccessToken({
      sub: "superuser",
      roles: [Role.Admin],
    });
    const req = new NextRequest("http://localhost:3000/it/admin", {
      headers: { cookie: `at=${adminToken}` },
    });

    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it("performs magic-link auto-login on /it/participant/[id]?token=... and sets at cookie", async () => {
    vi.spyOn(authService, "signIn").mockResolvedValue({
      access_token: "signed-jwt-from-magic-link",
    });

    const req = new NextRequest(
      `http://localhost:3000/it/participant/${invId}?token=valid-secret`
    );
    const res = await middleware(req);

    expect(authService.signIn).toHaveBeenCalledWith(invId, "valid-secret");
    expect(res.status).toBe(307);
    expect(res.headers.get("set-cookie")).toContain(
      "at=signed-jwt-from-magic-link"
    );
  });

  it("redirects to /it/error when magic-link token is invalid", async () => {
    vi.spyOn(authService, "signIn").mockRejectedValue(
      new Error("Unauthorized")
    );

    const req = new NextRequest(
      `http://localhost:3000/it/participant/${invId}?token=bad-secret`
    );
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/it/error");
  });

  it("redirects to /it/error when accessing /it/participant/[id] without cookie or token", async () => {
    const req = new NextRequest(
      `http://localhost:3000/it/participant/${invId}`
    );
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/it/error");
  });

  it("allows authenticated owner to access /it/participant/[id] directly", async () => {
    const ownerToken = await signAccessToken({
      sub: invId,
      roles: [Role.User],
    });
    const req = new NextRequest(
      `http://localhost:3000/it/participant/${invId}`,
      {
        headers: { cookie: `at=${ownerToken}` },
      }
    );

    const res = await middleware(req);
    expect(res.status).toBe(200);
  });
});
