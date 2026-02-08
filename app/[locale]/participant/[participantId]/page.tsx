import { gql } from "@/lib/graphql";
import styles from "./page.module.css";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { GetInvitationQuery, InvitationDto } from "@/lib/graphql/graphql";
import { getClient } from "@/lib/api/graphql-client";
import { InvitationForm } from "@/app/components/InvitationForm";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { client } from "@/lib/sanity";
import { ParticipantPageData } from "@/lib/types";
import { PortableText } from "next-sanity";

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

async function getParticipantPageData() {
  return client.fetch<ParticipantPageData>(`
    *[_type == "participant"][0] {
      header,
      form {
        title,
        headline,
        willNotAttend,
        willAttend
      }
    }
  `);
}

export default async function ParticipantDetail({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = await params;
  const pageData = await getParticipantPageData();

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
          <h2 className={styles.namesBadge}>{pageData?.header.coupleNames}</h2>
        </div>
        <button type="button" className={styles.button}>
          {pageData?.header.goToSite}
        </button>
      </header>
      <div className={styles.bodyForm}>
        <h1 className={styles.title}>{pageData?.form.title}</h1>
        <div className={styles.headline}>
          {pageData?.form.headline ? (
            <PortableText value={pageData.form.headline} />
          ) : (
            <></>
          )}
        </div>
        <InvitationForm invitation={invitationData} pageData={pageData?.form} />
        <TokenRefresher />
      </div>
      <Footer />
    </div>
  );
}
