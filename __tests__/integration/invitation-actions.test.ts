import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createInvitationAction,
  updateInvitationAction,
} from "@/app/actions/invitation";
import { Age, ConfirmationStatus, Role } from "@/lib/models/invitation";
import { authService } from "@/lib/server/services/auth.service";
import { invitationsService } from "@/lib/server/services/invitations.service";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const invId = "507f1f77bcf86cd799439011";

describe("Invitation Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createInvitationAction", () => {
    it("returns error when recipient is blank", async () => {
      const res = await createInvitationAction("   ");
      expect(res.success).toBe(false);
      expect(res.message).toBe("createError");
    });

    it("creates invitation and returns DTO on success", async () => {
      vi.spyOn(authService, "getAuthenticatedUser").mockResolvedValue({
        uid: "superuser",
        roles: [Role.Admin],
      });
      vi.spyOn(invitationsService, "create").mockResolvedValue({
        _id: invId,
        secret: "sec",
        recipient: "Famiglia Gialli",
        confirmationStatus: ConfirmationStatus.Pending,
        isInterestedInAccommodation: false,
        participants: [],
      });

      const res = await createInvitationAction("Famiglia Gialli");
      expect(res.success).toBe(true);
      expect(res.invitation?.recipient).toBe("Famiglia Gialli");
    });
  });

  describe("updateInvitationAction", () => {
    it("parses FormData and calls invitationsService.update and updateInvitationParticipants", async () => {
      vi.spyOn(authService, "getAuthenticatedUser").mockResolvedValue({
        uid: invId,
        roles: [Role.User],
      });
      const updateSpy = vi
        .spyOn(invitationsService, "update")
        .mockResolvedValue({} as never);
      const updatePartsSpy = vi
        .spyOn(invitationsService, "updateInvitationParticipants")
        .mockResolvedValue({} as never);

      const formData = new FormData();
      formData.set("id", invId);
      formData.set("status", ConfirmationStatus.Confirmed);
      formData.set("email", "guest@example.com");
      formData.set("phoneNumber", "+39333999888");
      formData.set("interestedInAccommodation", "true");
      formData.set("participants[0].name", "Luca");
      formData.set("participants[0].lastName", "Gialli");
      formData.set("participants[0].age", Age.Adult);
      formData.set("participants[0].celiac", "on");
      formData.set("participants[0].intolerances", "Nuts");

      const res = await updateInvitationAction({}, formData);

      expect(res.success).toBe(true);
      expect(res.message).toBe("update.success");
      expect(updateSpy).toHaveBeenCalledWith(
        invId,
        {
          confirmationStatus: ConfirmationStatus.Confirmed,
          email: "guest@example.com",
          phoneNumber: "+39333999888",
          isInterestedInAccommodation: true,
        },
        { uid: invId, roles: [Role.User] }
      );
      expect(updatePartsSpy).toHaveBeenCalledWith(
        invId,
        {
          participants: [
            {
              _id: undefined,
              name: "Luca",
              lastName: "Gialli",
              age: Age.Adult,
              intolerances: "Nuts",
              celiac: true,
              vegetarian: false,
              vegan: false,
            },
          ],
        },
        { uid: invId, roles: [Role.User] }
      );
    });

    it("returns error when id is missing", async () => {
      const formData = new FormData();
      const res = await updateInvitationAction({}, formData);

      expect(res.success).toBe(false);
      expect(res.message).toBe("Missing invitation ID");
    });
  });
});
