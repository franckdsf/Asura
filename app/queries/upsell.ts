const UPSELL_PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment UpsellProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const UPSELL_PRODUCT_FRAGMENT = `#graphql
  fragment UpsellProduct on Product {
    id
    title
    vendor
    handle
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      values
    }
    variants(first: 250) {
      nodes {
        ...UpsellProductVariant
      }
    }
  }
  ${UPSELL_PRODUCT_VARIANT_FRAGMENT}
` as const;

export const UPSELL_PRODUCT_QUERY = `#graphql
  query UpsellProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...UpsellProduct
    }
  }
  ${UPSELL_PRODUCT_FRAGMENT}
` as const;