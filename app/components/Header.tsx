"use client";

import { Upload, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/app/i18n";
import { env } from "process";
import styles from "./Header.module.css";

const isPhotoUploadEnabled = env.NEXT_PUBLIC_ENABLE_PHOTO_UPLOAD === "true";
const isUserIconEnabled = env.NEXT_PUBLIC_ENABLE_USER_ICON === "true";

export default function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const getLink = (anchor: string) => {
    return isHome ? `#${anchor}` : `/#${anchor}`;
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.links}>
          <Link href={getLink("welcome")} className={styles.link}>
            {t("welcome")}
          </Link>
          <Link href={getLink("story")} className={styles.link}>
            {t("ourStory")}
          </Link>
          <Link href={getLink("details")} className={styles.link}>
            {t("details")}
          </Link>
        </div>
        {(isPhotoUploadEnabled || isUserIconEnabled) && (
          <div className={styles.actions}>
            {isPhotoUploadEnabled && (
              <button className={styles.uploadBtn}>
                {t("uploadPhoto")}{" "}
                <Upload size={14} style={{ marginLeft: 4 }} />
              </button>
            )}
            {isUserIconEnabled && (
              <User size={20} className={styles.userIcon} />
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
