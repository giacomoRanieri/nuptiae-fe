"use server";

import {
  Age,
  ConfirmationStatus,
  UpdateInvitationInput,
} from "@/lib/models/invitation";
import { logger } from "@/lib/logger";
import { authService } from "@/lib/server/services/auth.service";
import { invitationsService } from "@/lib/server/services/invitations.service";
import { revalidatePath } from "next/cache";

export interface InvitationFormState {
  message?: string;
  success?: boolean;
  timestamp?: number;
}

export async function updateInvitationAction(
  prevState: InvitationFormState,
  formData: FormData
): Promise<InvitationFormState> {
  const id = formData.get("id") as string;
  const status = formData.get("status") as ConfirmationStatus;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!id) {
    return { success: false, message: "Missing invitation ID" };
  }

  const input: UpdateInvitationInput = {
    confirmationStatus: status,
    email: email || undefined,
    phoneNumber: phoneNumber || undefined,
  };

  try {
    const user = await authService.getAuthenticatedUser();

    // Check for accommodation interest
    const isInterestedInAccommodation =
      formData.get("interestedInAccommodation") === "true";

    // Update main invitation details
    await invitationsService.update(
      id,
      {
        ...input,
        isInterestedInAccommodation,
      },
      user
    );

    // Parse participants from formData
    interface RawParticipant {
      _id?: string;
      name: string;
      lastName: string;
      age: string;
      intolerances?: string;
      celiac?: string;
      vegetarian?: string;
      vegan?: string;
    }

    const rawParticipants: Record<number, RawParticipant> = {};

    for (const [key, value] of Array.from(formData.entries())) {
      const match = key.match(/^participants\[(\d+)\]\.(.+)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2] as keyof RawParticipant;

        if (!rawParticipants[index]) {
          rawParticipants[index] = {} as RawParticipant;
        }

        rawParticipants[index][field] = value as string;
      }
    }

    // Convert to array and format for service
    const participantsInput = Object.values(rawParticipants).map((p) => ({
      _id: p._id || undefined,
      name: p.name,
      lastName: p.lastName,
      age: p.age as Age,
      intolerances: p.intolerances || "",
      celiac: p.celiac === "on",
      vegetarian: p.vegetarian === "on",
      vegan: p.vegan === "on",
    }));

    if (participantsInput.length > 0) {
      await invitationsService.updateInvitationParticipants(
        id,
        {
          participants: participantsInput,
        },
        user
      );
    }

    revalidatePath(`/participant/${id}`);
    revalidatePath(`/[locale]/participant/${id}`, "page");
    revalidatePath(`/[locale]/admin`, "page");

    return { success: true, message: "update.success", timestamp: Date.now() };
  } catch (error) {
    logger.error("Update failed:", error);
    return { success: false, message: "update.failed", timestamp: Date.now() };
  }
}
