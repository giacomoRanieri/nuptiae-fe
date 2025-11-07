import { gql } from "@apollo/client";

export const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent {
    headerCollection(limit: 1) {
      items {
        menuItems
      }
    }
    heroCollection(limit: 1) {
      items {
        title
        subtitle
        backgroundImage {
          url
        }
      }
    }
    ourStoryCollection(limit: 1) {
      items {
        title
        paragraphs
      }
    }
    weddingDetailsCollection(limit: 1) {
      items {
        title
        details
      }
    }
    galleryCollection(limit: 1) {
      items {
        title
        imagesCollection {
          items {
            url
          }
        }
      }
    }
  }
`;
