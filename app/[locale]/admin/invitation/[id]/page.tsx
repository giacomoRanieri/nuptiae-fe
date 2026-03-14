import { InvitationForm } from "@/app/components/InvitationForm";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { redirect } from "@/app/i18n";
import styles from "./page.module.css";
import { getClient } from "@/lib/api/graphql-client";
import { gql } from "@/lib/graphql";
import { GetInvitationQuery, InvitationDto } from "@/lib/graphql/graphql";
import { logger } from "@/lib/logger";

const GET_INVITATION = gql(`
  query GetInvitation($id: ID!) {
    invitation(id: $id) {
      _id
      recipient
      confirmationStatus
      phoneNumber
      email
      isInterestedInAccommodation
      participants {
        _id
        name
        lastName
        age
        celiac
        vegetarian
        vegan
        intolerances
      }
    }
  }
`);

export default async function AdminInvitationEdit({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  let invitationData: InvitationDto | null = null;
  let errorMsg = null;

  try {
    const client = await getClient();

    const { data } = await client.query<GetInvitationQuery>({
      query: GET_INVITATION,
      variables: { id },
    });
    invitationData = data?.invitation as InvitationDto;
  } catch (e) {
    logger.error("Error fetching invitation:", e);
    errorMsg = "Error loading invitation.";
  }

  if (errorMsg || !invitationData) {
    return redirect({ href: "/error", locale });
  }

  // Admin view uses the same InvitationForm, we can adjust pageData to not display the header text
  return (
    <div className={styles.editPanel}>
      <h2 className={styles.title}>
        Edit Invitation: {invitationData.recipient}
      </h2>
      <InvitationForm invitation={invitationData} />
      <TokenRefresher />
    </div>
  );
}
