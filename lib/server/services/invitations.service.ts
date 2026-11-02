import { ObjectId } from "mongodb";
import {
  Age,
  AuthenticatedUser,
  ConfirmationStatus,
  CreateInvitationInput,
  InvitationDto,
  Role,
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
} from "@/lib/models/invitation";
import { getCollection } from "@/lib/server/db/mongodb";

export interface ParticipantDocument {
  _id: ObjectId;
  name: string;
  lastName: string;
  age: "adult" | "child" | "infant";
  intolerances: string;
  celiac: boolean;
  vegetarian: boolean;
  vegan: boolean;
}

export interface InvitationDocument {
  _id: ObjectId;
  secret: string;
  recipient: string;
  confirmationStatus: "pending" | "confirmed" | "not attending" | "not_attending";
  email?: string;
  phoneNumber?: string;
  contactPersonId?: ObjectId | null;
  isInterestedInAccommodation: boolean;
  participants: ParticipantDocument[];
  __v?: number;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

function dbStatusToDto(status?: string): ConfirmationStatus {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return ConfirmationStatus.Confirmed;
    case "not attending":
    case "not_attending":
      return ConfirmationStatus.NotAttending;
    case "pending":
    default:
      return ConfirmationStatus.Pending;
  }
}

function dtoStatusToDb(
  status?: ConfirmationStatus | string
): "pending" | "confirmed" | "not attending" {
  switch (status) {
    case ConfirmationStatus.Confirmed:
    case "confirmed":
      return "confirmed";
    case ConfirmationStatus.NotAttending:
    case "not attending":
    case "not_attending":
      return "not attending";
    case ConfirmationStatus.Pending:
    case "pending":
    default:
      return "pending";
  }
}

function dbAgeToDto(age?: string): Age {
  switch (age?.toLowerCase()) {
    case "child":
      return Age.Child;
    case "infant":
      return Age.Infant;
    case "adult":
    default:
      return Age.Adult;
  }
}

function dtoAgeToDb(age?: Age | string): "adult" | "child" | "infant" {
  switch (age) {
    case Age.Child:
    case "child":
      return "child";
    case Age.Infant:
    case "infant":
      return "infant";
    case Age.Adult:
    case "adult":
    default:
      return "adult";
  }
}

export function toInvitationDto(
  invitation: InvitationDocument,
  includeSecret = false
): InvitationDto {
  return {
    _id: invitation._id.toHexString(),
    secret: includeSecret ? invitation.secret : null,
    recipient: invitation.recipient,
    confirmationStatus: dbStatusToDto(invitation.confirmationStatus),
    email: invitation.email ?? null,
    phoneNumber: invitation.phoneNumber ?? null,
    contactPersonId: invitation.contactPersonId
      ? invitation.contactPersonId.toHexString()
      : null,
    isInterestedInAccommodation: Boolean(
      invitation.isInterestedInAccommodation
    ),
    participants: (invitation.participants || []).map((participant) => ({
      _id: participant._id.toHexString(),
      name: participant.name,
      lastName: participant.lastName,
      age: dbAgeToDto(participant.age),
      intolerances: participant.intolerances ?? "",
      celiac: Boolean(participant.celiac),
      vegetarian: Boolean(participant.vegetarian),
      vegan: Boolean(participant.vegan),
    })),
  };
}

function requireAdminRole(user: AuthenticatedUser): void {
  if (!user?.roles?.includes(Role.Admin)) {
    throw new AppError("Forbidden: Admin role required.", 403);
  }
}

function resolveVisibleInvitationId(
  requestedId: string | undefined,
  user: AuthenticatedUser
): { targetId: string; isAdmin: boolean } {
  if (!user || !user.roles || user.roles.length === 0) {
    throw new AppError("Unauthorized.", 401);
  }

  if (user.roles.includes(Role.Admin)) {
    if (!requestedId) {
      throw new AppError("Admin must specify an 'id' argument.", 400);
    }
    return { targetId: requestedId, isAdmin: true };
  }

  if (user.roles.includes(Role.User)) {
    if (requestedId && requestedId !== user.uid) {
      throw new AppError("Non sei autorizzato a visualizzare questi dati.", 403);
    }
    return { targetId: requestedId || user.uid, isAdmin: false };
  }

  throw new AppError("Forbidden.", 403);
}

function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new AppError(`Invalid ID "${id}".`, 400);
  }
  return new ObjectId(id);
}

