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
      <h2 className={styles.title}>Dashboard - Invitations</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Invitations</div>
          <div className={styles.statValue}>{totalInvitations}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Confirmed</div>
          <div className={styles.statValue} style={{ color: "#10B981" }}>
            {confirmedInvitations}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending</div>
          <div className={styles.statValue} style={{ color: "#F59E0B" }}>
            {pendingInvitations}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Refused</div>
          <div className={styles.statValue} style={{ color: "#EF4444" }}>
            {refusedInvitations}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Participants</div>
          <div className={styles.statValue}>{totalParticipants}</div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              marginTop: "0.25rem",
            }}
          >
            ({confirmedParticipants} from confirmed)
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <h3 style={{ margin: 0 }}>All Invitations</h3>
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
              <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                {invitation.participants?.length || 0} participants
              </div>
            </div>
            <div
              className={`${styles.statusBadge} ${styles[`status${invitation.confirmationStatus}`]}`}
            >
              {invitation.confirmationStatus}
            </div>
          </Link>
        ))}
        {invitations.length === 0 && (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}
          >
            No invitations found.
          </div>
        )}
      </div>

      <TokenRefresher />
    </div>
  );
}
