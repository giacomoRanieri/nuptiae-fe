import { gql } from "@/lib/graphql";
import styles from "./page.module.css";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { GetInvitationQuery, InvitationDto } from "@/lib/graphql/graphql";
import { getClient } from "@/lib/nuptiae-be-client";

const GET_INVITATION = gql(`
  query GetInvitation($id: ID!) {
    invitation(id: $id) {
      _id
      recipient
      confirmationStatus
      participants {
        _id
        name
        lastName
      }
    }
  }
`);

export default async function ParticipantDetail({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = await params;

  // Note: Middleware now intercepts ?token= and sets the cookie.
  // We can assume if we are here and authenticated, cookies() has the token.
  // If not authenticated, the query below might fail or return null, handling needed.

  let invitationData: InvitationDto | null = null;
  let authError = null;

  try {
    const client = await getClient();

    // Cast the result to the generated query type if inference fails with dynamic client
    const { data } = await client.query<GetInvitationQuery>({
      query: GET_INVITATION,
      variables: { id: participantId },
    });
    invitationData = data?.invitation as InvitationDto;
  } catch (e) {
    console.error("Error fetching invitation:", e);
    authError = "Error loading invitation. Please try logging in again.";
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  return (
    <div className={styles.page}>
      <h1>Hello {invitationData?.recipient}</h1>
      <TokenRefresher />
    </div>
  );
}
