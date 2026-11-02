import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "@/lib/models/invitation";
import {
  authService,
  signAccessToken,
  verifyAccessToken,
} from "@/lib/server/services/auth.service";
import { invitationsService } from "@/lib/server/services/invitations.service";

const mockCookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: mockCookieGet,
  })),
}));

const invId = "507f1f77bcf86cd799439011";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SIGN_KEY = "test-secret-signing-key-32-bytes!!";
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "supersecretpassword";
  });

  describe("signIn (guest)", () => {
    it("issues a valid 15m user JWT when invitation id and secret match", async () => {
      vi.spyOn(invitationsService, "findOneRaw").mockResolvedValue({
        _id: new ObjectId(invId),
        secret: "matching-secret",
        recipient: "Famiglia Verdi",
        confirmationStatus: "pending",
        isInterestedInAccommodation: false,
        participants: [],
      });

      const { access_token } = await authService.signIn(
        invId,
        "matching-secret"
      );

      const decoded = await verifyAccessToken(access_token);
      expect(decoded.sub).toBe(invId);
      expect(decoded.roles).toEqual([Role.User]);
    });

    it("throws 401 when secret does not match", async () => {
      vi.spyOn(invitationsService, "findOneRaw").mockResolvedValue({
        _id: new ObjectId(invId),
        secret: "matching-secret",
        recipient: "Famiglia Verdi",
        confirmationStatus: "pending",
        isInterestedInAccommodation: false,
        participants: [],
      });

      await expect(
        authService.signIn(invId, "wrong-secret")
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("adminSignIn", () => {
    it("issues a valid admin JWT when credentials match", async () => {
      const { access_token } = await authService.adminSignIn(
        "admin",
        "supersecretpassword"
      );

      const decoded = await verifyAccessToken(access_token);
      expect(decoded.sub).toBe("superuser");
      expect(decoded.roles).toEqual([Role.Admin]);
    });

    it("throws 401 when admin credentials are invalid", async () => {
      await expect(
        authService.adminSignIn("admin", "wrong")
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("refreshToken", () => {
    it("refreshes a valid access token", async () => {
      const initial = await signAccessToken({
        sub: invId,
        roles: [Role.User],
      });

      const { access_token } = await authService.refreshToken(initial);
      const decoded = await verifyAccessToken(access_token);
      expect(decoded.sub).toBe(invId);
      expect(decoded.roles).toEqual([Role.User]);
    });

    it("throws 401 when refreshing an invalid token", async () => {
      await expect(
        authService.refreshToken("invalid.jwt.token")
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("getAuthenticatedUser", () => {
    it("returns superuser for valid admin cookie", async () => {
      const token = await signAccessToken({
        sub: "superuser",
        roles: [Role.Admin],
      });
      mockCookieGet.mockReturnValue({ value: token });

      const user = await authService.getAuthenticatedUser();
      expect(user).toEqual({
        uid: "superuser",
        roles: [Role.Admin],
      });
    });

    it("verifies invitation existence for guest user cookie", async () => {
      const token = await signAccessToken({
        sub: invId,
        roles: [Role.User],
      });
      mockCookieGet.mockReturnValue({ value: token });
      vi.spyOn(invitationsService, "exists").mockResolvedValue(true);

      const user = await authService.getAuthenticatedUser();
      expect(user).toEqual({
        uid: invId,
        roles: [Role.User],
      });
    });

    it("throws 401 when cookie is missing", async () => {
      mockCookieGet.mockReturnValue(undefined);

      await expect(authService.getAuthenticatedUser()).rejects.toThrow(
        "Authentication token is missing."
      );
    });
  });
});
