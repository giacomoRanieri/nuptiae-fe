import { SanityImageSource } from "@sanity/image-url";
import { TypedObject } from "@portabletext/types";

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

export interface PoliciesData {
  head: {
    title: string;
  };
  cookiePolicy: {
    title: string;
    content: TypedObject;
  };
  privacyPolicy: {
    title: string;
    content: TypedObject;
  };
}

export interface FooterData {
  contacts: {
    email: string;
  };
  countdown: {
    date: string;
  };
}


export interface ParticipantPageData {
  header: {
    coupleNames: string;
    goToSite: string;
  };
  form: {
    title: string;
    headline: TypedObject | TypedObject[];
    willNotAttend: {
      title: string;
      description: TypedObject | TypedObject[];
      image: SanityImageSource;
    };
    willAttend: {
      title: string;
      description: TypedObject | TypedObject[];
      image: SanityImageSource;
      needAccommodationTitle: string;
      needAccommodationDescription: TypedObject | TypedObject[];
    };
  };
}
