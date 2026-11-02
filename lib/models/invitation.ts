export enum Age {
  Adult = "ADULT",
  Child = "CHILD",
  Infant = "INFANT",
}

export enum ConfirmationStatus {
  Confirmed = "CONFIRMED",
  NotAttending = "NOT_ATTENDING",
  Pending = "PENDING",
}

export enum Role {
  User = "user",
  Admin = "admin",
}

export interface AuthenticatedUser {
  uid: string;
  roles: Role[];
}

export interface ParticipantDto {
  _id: string;
  name: string;
  lastName: string;
  age: Age;
  intolerances: string;
  celiac: boolean;
  vegetarian: boolean;
  vegan: boolean;
}

export interface InvitationDto {
  _id: string;
  secret?: string | null;
  recipient: string;
  confirmationStatus: ConfirmationStatus;
  email?: string | null;
  phoneNumber?: string | null;
  contactPersonId?: string | null;
  isInterestedInAccommodation: boolean;
  participants: ParticipantDto[];
}

export interface CreateInvitationInput {
  recipient: string;
}

export interface UpdateInvitationInput {
  recipient?: string | null;
  confirmationStatus?: ConfirmationStatus;
  email?: string | null;
  phoneNumber?: string | null;
  isInterestedInAccommodation?: boolean | null;
}

export interface ParticipantInput {
  _id?: string | null;
  name: string;
  lastName: string;
  age: Age;
  intolerances?: string | null;
  celiac?: boolean | null;
  vegetarian?: boolean | null;
  vegan?: boolean | null;
}

export interface UpdateInvitationParticipantsInput {
  contactPersonId?: string | null;
  participants: ParticipantInput[];
}
