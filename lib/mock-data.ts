import { Header, Hero, OurStory, WeddingDetails, Gallery } from './contentful-models';

export const mockHeader: Header = {
  menuItems: [
    { label: 'Home', url: '/' },
    { label: 'Our Story', url: '#our-story' },
    { label: 'Wedding Details', url: '#wedding-details' },
    { label: 'Gallery', url: '#gallery' },
  ],
};

export const mockHero: Hero = {
  title: 'Giacomo & Loredana',
  subtitle: "We're getting married!",
  backgroundImage: {
    url: 'https://images.unsplash.com/photo-1523438943922-386d773347f2?q=80&w=2070&auto=format&fit=crop',
  },
};

export const mockOurStory: OurStory = {
  title: 'Our Story',
  paragraphs: [
    'Our love story began in the most unexpected of places, a bustling coffee shop in the heart of the city. A spilled latte and a shared laugh were all it took to spark a connection that would change our lives forever.',
    "From that day forward, our adventures have taken us from sun-drenched beaches to snow-capped mountains. We've shared dreams, overcome challenges, and built a life filled with love, laughter, and endless support. We can't wait to start our next chapter as husband and wife.",
  ],
};

export const mockWeddingDetails: WeddingDetails = {
  title: 'Wedding Details',
  details: [
    {
      title: 'The Ceremony',
      description: 'Join us as we say "I do" at the beautiful Lakeside Gardens. The ceremony will begin promptly at 2:00 PM.',
    },
    {
      title: 'The Reception',
      description: 'Celebrate with us after the ceremony for an evening of dinner, dancing, and making memories at The Grand Ballroom, starting at 5:00 PM.',
    },
  ],
};

export const mockGallery: Gallery = {
  title: 'Gallery',
  images: [
    { url: 'https://images.unsplash.com/photo-1511285560921-26c82e389b0f?q=80&w=2070&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1520854221256-17452cc3da25?q=80&w=2070&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1485546246426-745a8dec9f5a?q=80&w=2070&auto=format&fit=crop' },
  ],
};
