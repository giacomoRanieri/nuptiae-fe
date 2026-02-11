"use server";

import { gql } from "@/lib/graphql";
import {
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
  ConfirmationStatus,
  Age
} from "@/lib/graphql/graphql";
import { getClient } from "@/lib/api/graphql-client";
import { revalidatePath } from "next/cache";
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const UPDATE_INVITATION = gql(`
  mutation UpdateInvitation($id: ID!, $input: UpdateInvitationInput!) {
    updateInvitation(id: $id, input: $input) {
      _id
      confirmationStatus
      email
      phoneNumber
      isInterestedInAccommodation
    }
  }
`) as DocumentNode<unknown, unknown>;

const UPDATE_PARTICIPANTS = gql(`
  mutation UpdateParticipants($id: ID!, $input: UpdateInvitationParticipantsInput!) {
    updateInvitationParticipants(id: $id, input: $input) {
        _id
        participants {
            _id
            name
            lastName
            age
            intolerances
            celiac
            vegetarian
            vegan
        }
    }
  }
`) as DocumentNode<unknown, unknown>;


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
    const client = await getClient();

    // Check for accommodation interest
    const isInterestedInAccommodation = formData.get("interestedInAccommodation") === "true";

    // Update main invitation details
    await client.mutate({
      mutation: UPDATE_INVITATION,
      variables: {
        id,
        input: {
          ...input,
          isInterestedInAccommodation
        }
      },
    });

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

        // We know value is string because FormData entries are [string, FormDataEntryValue] 
        // and we are using inputs which return strings.
        // However, TS checks might be strict.
        rawParticipants[index][field] = value as string;
      }
    }

    // Convert to array and format for GraphQL
    const participantsInput = Object.values(rawParticipants).map((p) => ({
      _id: p._id || undefined, // Only include if it exists and is not empty
      name: p.name,
      lastName: p.lastName,
      age: p.age as Age,
      intolerances: p.intolerances || "",
      celiac: p.celiac === "on",
      vegetarian: p.vegetarian === "on",
      vegan: p.vegan === "on"
    }));

    if (participantsInput.length > 0) {
      await client.mutate({
        mutation: UPDATE_PARTICIPANTS,
        variables: {
          id,
          input: {
            participants: participantsInput
          }
        }
      });
    }

    revalidatePath(`/participant/${id}`);
    revalidatePath(`/[locale]/participant/${id}`, 'page');

    return { success: true, message: "update.success", timestamp: Date.now() };
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, message: "update.failed", timestamp: Date.now() };
  }
}