export const invitationsService = {
  async findOneRaw(id: string): Promise<InvitationDocument> {
    const collection = await getCollection<InvitationDocument>("invitations");
    const invitation = await collection.findOne({ _id: toObjectId(id) });
    if (!invitation) {
      throw new AppError(`Invitation with ID "${id}" not found.`, 404);
    }
    return invitation;
  },

  async exists(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const collection = await getCollection<InvitationDocument>("invitations");
    const count = await collection.countDocuments(
      { _id: new ObjectId(id) },
      { limit: 1 }
    );
    return count > 0;
  },

  async findAll(user: AuthenticatedUser): Promise<InvitationDto[]> {
    requireAdminRole(user);
    const collection = await getCollection<InvitationDocument>("invitations");
    const invitations = await collection.find().toArray();
    return invitations.map((inv) => toInvitationDto(inv, true));
  },

  async findOne(
    id: string | undefined,
    user: AuthenticatedUser
  ): Promise<InvitationDto> {
    const { targetId, isAdmin } = resolveVisibleInvitationId(id, user);
    const invitation = await this.findOneRaw(targetId);
    return toInvitationDto(invitation, isAdmin);
  },

  async create(
    input: CreateInvitationInput,
    user: AuthenticatedUser
  ): Promise<InvitationDto> {
    requireAdminRole(user);
    const recipient = input.recipient?.trim();
    if (!recipient) {
      throw new AppError("Recipient is required.", 400);
    }

    const collection = await getCollection<InvitationDocument>("invitations");
    const doc: InvitationDocument = {
      _id: new ObjectId(),
      secret: new ObjectId().toHexString(),
      recipient,
      confirmationStatus: "pending",
      contactPersonId: null,
      isInterestedInAccommodation: false,
      participants: [],
    };

    await collection.insertOne(doc);
    return toInvitationDto(doc, true);
  },

  async update(
    id: string | undefined,
    input: UpdateInvitationInput,
    user: AuthenticatedUser
  ): Promise<InvitationDto> {
    const { targetId, isAdmin } = resolveVisibleInvitationId(id, user);
    const collection = await getCollection<InvitationDocument>("invitations");

    const updateFields: Partial<InvitationDocument> = {
      confirmationStatus: dtoStatusToDb(
        input.confirmationStatus ?? ConfirmationStatus.Pending
      ),
    };

    if (input.recipient !== undefined && input.recipient !== null) {
      updateFields.recipient = input.recipient;
    }
    if (input.email !== undefined) {
      updateFields.email = input.email ?? undefined;
    }
    if (input.phoneNumber !== undefined) {
      updateFields.phoneNumber = input.phoneNumber ?? undefined;
    }
    if (
      input.isInterestedInAccommodation !== undefined &&
      input.isInterestedInAccommodation !== null
    ) {
      updateFields.isInterestedInAccommodation = Boolean(
        input.isInterestedInAccommodation
      );
    }

    const updated = await collection.findOneAndUpdate(
      { _id: toObjectId(targetId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new AppError(`Invitation with ID "${targetId}" not found.`, 404);
    }

    return toInvitationDto(updated, isAdmin);
  },

  async updateInvitationParticipants(
    id: string | undefined,
    input: UpdateInvitationParticipantsInput,
    user: AuthenticatedUser
  ): Promise<InvitationDto> {
    const { targetId, isAdmin } = resolveVisibleInvitationId(id, user);
    const { contactPersonId, participants } = input;

    const newParticipants: ParticipantDocument[] = (participants || []).map(
      (p) => ({
        _id:
          p._id && ObjectId.isValid(p._id)
            ? new ObjectId(p._id)
            : new ObjectId(),
        name: p.name,
        lastName: p.lastName,
        age: dtoAgeToDb(p.age),
        intolerances: p.intolerances ?? "",
        celiac: Boolean(p.celiac),
        vegetarian: Boolean(p.vegetarian),
        vegan: Boolean(p.vegan),
      })
    );

    if (newParticipants.length === 0 && contactPersonId) {
      throw new AppError(
        "Contact person ID must be null when there are no participants.",
        400
      );
    }

    if (contactPersonId) {
      const contactPersonExists = newParticipants.some(
        (p) => p._id.toHexString() === contactPersonId
      );
      if (!contactPersonExists) {
        throw new AppError(
          "Contact person ID must belong to an existing participant in this invitation.",
          400
        );
      }
    }

    const collection = await getCollection<InvitationDocument>("invitations");
    const updated = await collection.findOneAndUpdate(
      { _id: toObjectId(targetId) },
      {
        $set: {
          participants: newParticipants,
          contactPersonId:
            newParticipants.length > 0 && contactPersonId
              ? toObjectId(contactPersonId)
              : null,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new AppError(`Invitation with ID "${targetId}" not found.`, 404);
    }

    return toInvitationDto(updated, isAdmin);
  },
};
