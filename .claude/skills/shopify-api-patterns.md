# Shopify Storefront API Patterns for Shamal

## Product Query Pattern

```typescript
// app/graphql/products.ts
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
      metafield(namespace: "shamal", key: "fragrance_notes") {
        value
      }
    }
  }
`
```

## Metafields for Fragrance Notes

Shamal products use metafields for structured fragrance data.
Namespace: `shamal`

Keys:
- `fragrance_notes_top` — comma separated top notes
- `fragrance_notes_heart` — comma separated heart notes
- `fragrance_notes_base` — comma separated base notes
- `moment_number` — "01", "02", "03"
- `moment_subtitle` — e.g. "Autumn forest after rain"

## Cart Operations

Always use Hydrogen's built-in cart utilities:
```typescript
import { CartForm } from '@shopify/hydrogen'
// Do not build custom cart fetch logic
```

## API Version

Always use: `2025-01`
Set in PUBLIC_STOREFRONT_API_VERSION env variable.
