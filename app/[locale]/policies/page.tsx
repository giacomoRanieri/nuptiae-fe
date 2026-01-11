import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { client } from "@/lib/sanity";
import { PoliciesData } from "@/lib/types";
import { PortableText } from "next-sanity";
import styles from "./page.module.css";

export const revalidate = 60;

async function getPoliciesData(): Promise<PoliciesData> {
  return client.fetch(`
    *[_type == "policies"][0] {
      head,
      cookiePolicy,
      privacyPolicy
    }
  `);
}

export default async function Policies() {
  const policiesData = await getPoliciesData();

  return (
    <div>
      <Header />
      <main className={styles.container}>
        <h1>{policiesData.head.title}</h1>
        <h2 style={{ marginTop: "2rem" }}>{policiesData.cookiePolicy.title}</h2>
        <PortableText value={policiesData.cookiePolicy.content} />
        <h2 style={{ marginTop: "2rem" }}>
          {policiesData.privacyPolicy.title}
        </h2>
        <PortableText value={policiesData.privacyPolicy.content} />
      </main>
      <Footer />
    </div>
  );
}
