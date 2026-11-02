import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GET as getInvitations,
  POST as postInvitation,
} from "@/app/api/admin/invitations/route";
import { POST as postAdminLogin } from "@/app/api/admin/login/route";
import { POST as postAdminLogout } from "@/app/api/admin/logout/route";
import { POST as postGuestLogin } from "@/app/api/auth/login/route";
import { POST as postRefresh } from "@/app/api/auth/refresh/route";
import { GET as getHealth } from "@/app/api/health/route";
import { ConfirmationStatus, Role } from "@/lib/models/invitation";
import { authService } from "@/lib/server/services/auth.service";
import {
  AppError,
  invitationsService,
} from "@/lib/server/services/invitations.service";

describe("API Route Handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/health", () => {
    it("returns status ok and ISO timestamp", async () => {
      const res = await getHealth();
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.status).toBe("ok");
      expect(() => new Date(body.date)).not.toThrow();
    });
  });

  describe("POST /api/admin/login", () => {
    it("returns 400 when username or password is missing", async () => {
      const req = new Request("http://localhost:3000/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: "admin" }),
      });
      const res = await postAdminLogin(req);
      expect(res.status).toBe(400);
    });

    it("sets HTTP-only cookie and returns 200 on valid admin login", async () => {
      vi.spyOn(authService, "adminSignIn").mockResolvedValue({
        access_token: "admin-jwt",
      });

      const req = new Request("http://localhost:3000/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "pwd" }),
      });
      const res = await postAdminLogin(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("set-cookie")).toContain("at=admin-jwt");
    });

    it("returns 401 on invalid credentials", async () => {
      vi.spyOn(authService, "adminSignIn").mockRejectedValue(
        new AppError("Unauthorized", 401)
      );

      const req = new Request("http://localhost:3000/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "bad" }),
      });
      const res = await postAdminLogin(req);
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/admin/logout", () => {
    it("clears the at cookie", async () => {
      const res = await postAdminLogout();
      expect(res.status).toBe(200);
      expect(res.headers.get("set-cookie")).toContain("at=;");
    });
  });

  describe("POST /api/auth/login", () => {
    it("sets at cookie on valid guest login", async () => {
      vi.spyOn(authService, "signIn").mockResolvedValue({
        access_token: "guest-jwt",
      });

      const req = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ id: "123", token: "sec" }),
      });
      const res = await postGuestLogin(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("set-cookie")).toContain("at=guest-jwt");
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("returns 401 when at cookie is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/refresh", {
        method: "POST",
      });
      const res = await postRefresh(req);
      expect(res.status).toBe(401);
    });

    it("sets refreshed at cookie when valid", async () => {
      vi.spyOn(authService, "refreshToken").mockResolvedValue({
        access_token: "refreshed-jwt",
      });

      const req = new NextRequest("http://localhost:3000/api/auth/refresh", {
        method: "POST",
        headers: { cookie: "at=old-jwt" },
      });
      const res = await postRefresh(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("set-cookie")).toContain("at=refreshed-jwt");
    });
  });

  describe("GET & POST /api/admin/invitations", () => {
    it("creates a new invitation and returns 201", async () => {
      vi.spyOn(authService, "getAuthenticatedUser").mockResolvedValue({
        uid: "superuser",
        roles: [Role.Admin],
      });
      vi.spyOn(invitationsService, "create").mockResolvedValue({
        _id: "inv1",
        secret: "sec1",
        recipient: "Famiglia Neri",
        confirmationStatus: ConfirmationStatus.Pending,
        isInterestedInAccommodation: false,
        participants: [],
      });

      const req = new Request("http://localhost:3000/api/admin/invitations", {
        method: "POST",
        body: JSON.stringify({ recipient: "Famiglia Neri" }),
      });
      const res = await postInvitation(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.invitation.recipient).toBe("Famiglia Neri");
    });

    it("lists invitations for admin", async () => {
      vi.spyOn(authService, "getAuthenticatedUser").mockResolvedValue({
        uid: "superuser",
        roles: [Role.Admin],
      });
      vi.spyOn(invitationsService, "findAll").mockResolvedValue([]);

      const res = await getInvitations();
      expect(res.status).toBe(200);
    });
  });
});
