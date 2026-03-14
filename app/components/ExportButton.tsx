"use client";

import { InvitationDto } from "@/lib/graphql/graphql";
import { useState } from "react";
import styles from "./ExportButton.module.css";
import { useTranslations } from "next-intl";

export function ExportButton({ invitations }: { invitations: InvitationDto[] }) {
  const t = useTranslations("Admin.dashboard");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      // CSV Header
      let csvContent = "Invitation Recipient,Participant First Name,Participant Last Name,Age,Celiac,Vegetarian,Vegan,Intolerances\n";

      invitations.forEach((invitation) => {
        if (!invitation.participants) return;

        invitation.participants.forEach((p) => {
          const row = [
            `"${invitation.recipient}"`,
            `"${p.name}"`,
            `"${p.lastName}"`,
            `"${p.age}"`,
            p.celiac ? "Yes" : "No",
            p.vegetarian ? "Yes" : "No",
            p.vegan ? "Yes" : "No",
            `"${p.intolerances || ""}"`
          ].join(",");
          csvContent += row + "\n";
        });
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `participants_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={styles.exportBtn}
      title={invitations.length === 0 ? t("noExport") : ""}
    >
      {isExporting ? t("exporting") : t("export")}
    </button>
  );
}
