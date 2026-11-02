import { TokenRefresher } from "@/app/components/TokenRefresher";
import {
  ConfirmationStatus,
  InvitationDto,
  Age,
} from "@/lib/models/invitation";
import { authService } from "@/lib/server/services/auth.service";
import { invitationsService } from "@/lib/server/services/invitations.service";
import styles from "./page.module.css";
import { AdminListClient } from "@/app/components/AdminListClient";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage() {
  const t = await getTranslations("Admin.dashboard");

  let invitations: InvitationDto[] = [];
  try {
    const user = await authService.getAuthenticatedUser();
    invitations = await invitationsService.findAll(user);
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

  const totalChildren = invitations.reduce(
    (acc, curr) =>
      acc + (curr.participants?.filter((p) => p.age === Age.Child).length || 0),
    0,
  );

  const totalInfants = invitations.reduce(
    (acc, curr) =>
      acc +
      (curr.participants?.filter((p) => p.age === Age.Infant).length || 0),
    0,
  );

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
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("totalChildren")}</div>
          <div className={styles.statValue}>{totalChildren}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t("totalInfants")}</div>
          <div className={styles.statValue}>{totalInfants}</div>
        </div>
      </div>

      <AdminListClient invitations={invitations} />

      <TokenRefresher />
    </div>
  );
}
