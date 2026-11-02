import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Age,
  AuthenticatedUser,
  ConfirmationStatus,
  Role,
} from "@/lib/models/invitation";
import {
  InvitationDocument,
  invitationsService,
} from "@/lib/server/services/invitations.service";

const mockCollection = {
  findOne: vi.fn(),
  countDocuments: vi.fn(),
  find: vi.fn(),
  insertOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
};

vi.mock("@/lib/server/db/mongodb", () => ({
  getCollection: vi.fn(async () => mockCollection),
}));

const adminUser: AuthenticatedUser = {
  uid: "superuser",
  roles: [Role.Admin],
};

const invId = "507f1f77bcf86cd799439011";
const otherInvId = "507f1f77bcf86cd799439022";
const partId = "507f1f77bcf86cd799439033";

const guestUser: AuthenticatedUser = {
  uid: invId,
  roles: [Role.User],
};

function makeDoc(overrides: Partial<InvitationDocument> = {}): InvitationDocument {
  return {
    _id: new ObjectId(invId),
    secret: "secret-hex-token",
    recipient: "Famiglia Rossi",
    confirmationStatus: "pending",
    email: "rossi@example.com",
    phoneNumber: "+393331234567",
    contactPersonId: null,
    isInterestedInAccommodation: false,
    participants: [
      {
        _id: new ObjectId(partId),
        name: "Mario",
        lastName: "Rossi",
        age: "adult",
        intolerances: "Lactose",
        celiac: true,
        vegetarian: false,
        vegan: false,
      },
    ],
    ...overrides,
  };
}

