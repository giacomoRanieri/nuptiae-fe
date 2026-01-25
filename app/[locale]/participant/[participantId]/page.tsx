import { gql } from "@/lib/graphql";
import styles from "./page.module.css";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { GetInvitationQuery, InvitationDto } from "@/lib/graphql/graphql";
import { getClient } from "@/lib/api/graphql-client";
import { InvitationForm } from "@/app/components/InvitationForm";
import Header from "@/app/components/Header";
import Image from "next/image";

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

  // Note: Middleware now intercepts when the 'at' cookie is missing and sets it.
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

  if (!invitationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logoAndNames}>
          <div className={styles.dinos}>
            <Image src="/Dino.svg" alt="Dino" fill />
          </div>
          <h2 className={styles.namesBadge}>
            Giacomo & Loredana
          </h2>
        </div>
        <button type="button" className={styles.button}>
          Vai al sito
        </button>

      </header>
      <div className={styles.bodyForm}>
        <h1 className={styles.title}>Conferma la tua partecipazione</h1>
        <p className={styles.headline}>
          Ti diamo il benvenuto sul nostro sito e siamo lieti di invitarti al
          nostro matrimonio che si terrà
          <span className={styles.bold}> venerdì 11 Settembre 2026</span> presso il
          <span className={styles.bold}> Castello di Oviglio</span>
          (provincia di Alessandria). Compila questo form per
          farci sapere se parteciperai e darci alcune informazioni per accoglierti
          al meglio a questo giorno di festa.
        </p>
        <InvitationForm invitation={invitationData} />

        <TokenRefresher />

      </div>
    </div>
  );
}
