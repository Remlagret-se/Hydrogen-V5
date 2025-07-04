export const HEADER_QUERY = `#graphql
  query Header(
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language) {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
    menu(handle: $headerMenuHandle) {
      id
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
        }
      }
    }
  }
` as const;

export const ROOT_COLLECTIONS_QUERY = `#graphql
  query RootCollections($language: LanguageCode) @inContext(language: $language) {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

export const FOOTER_QUERY = `#graphql
  query Footer(
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language) {
    shop {
      name
      description
    }
    menu(handle: $footerMenuHandle) {
      id
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
        }
      }
    }
  }
` as const;

export const fragments = {
  // Placeholder for fragment definitions
  default: {
    Header: HEADER_QUERY,
    Footer: FOOTER_QUERY,
    RootCollections: ROOT_COLLECTIONS_QUERY,
  },
  // Add more fragments as needed
}; 
