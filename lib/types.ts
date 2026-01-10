import { SanityImageSource } from "@sanity/image-url";

export interface HeroData {
  coupleNames: string;
  headline: string;
  heroImage: SanityImageSource;
}

export interface TimelineItem {
  title: string;
  description: string;
  image: SanityImageSource;
  imageSide: 'left' | 'right';
}

export interface EventDetails {
  date: string;
  dateBackground: SanityImageSource;
  dateImage: SanityImageSource;
  calendarName: string;
  locationName: string;
  address: string;
  locationMaps: string;
  locationImage: SanityImageSource;
}

export interface HomePageData {
    hero: HeroData;
    timeline: TimelineItem[];
    event: EventDetails;
}
