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

// Temporarily revert to simple query structure
export const ROOT_COLLECTIONS_QUERY = `#graphql
  query RootCollections($language: LanguageCode) @inContext(language: $language) {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        description
        image {
          id
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

// Base image fragments (declared first)
export const IMAGE_FRAGMENT = `#graphql
  fragment Image on Image {
    id
    url
    altText
    width
    height
  }
` as const;

export const PRODUCT_IMAGE_FRAGMENT = `#graphql
  fragment ProductImage on ProductImage {
    id
    url
    altText
    width
    height
  }
` as const;

export const COLLECTION_IMAGE_FRAGMENT = `#graphql
  fragment CollectionImage on Image {
    id
    url
    altText
    width
    height
  }
` as const;

// Complex fragments that use base fragments
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    productType
    featuredImage {
      ...Image
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
  ${IMAGE_FRAGMENT}
` as const;

export const COLLECTION_CARD_FRAGMENT = `#graphql
  fragment CollectionCard on Collection {
    id
    title
    handle
    description
    image {
      ...CollectionImage
    }
  }
  ${COLLECTION_IMAGE_FRAGMENT}
` as const;

export const MENU_QUERY = `#graphql
  query Menu {
    menu(handle: "main-menu") {
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
          type
        }
      }
    }
  }
` as const;

export const COLLECTION_QUERY = `#graphql
  query Collections {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        description
        image {
          ...Image
        }
        products(first: 4) {
          nodes {
            ...ProductCard
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const fragments = {
  image: {
    Image: IMAGE_FRAGMENT,
    ProductImage: PRODUCT_IMAGE_FRAGMENT,
    CollectionImage: COLLECTION_IMAGE_FRAGMENT,
  },
  product: {
    ProductCard: PRODUCT_CARD_FRAGMENT,
  },
  collection: {
    CollectionCard: COLLECTION_CARD_FRAGMENT,
  },
  default: {
    Header: HEADER_QUERY,
    Footer: FOOTER_QUERY,
    RootCollections: ROOT_COLLECTIONS_QUERY,
  },
};
