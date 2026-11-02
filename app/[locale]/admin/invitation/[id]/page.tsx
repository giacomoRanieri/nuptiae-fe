import { InvitationForm } from "@/app/components/InvitationForm";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { Link, redirect } from "@/app/i18n";
import styles from "./page.module.css";
import { ArrowLeft } from "lucide-react";
import { InvitationDto } from "@/lib/models/invitation";
import { logger } from "@/lib/logger";
import { client } from "@/lib/sanity/sanity";
import { ParticipantPageData } from "@/lib/sanity/types";
import { authService } from "@/lib/server/services/auth.service";
import { invitationsService } from "@/lib/server/services/invitations.service";
import { getTranslations } from "next-intl/server";

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
    const user = await authService.getAuthenticatedUser();
    invitationData = await invitationsService.findOne(id, user);
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
