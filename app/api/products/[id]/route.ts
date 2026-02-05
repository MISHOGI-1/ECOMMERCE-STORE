import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check if Shopify is configured
  const useShopify = process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (useShopify) {
    // Directly import and call Shopify API handler
    try {
      const shopifyModule = await import("@/app/api/shopify/products/[handle]/route");
      return shopifyModule.GET(request, { params: { handle: params.id } });
    } catch (error) {
      console.error("Shopify product fetch error:", error);
      // Fall through to local database
    }
  }
  
  // Fallback to local database
  const { prisma } = await import("@/lib/prisma");
  
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviews = product.reviews;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const productWithParsedImages = {
      ...product,
      images: JSON.parse(product.images || "[]"),
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    };

    return NextResponse.json({ product: productWithParsedImages });
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