describe("invitationsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findAll", () => {
    it("allows admin to fetch all invitations including secrets", async () => {
      const doc = makeDoc({ confirmationStatus: "not attending" });
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue([doc]),
      });

      const result = await invitationsService.findAll(adminUser);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: invId,
        secret: "secret-hex-token",
        recipient: "Famiglia Rossi",
        confirmationStatus: ConfirmationStatus.NotAttending,
        email: "rossi@example.com",
        phoneNumber: "+393331234567",
        contactPersonId: null,
        isInterestedInAccommodation: false,
        participants: [
          {
            _id: partId,
            name: "Mario",
            lastName: "Rossi",
            age: Age.Adult,
            intolerances: "Lactose",
            celiac: true,
            vegetarian: false,
            vegan: false,
          },
        ],
      });
    });

    it("rejects non-admin users from calling findAll", async () => {
      await expect(invitationsService.findAll(guestUser)).rejects.toThrow(
        "Forbidden: Admin role required."
      );
    });
  });

  describe("findOne & visibility guards", () => {
    it("allows guest to fetch their own invitation with secret masked as null", async () => {
      mockCollection.findOne.mockResolvedValue(
        makeDoc({ confirmationStatus: "confirmed" })
      );

      const result = await invitationsService.findOne(invId, guestUser);

      expect(result._id).toBe(invId);
      expect(result.secret).toBeNull();
      expect(result.confirmationStatus).toBe(ConfirmationStatus.Confirmed);
    });

    it("defaults id to guest uid when omitted", async () => {
      mockCollection.findOne.mockResolvedValue(makeDoc());

      const result = await invitationsService.findOne(undefined, guestUser);
      expect(result._id).toBe(invId);
    });

    it("forbids guest from accessing another invitation", async () => {
      await expect(
        invitationsService.findOne(otherInvId, guestUser)
      ).rejects.toThrow("Non sei autorizzato a visualizzare questi dati.");
    });

    it("requires admin to specify an id when calling findOne", async () => {
      await expect(
        invitationsService.findOne(undefined, adminUser)
      ).rejects.toThrow("Admin must specify an 'id' argument.");
    });

    it("throws 404 when invitation does not exist", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      await expect(
        invitationsService.findOne(invId, adminUser)
      ).rejects.toThrow(`Invitation with ID "${invId}" not found.`);
    });

    it("throws 400 when ID is not a valid ObjectId", async () => {
      await expect(
        invitationsService.findOne("invalid-id", adminUser)
      ).rejects.toThrow('Invalid ID "invalid-id".');
    });
  });

  describe("create", () => {
    it("creates a new invitation with generated _id and secret for admin", async () => {
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true });

      const created = await invitationsService.create(
        { recipient: "  Famiglia Bianchi  " },
        adminUser
      );

      expect(created.recipient).toBe("Famiglia Bianchi");
      expect(created.confirmationStatus).toBe(ConfirmationStatus.Pending);
      expect(created.secret).toMatch(/^[a-f0-9]{24}$/);
      expect(created.participants).toEqual([]);
      expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    });

    it("throws 400 when recipient is empty", async () => {
      await expect(
        invitationsService.create({ recipient: "   " }, adminUser)
      ).rejects.toThrow("Recipient is required.");
    });

    it("forbids non-admin from creating an invitation", async () => {
      await expect(
        invitationsService.create({ recipient: "Test" }, guestUser)
      ).rejects.toThrow("Forbidden: Admin role required.");
    });
  });

  describe("update", () => {
    it("updates invitation status, contact info, and accommodation", async () => {
      const updatedDoc = makeDoc({
        confirmationStatus: "confirmed",
        email: "new@example.com",
        phoneNumber: "+39000",
        isInterestedInAccommodation: true,
      });
      mockCollection.findOneAndUpdate.mockResolvedValue(updatedDoc);

      const res = await invitationsService.update(
        invId,
        {
          confirmationStatus: ConfirmationStatus.Confirmed,
          email: "new@example.com",
          phoneNumber: "+39000",
          isInterestedInAccommodation: true,
        },
        guestUser
      );

      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId(invId) },
        {
          $set: {
            confirmationStatus: "confirmed",
            email: "new@example.com",
            phoneNumber: "+39000",
            isInterestedInAccommodation: true,
          },
        },
        { returnDocument: "after" }
      );
      expect(res.confirmationStatus).toBe(ConfirmationStatus.Confirmed);
      expect(res.isInterestedInAccommodation).toBe(true);
      expect(res.secret).toBeNull();
    });

    it("throws 404 when updating non-existent invitation", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        invitationsService.update(
          invId,
          { confirmationStatus: ConfirmationStatus.Pending },
          adminUser
        )
      ).rejects.toThrow(`Invitation with ID "${invId}" not found.`);
    });
  });

  describe("updateInvitationParticipants", () => {
    it("updates participants, preserves existing _id, generates new _id, and sets contactPersonId", async () => {
      const updatedDoc = makeDoc({
        contactPersonId: new ObjectId(partId),
        participants: [
          {
            _id: new ObjectId(partId),
            name: "Mario",
            lastName: "Rossi",
            age: "adult",
            intolerances: "",
            celiac: false,
            vegetarian: true,
            vegan: false,
          },
          {
            _id: new ObjectId(),
            name: "Giulia",
            lastName: "Rossi",
            age: "child",
            intolerances: "",
            celiac: false,
            vegetarian: false,
            vegan: false,
          },
        ],
      });
      mockCollection.findOneAndUpdate.mockResolvedValue(updatedDoc);

      const res = await invitationsService.updateInvitationParticipants(
        invId,
        {
          contactPersonId: partId,
          participants: [
            {
              _id: partId,
              name: "Mario",
              lastName: "Rossi",
              age: Age.Adult,
              vegetarian: true,
            },
            {
              name: "Giulia",
              lastName: "Rossi",
              age: Age.Child,
            },
          ],
        },
        guestUser
      );

      expect(res.participants).toHaveLength(2);
      expect(res.participants[1].age).toBe(Age.Child);
      expect(res.contactPersonId).toBe(partId);
    });

    it("throws 400 if contactPersonId is set when participants list is empty", async () => {
      await expect(
        invitationsService.updateInvitationParticipants(
          invId,
          {
            contactPersonId: partId,
            participants: [],
          },
          adminUser
        )
      ).rejects.toThrow(
        "Contact person ID must be null when there are no participants."
      );
    });

    it("throws 400 if contactPersonId does not belong to any participant in the invitation", async () => {
      await expect(
        invitationsService.updateInvitationParticipants(
          invId,
          {
            contactPersonId: otherInvId,
            participants: [
              {
                _id: partId,
                name: "Mario",
                lastName: "Rossi",
                age: Age.Adult,
              },
            ],
          },
          adminUser
        )
      ).rejects.toThrow(
        "Contact person ID must belong to an existing participant in this invitation."
      );
    });
  });

  describe("exists", () => {
    it("returns false for invalid ObjectId and true when count > 0", async () => {
      expect(await invitationsService.exists("bad-id")).toBe(false);

      mockCollection.countDocuments.mockResolvedValue(1);
      expect(await invitationsService.exists(invId)).toBe(true);
    });
  });
});
