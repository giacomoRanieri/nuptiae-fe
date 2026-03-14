import { TokenRefresher } from "@/app/components/TokenRefresher";
import { useTranslations } from "next-intl";
import styles from "./page.module.css";

export default function AdminDashboardPage() {
  const t = useTranslations("Admin");

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard</h2>
      <p className={styles.text}>
        Welcome to the admin panel. Use the URL to navigate to specific invitations for now.
      </p>
      <TokenRefresher />
    </div>
  );
}