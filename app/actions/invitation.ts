"use server";

import { gql } from "@/lib/graphql";
import {
    UpdateInvitationInput,
    UpdateInvitationParticipantsInput,
    ConfirmationStatus
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

        // Update main invitation details
        await client.mutate({
            mutation: UPDATE_INVITATION,
            variables: { id, input },
        });

        // Note: To handle participants update, we would need to parse participant data from formData
        // For now, focusing on the main "UpdateInvitationInput" fields per user request "form che quando conferma salva"

        revalidatePath(`/participant/${id}`);
        revalidatePath(`/[locale]/participant/${id}`, 'page');

        return { success: true, message: "Invitation Confirmed!" };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, message: "Failed to update invitation" };
    }
}
