"use client";

import { useState, useMemo } from "react";
import { Link } from "@/app/i18n";
import { useTranslations, useLocale } from "next-intl";
import { ConfirmationStatus, InvitationDto } from "@/lib/graphql/graphql";
import { ExportButton } from "./ExportButton";
import { SuccessModal } from "./SuccessModal";
import pageStyles from "../[locale]/admin/page.module.css";
import filterStyles from "./AdminListClient.module.css";
import { Share2 } from "lucide-react";

export function AdminListClient({ invitations }: { invitations: InvitationDto[] }) {
  const t = useTranslations("Admin.dashboard");
  const t2 = useTranslations("InvitationForm");
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [accommodationFilter, setAccommodationFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NAME"); // NAME, STATUS, ACCOMMODATION
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    return invitations
      .filter((inv) => {
        // Search
        const searchLower = search.toLowerCase();
        if (
          searchLower &&
          !inv.recipient.toLowerCase().includes(searchLower) &&
          !inv.participants?.some(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              p.lastName.toLowerCase().includes(searchLower)
          )
        ) {
          return false;
        }

        // Status Filter
        if (statusFilter !== "ALL" && inv.confirmationStatus !== statusFilter) {
          return false;
        }

        // Accommodation Filter
        if (accommodationFilter !== "ALL") {
          const needsAcc = accommodationFilter === "YES";
          if (inv.isInterestedInAccommodation !== needsAcc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "NAME":
            return a.recipient.localeCompare(b.recipient);
          case "STATUS":
            return a.confirmationStatus.localeCompare(b.confirmationStatus);
          case "ACCOMMODATION":
            return Number(b.isInterestedInAccommodation) - Number(a.isInterestedInAccommodation);
          default:
            return 0;
        }
      });
  }, [invitations, search, statusFilter, accommodationFilter, sortBy]);

  const handleShare = async (e: React.MouseEvent, invitation: InvitationDto) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = new URL(`${window.location.origin}/${locale}/participant/${invitation._id}`);
    if (invitation.secret) {
      url.searchParams.set('token', invitation.secret);
    }
    
    try {
      await navigator.clipboard.writeText(url.toString());
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <>
      <div className={pageStyles.actionBar}>
        <h3 className={pageStyles.actionBarTitle}>{t("allInvitations")}</h3>
        <ExportButton
          invitations={filteredAndSorted.filter(
            (i) => i.confirmationStatus === ConfirmationStatus.Confirmed
          )}
        />
      </div>

      <div className={filterStyles.filterBar}>
        <div className={filterStyles.filterGroup}>
          <label>{t("searchInvitations")}</label>
          <input
            type="text"
            className={filterStyles.input}
            placeholder={t("searchInvitations")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={filterStyles.filterGroup}>
          <label>{t("filterStatus")}</label>
          <select
            className={filterStyles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">{t("all")}</option>
            <option value={ConfirmationStatus.Confirmed}>{t2(ConfirmationStatus.Confirmed.toLocaleLowerCase())}</option>
            <option value={ConfirmationStatus.Pending}>{t2(ConfirmationStatus.Pending.toLocaleLowerCase())}</option>
            <option value={ConfirmationStatus.NotAttending}>{t2(ConfirmationStatus.NotAttending.toLocaleLowerCase())}</option>
          </select>
        </div>

        <div className={filterStyles.filterGroup}>
          <label>{t("filterAccommodation")}</label>
          <select
            className={filterStyles.select}
            value={accommodationFilter}
            onChange={(e) => setAccommodationFilter(e.target.value)}
          >
            <option value="ALL">{t("all")}</option>
            <option value="YES">{t("yes")}</option>
            <option value="NO">{t("no")}</option>
          </select>
        </div>

        <div className={filterStyles.filterGroup}>
          <label>{t("sortBy")}</label>
          <select
            className={filterStyles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="NAME">{t("sortByName")}</option>
            <option value="STATUS">{t("sortByStatus")}</option>
            <option value="ACCOMMODATION">{t("sortByAccommodation")}</option>
          </select>
        </div>
      </div>

      <div className={pageStyles.listContainer}>
        {filteredAndSorted.map((invitation) => (
          <Link
            href={`/admin/invitation/${invitation._id}`}
            key={invitation._id}
            className={pageStyles.listItem}
          >
            <div>
              <div className={pageStyles.listRecipient}>{invitation.recipient}</div>
              <div className={pageStyles.listParticipantCount}>
                {t("participantsCount", {
                  count: invitation.participants?.length || 0,
                })}
              </div>
              {invitation.isInterestedInAccommodation && (
                <div className={filterStyles.accommodationBadge}>
                  {t("needsAccommodation")}
                </div>
              )}
            </div>
            <div className={filterStyles.actionsGroup}>
              <div
                className={`${pageStyles.statusBadge} ${pageStyles[`status${invitation.confirmationStatus}`]}`}
              >
                {t2(invitation.confirmationStatus.toLocaleLowerCase())}
              </div>
              <button 
                className={filterStyles.shareButton}
                onClick={(e) => handleShare(e, invitation)}
                title={t("shareLink") || "Share link"}
              >
                <Share2 size={20} />
              </button>
            </div>
          </Link>
        ))}
        {filteredAndSorted.length === 0 && (
          <div className={pageStyles.emptyListMessage}>{t("noInvitations")}</div>
        )}
      </div>
      <SuccessModal
        title={t("linkCopiedTitle") || "Success"}
        message={[
          {
            _type: 'block',
            _key: 'link-copied-block',
            children: [
              {
                _type: 'span',
                _key: 'link-copied-span',
                text: t("linkCopied") || "Link copied to clipboard!",
              },
            ],
          },
        ]}
        close={t("close") || "Close"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
