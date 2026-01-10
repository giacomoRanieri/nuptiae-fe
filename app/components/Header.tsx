import Link from "next/link";
import { User, Upload } from "lucide-react";
import styles from "./Header.module.css";
import { env } from "process";
import { useTranslations } from "next-intl";

const isPhotoUploadEnabled = env.NEXT_PUBLIC_ENABLE_PHOTO_UPLOAD === "true";
const isUserIconEnabled = env.NEXT_PUBLIC_ENABLE_USER_ICON === "true";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.links}>
          <Link href="#welcome" className={styles.link}>
            {t("welcome")}
          </Link>
          <Link href="#story" className={styles.link}>
            {t("ourStory")}
          </Link>
          <Link href="#details" className={styles.link}>
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
