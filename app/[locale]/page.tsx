import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import OurStory from "@/app/components/OurStory";
import WeddingDetails from "@/app/components/WeddingDetails";
import { client } from "@/lib/sanity";
import styles from "./page.module.css";

// Disable revalidation for now to ensure fresh data, or set revalidate time
export const revalidate = 60;

async function getHomeData() {
  return client.fetch(`
    *[_type == "home"][0] {
      hero,
      timeline,
      event
    }
  `);
}

export default async function Home() {
  const data = await getHomeData();

  if (!data) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
      >
        <h1>Waiting for content...</h1>
      </div>
    );
  }

  const { hero, timeline, event } = data;

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <Hero data={hero} />
        <OurStory data={timeline} />
        <WeddingDetails data={event} />
      </main>
      <Footer />
    </div>
  );
}
