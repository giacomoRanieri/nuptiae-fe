import styles from "./Footer.module.css";
import Image from "next/image";
import { Link } from "@/app/i18n";
import { client } from "@/lib/sanity";
import { getTranslations } from "next-intl/server";
import { Countdown } from "./Countdown";

async function getFooterData() {
  return client.fetch(`
    *[_type == "footer"][0] {
      contacts,
      countdown
    }
  `);
}

export default async function Footer() {
  const data = await getFooterData();

  const t = await getTranslations("Footer");

  if (!data) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
      >
        <h1>Waiting for content...</h1>
      </div>
    );
  }

  const { contacts, countdown } = data;

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <Image src="/monogramma.png" alt="Logo" width={40} height={48} />
          <div className={styles.contacts}>
            <div className={styles.contactTitle}>{t("contactTitle")}</div>
            <Link href={`mailto:${contacts.email}`}>{contacts.email}</Link>
          </div>
        </div>
        <div className={styles.footerCenter}>
          {countdown?.date && <Countdown targetDate={countdown.date} />}
        </div>
        <div className={styles.footerRight}>
          <div className={styles.links}>
            <Link href="/policies" className={styles.link}>
              Privacy & CookiePolicy
            </Link>
            <Link
              href="https://github.com/giacomoRanieri/nuptiae-fe"
              className={styles.link}
            >
              @github
            </Link>
          </div>
          <div>Licenza GPLv3 - Powered by Next.js</div>
        </div>
      </footer>
      <div className={styles.copyright}>Copyright @2026 Giacomo & Loredana</div>
    </>
  );
}
