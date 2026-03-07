import Footer from "@/app/components/Footer";
import { InvitationForm } from "@/app/components/InvitationForm";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { Link, redirect } from "@/app/i18n";
import { getClient } from "@/lib/api/graphql-client";
import { gql } from "@/lib/graphql";
import { GetInvitationQuery, InvitationDto } from "@/lib/graphql/graphql";
import { logger } from "@/lib/logger";
import { client } from "@/lib/sanity";
import { ParticipantPageData } from "@/lib/types";
import { PortableText } from "next-sanity";
import Image from "next/image";
import styles from "./page.module.css";

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
  params: Promise<{ locale: string; participantId: string }>;
}) {
  const { locale, participantId } = await params;
  const pageData = await getParticipantPageData();

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
    logger.error("Error fetching invitation:", e);
    authError = "Error loading invitation. Please try logging in again.";
  }

  if (authError || !invitationData) {
    return redirect({ href: "/error", locale });
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
        <Link href="/" className={styles.button}>
          {pageData?.header.goToSite}
        </Link>
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
