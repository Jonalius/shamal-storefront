export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
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
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    requiresComponents
    components(first: 10) {
      nodes {
        productVariant {
          id
          title
          product {
            handle
          }
        }
        quantity
      }
    }
    groupedBy(first: 10) {
      nodes {
        id
        title
        product {
          handle
        }
      }
    }
  }
` as const;

export const PRODUCT_OPTION_FRAGMENT = `#graphql
  fragment ProductOption on ProductOption {
    name
    optionValues {
      name
      firstSelectableVariant {
        ...ProductVariant
      }
      swatch {
        color
        image {
          previewImage {
            url
            altText
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    publishedAt
    handle
    vendor
    tags
    description
    images(first: 50) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      ...ProductOption
    }
    badges: metafields(identifiers: [
      { namespace: "custom", key: "best_seller" }
    ]) {
      key
      namespace
      value
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    # Check if the product is a bundle
    isBundle: selectedOrFirstAvailableVariant(ignoreUnknownOptions: true, selectedOptions: { name: "", value: ""}) {
      ...on ProductVariant {
        requiresComponents
      }
    }
  }
  ${PRODUCT_OPTION_FRAGMENT}
`;

export const MEDIA_FRAGMENT = `#graphql
  fragment Media on Media {
    __typename
    mediaContentType
    alt
    previewImage {
      id
      url
      altText
      width
      height
    }
    ... on MediaImage {
      id
      image {
        id
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
` as const;

export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    sellingPlanAllocation {
      sellingPlan {
        name
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
        requiresComponents
        components(first: 10) {
          nodes {
            productVariant {
              id
              title
              product {
                handle
              }
            }
            quantity
          }
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    appliedGiftCards {
      id
      lastCharacters
      amountUsed {
        ...Money
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
      nodes {
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

/**
 * Full cart fragment for cart MUTATIONS (addLines, updateLines, …). Hydrogen's
 * default mutate fragment returns only a minimal cart (id, totalQuantity,
 * checkoutUrl) with no lines, so the cart action response can't render its
 * lines. Wiring this fragment (via the `cart.mutateFragment` context option)
 * makes the action response carry lines — required by the first-add resilience
 * fallback in `useResilientCartBase` to show the added line when the post-add
 * revalidation reads no cart cookie.
 *
 * It mirrors `CART_QUERY_FRAGMENT` but with two required differences:
 *  - Hydrogen's mutation document spreads a fragment named exactly
 *    `CartApiMutation`, so the top fragment must use that name.
 *  - Cart mutation operations do NOT declare a `$numCartLines` variable (cart
 *    queries do), so `lines` uses a literal `first: 100` instead of the
 *    variable.
 * Its sub-fragments are suffixed `Mutation` to avoid GraphQL-codegen duplicate
 * fragment-name collisions with `CART_QUERY_FRAGMENT`.
 */
export const CART_MUTATE_FRAGMENT = `#graphql
  fragment MoneyMutation on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLineMutation on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...MoneyMutation
      }
      amountPerQuantity {
        ...MoneyMutation
      }
      compareAtAmountPerQuantity {
        ...MoneyMutation
      }
    }
    sellingPlanAllocation {
      sellingPlan {
        name
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...MoneyMutation
        }
        price {
          ...MoneyMutation
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartLineComponentMutation on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...MoneyMutation
      }
      amountPerQuantity {
        ...MoneyMutation
      }
      compareAtAmountPerQuantity {
        ...MoneyMutation
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...MoneyMutation
        }
        price {
          ...MoneyMutation
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
        requiresComponents
        components(first: 10) {
          nodes {
            productVariant {
              id
              title
              product {
                handle
              }
            }
            quantity
          }
        }
      }
    }
  }
  fragment CartApiMutation on Cart {
    updatedAt
    id
    appliedGiftCards {
      id
      lastCharacters
      amountUsed {
        ...MoneyMutation
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      nodes {
        ...CartLineMutation
      }
      nodes {
        ...CartLineComponentMutation
      }
    }
    cost {
      subtotalAmount {
        ...MoneyMutation
      }
      totalAmount {
        ...MoneyMutation
      }
      totalDutyAmount {
        ...MoneyMutation
      }
      totalTaxAmount {
        ...MoneyMutation
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;
