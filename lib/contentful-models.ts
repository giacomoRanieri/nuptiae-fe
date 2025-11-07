export interface Header {
  menuItems: {
    label: string;
    url: string;
  }[];
}

export interface Hero {
  title: string;
  subtitle: string;
  backgroundImage: {
    url: string;
  };
}

export interface OurStory {
  title: string;
  paragraphs: string[];
}

export interface WeddingDetails {
  title: string;
  details: {
    title: string;
    description: string;
  }[];
}

export interface Gallery {
  title: string;
  images: {
    url: string;
  }[];
}
