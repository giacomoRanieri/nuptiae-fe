// import client from '../lib/contentful';
// import { GET_HOMEPAGE_CONTENT } from '../lib/graphql-queries';
import {
  mockHeader,
  mockHero,
  mockOurStory,
  mockWeddingDetails,
  mockGallery,
} from '../lib/mock-data';
import Header from './components/Header';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import WeddingDetails from './components/WeddingDetails';
import Gallery from './components/Gallery';

// async function getHomepageContent() {
//   const { data } = await client.query({
//     query: GET_HOMEPAGE_CONTENT,
//   });

//   const {
//     headerCollection,
//     heroCollection,
//     ourStoryCollection,
//     weddingDetailsCollection,
//     galleryCollection,
//   } = data;

//   const galleryData = galleryCollection.items[0];
//   const gallery = {
//     title: galleryData.title,
//     images: galleryData.imagesCollection.items,
//   };

//   return {
//     header: headerCollection.items[0],
//     hero: heroCollection.items[0],
//     ourStory: ourStoryCollection.items[0],
//     weddingDetails: weddingDetailsCollection.items[0],
//     gallery,
//   };
// }

export default async function Home() {
  // const { header, hero, ourStory, weddingDetails, gallery } = await getHomepageContent();

  const header = mockHeader;
  const hero = mockHero;
  const ourStory = mockOurStory;
  const weddingDetails = mockWeddingDetails;
  const gallery = mockGallery;

  return (
    <div>
      <Header data={header} />
      <main>
        <Hero data={hero} />
        <OurStory data={ourStory} />
        <WeddingDetails data={weddingDetails} />
        <Gallery data={gallery} />
      </main>
    </div>
  );
}
