"use client";

import { LogOut } from "lucide-react";
import styles from "./LogOutButton.module.css";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function LogOutButton() {
  const t = useTranslations();
  const pathname = usePathname();

  if (pathname.includes("/admin/login")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      // Redirect to login page and refresh state
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
      <LogOut size={20} />
      <span className={styles.logoutText}>{t("Admin.dashboard.logout")}</span>
    </button>
  );
}
