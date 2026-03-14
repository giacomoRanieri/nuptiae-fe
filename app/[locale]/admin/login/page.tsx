"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import styles from "./login.module.css";
import { logger } from "@/lib/logger";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Redirect to admin dashboard
        router.push(`/${locale}/admin`);
      } else {
        const data = await res.json();
        setError(data.message || t("Admin.login.error"));
      }
    } catch (err) {
      logger.error("Login failed", err);
      setError(t("Admin.login.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.formPanel}>
        <h1 className={styles.title}>{t("Admin.login.title")}</h1>

        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">
            {t("Admin.login.username")}
          </label>
          <input
            id="username"
            autoComplete="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroupLast}>
          <label className={styles.label} htmlFor="password">
            {t("Admin.login.password")}
          </label>
          <input
            id="password"
            autoComplete="current-password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? t("Admin.login.signingIn") : t("Admin.login.submit")}
        </button>
      </form>
    </div>
  );
}
