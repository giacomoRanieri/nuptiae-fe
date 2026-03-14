import { TokenRefresher } from "@/app/components/TokenRefresher";
import { Link } from "@/app/i18n";
import { getClient } from "@/lib/api/graphql-client";
import { gql } from "@/lib/graphql";
import {
  ConfirmationStatus,
  InvitationDto,
  Query,
} from "@/lib/graphql/graphql";
import styles from "./page.module.css";
import { ExportButton } from "@/app/components/ExportButton";
import { getTranslations } from "next-intl/server";

const GET_ALL_INVITATIONS = gql(`
  query GetAllInvitations {
    invitations {
      _id
      recipient
      confirmationStatus
      participants {
        _id
        name
        lastName
        age
        celiac
        vegan
        vegetarian
        intolerances
      }
    }
  }
`);

export default async function AdminDashboardPage() {
  const t = await getTranslations("Admin.dashboard");
  const t2 = await getTranslations("InvitationForm");

  let invitations: InvitationDto[] = [];
  try {
    const client = await getClient();
    const { data } = await client.query<Query>({
      query: GET_ALL_INVITATIONS,
    });
    invitations = (data?.invitations as InvitationDto[]) || [];
  } catch (e) {
    console.error("Failed to load invitations", e);
  }

  const totalInvitations = invitations.length;
  const confirmedInvitations = invitations.filter(
    (i) => i.confirmationStatus === ConfirmationStatus.Confirmed,
  ).length;
  const pendingInvitations = invitations.filter(
    (i) => i.confirmationStatus === ConfirmationStatus.Pending,
  ).length;
  const refusedInvitations = invitations.filter(
    (i) => i.confirmationStatus === ConfirmationStatus.NotAttending,
  ).length;

  const totalParticipants = invitations.reduce(
    (acc, curr) => acc + (curr.participants?.length || 0),
    0,
  );
  const confirmedParticipants = invitations
    .filter((i) => i.confirmationStatus === ConfirmationStatus.Confirmed)
    .reduce((acc, curr) => acc + (curr.participants?.length || 0), 0);

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>{t("titleInvitations")}</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("totalInvitations")}</div>
          <div className={styles.statValue}>{totalInvitations}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("confirmed")}</div>
          <div className={`${styles.statValue} ${styles.textGreen}`}>
            {confirmedInvitations}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("pending")}</div>
          <div className={`${styles.statValue} ${styles.textOrange}`}>
            {pendingInvitations}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("refused")}</div>
          <div className={`${styles.statValue} ${styles.textRed}`}>
            {refusedInvitations}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("totalParticipants")}</div>
          <div className={styles.statValue}>{totalParticipants}</div>
          <div className={styles.statSubtext}>
            {t("fromConfirmed", { count: confirmedParticipants })}
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <h3 className={styles.actionBarTitle}>{t("allInvitations")}</h3>
        <ExportButton
          invitations={invitations.filter(
            (i) => i.confirmationStatus === ConfirmationStatus.Confirmed,
          )}
        />
      </div>

      <div className={styles.listContainer}>
        {invitations.map((invitation) => (
          <Link
            href={`/admin/invitation/${invitation._id}`}
            key={invitation._id}
            className={styles.listItem}
          >
            <div>
              <div className={styles.listRecipient}>{invitation.recipient}</div>
              <div className={styles.listParticipantCount}>
                {t("participantsCount", {
                  count: invitation.participants?.length || 0,
                })}
              </div>
            </div>
            <div
              className={`${styles.statusBadge} ${styles[`status${invitation.confirmationStatus}`]}`}
            >
              {t2(invitation.confirmationStatus.toLocaleLowerCase())}
            </div>
          </Link>
        ))}
        {invitations.length === 0 && (
          <div className={styles.emptyListMessage}>{t("noInvitations")}</div>
        )}
      </div>

      <TokenRefresher />
    </div>
  );
}
