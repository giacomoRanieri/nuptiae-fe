import { useTranslations } from "next-intl";
import Footer from "@/app/components/Footer";
import styles from "../page.module.css";
import { Link as IntlLink } from "@/app/i18n";

export default function ErrorPage() {
  const t = useTranslations("ErrorPage");

  return (
    <div>
      <main
        className={styles.main}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "var(--color-terracotta)",
          }}
        >
          {t("title")}
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "2rem",
            maxWidth: "600px",
          }}
        >
          {t("description")}
        </p>
        <IntlLink
          href="/"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--color-terracotta)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          {t("backHome")}
        </IntlLink>
      </main>
      <Footer />
    </div>
  );
}
