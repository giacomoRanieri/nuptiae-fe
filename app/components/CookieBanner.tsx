"use client";

import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";

export const CookieBanner = () => {
  const t = useTranslations("CookieBanner");

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("accept")}
      cookieName="nuptiae_cookie_consent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      {t("text")}
    </CookieConsent>
  );
};
