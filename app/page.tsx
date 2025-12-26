import { client } from '../lib/sanity';
import Header from './components/Header';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import WeddingDetails from './components/WeddingDetails';

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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <h1>Waiting for content...</h1>
        </div>
     )
  }

  const { hero, timeline, event } = data;

  return (
    <div>
      <Header />
      <main>
        <Hero data={hero} />
        <OurStory data={timeline} />
        <WeddingDetails data={event} />
      </main>
    </div>
  );
}
