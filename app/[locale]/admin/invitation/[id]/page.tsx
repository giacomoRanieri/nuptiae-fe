import { InvitationForm } from "@/app/components/InvitationForm";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { Link, redirect } from "@/app/i18n";
import styles from "./page.module.css";
import { ArrowLeft } from "lucide-react";
import { getClient } from "@/lib/api/graphql-client";
import { gql } from "@/lib/graphql";
import { GetInvitationQuery, InvitationDto } from "@/lib/graphql/graphql";
import { logger } from "@/lib/logger";
import { client } from "@/lib/sanity/sanity";
import { ParticipantPageData } from "@/lib/sanity/types";
import { getTranslations } from "next-intl/server";

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

export default async function AdminInvitationEdit({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("Admin.invitationDetail");

  const pageData = await getParticipantPageData();

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
    errorMsg = t("errorLoading");
  }

  if (errorMsg || !invitationData) {
    return redirect({ href: "/error", locale });
  }

  // Admin view uses the same InvitationForm, we can adjust pageData to not display the header text
  return (
    <div className={styles.editPanel}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.backLink}>
          <ArrowLeft size={16} />
          {t("goBack")}
        </Link>
        <h2 className={styles.title}>
          {t("editTitle", { recipient: invitationData.recipient })}
        </h2>
      </div>
      <InvitationForm invitation={invitationData} pageData={pageData?.form} />
      <TokenRefresher />
    </div>
  );
}
