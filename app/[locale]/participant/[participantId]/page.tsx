import Footer from "@/app/components/Footer";
import { InvitationForm } from "@/app/components/InvitationForm";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { Link, redirect } from "@/app/i18n";
import { InvitationDto } from "@/lib/models/invitation";
import { logger } from "@/lib/logger";
import { client } from "@/lib/sanity/sanity";
import { ParticipantPageData } from "@/lib/sanity/types";
import { authService } from "@/lib/server/services/auth.service";
import { invitationsService } from "@/lib/server/services/invitations.service";
import { PortableText } from "next-sanity";
import Image from "next/image";
import styles from "./page.module.css";

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
    const user = await authService.getAuthenticatedUser();
    invitationData = await invitationsService.findOne(participantId, user);
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
