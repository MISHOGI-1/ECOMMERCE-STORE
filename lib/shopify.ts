import { GraphQLClient } from 'graphql-request';

let shopifyClientInstance: GraphQLClient | null = null;

export function getShopifyClient(): GraphQLClient {
  if (shopifyClientInstance) {
    return shopifyClientInstance;
  }

  const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
  const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Shopify credentials not configured');
  }

  let domain = SHOPIFY_STORE_DOMAIN;
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/$/, '');
  
  if (!domain.includes('.') && !domain.includes('myshopify')) {
    domain = `${domain}.myshopify.com`;
  }
  
  const endpoint = `https://${domain}/api/2024-10/graphql.json`;

  shopifyClientInstance = new GraphQLClient(endpoint, {
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  return shopifyClientInstance;
}

export const shopifyClient = {
  request: (...args: Parameters<GraphQLClient['request']>) => {
    return getShopifyClient().request(...args);
  },
};

export const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                }
                availableForSale
                quantityAvailable
                sku
              }
            }
          }
          tags
          productType
          vendor
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
            }
            availableForSale
            quantityAvailable
            sku
            selectedOptions {
              name
              value
            }
          }
        }
      }
      tags
      productType
      vendor
    }
  }
`;

export const CREATE_CHECKOUT_QUERY = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        lineItems(first: 250) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

export function transformShopifyProduct(shopifyProduct: any) {
  const images = shopifyProduct.images?.edges?.map((edge: any) => edge.node.url) || [];
  const firstVariant = shopifyProduct.variants?.edges?.[0]?.node;
  const price = parseFloat(firstVariant?.price?.amount || shopifyProduct.priceRange?.minVariantPrice?.amount || '0');
  const compareAtPrice = firstVariant?.compareAtPrice?.amount 
    ? parseFloat(firstVariant.compareAtPrice.amount)
    : shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
    : null;

  const inventory = shopifyProduct.variants?.edges?.reduce((sum: number, edge: any) => {
    return sum + (edge.node.quantityAvailable || 0);
  }, 0) || 0;

  return {
    id: shopifyProduct.id.split('/').pop(),
    shopifyId: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price: price,
    compareAtPrice: compareAtPrice,
    images: images,
    category: shopifyProduct.productType || shopifyProduct.tags?.[0] || 'Uncategorized',
    brand: shopifyProduct.vendor || null,
    sku: firstVariant?.sku || '',
    inventory: inventory,
    isActive: true,
    tags: shopifyProduct.tags || [],
    variants: shopifyProduct.variants?.edges?.map((edge: any) => ({
      id: edge.node.id.split('/').pop(),
      shopifyId: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable || 0,
      sku: edge.node.sku,
    })) || [],
  };
}

