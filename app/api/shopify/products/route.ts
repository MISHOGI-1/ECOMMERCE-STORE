import { NextRequest, NextResponse } from "next/server";
import { getShopifyClient, GET_PRODUCTS_QUERY, transformShopifyProduct } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify not configured", products: [] },
        { status: 500 }
      );
    }

    const shopifyClient = getShopifyClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "newest";
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search");

    let query = "";
    if (category) {
      query += `product_type:${category} OR tag:${category} `;
    }
    if (search) {
      query += `title:*${search}* OR tag:*${search}* `;
    }
    if (featured) {
      query += "tag:featured ";
    }

    const variables: any = {
      first: Math.min(limit, 250),
    };

    if (query) {
      variables.query = query.trim();
    }

    const data: any = await shopifyClient.request(GET_PRODUCTS_QUERY, variables);

    let products = (data.products?.edges || []).map((edge: any) =>
      transformShopifyProduct(edge.node)
    );

    if (minPrice || maxPrice) {
      products = products.filter((product: any) => {
        if (minPrice && product.price < parseFloat(minPrice)) return false;
        if (maxPrice && product.price > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    switch (sortBy) {
      case "price-low":
        products.sort((a: any, b: any) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a: any, b: any) => b.price - a.price);
        break;
      case "name":
        products.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Shopify products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products from Shopify", products: [] },
      { status: 500 }
    );
  }
}

