import { NextRequest, NextResponse } from "next/server";
import { getShopifyClient, GET_PRODUCT_BY_HANDLE_QUERY, transformShopifyProduct } from "@/lib/shopify";

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    // Check if Shopify is configured
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify not configured" },
        { status: 500 }
      );
    }

    const shopifyClient = getShopifyClient();
    const data: any = await shopifyClient.request(GET_PRODUCT_BY_HANDLE_QUERY, {
      handle: params.handle,
    });

    if (!data.product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = transformShopifyProduct(data.product);

    // Get reviews from our database (if you want to keep reviews)
    // This would require fetching from your Prisma database
    // For now, we'll return empty reviews array

    return NextResponse.json({
      product: {
        ...product,
        reviews: [],
        averageRating: 0,
        reviewCount: 0,
      },
    });
  } catch (error) {
    console.error("Shopify product API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product from Shopify" },
      { status: 500 }
    );
  }
}

