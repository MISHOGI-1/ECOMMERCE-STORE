import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const useShopify = process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (useShopify) {
    try {
      const shopifyModule = await import("@/app/api/shopify/products/route");
      return shopifyModule.GET(request);
    } catch (error) {
      console.error("Error calling Shopify API:", error);
    }
  }
  
  const { prisma } = await import("@/lib/prisma");
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "newest";
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = {
        contains: category,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured) {
      where.inventory = { gt: 0 };
    }

    const orderBy: any = {};
    switch (sortBy) {
      case "price-low":
        orderBy.price = "asc";
        break;
      case "price-high":
        orderBy.price = "desc";
        break;
      case "name":
        orderBy.name = "asc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
    });

    const productsWithParsedImages = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
    }));

    return NextResponse.json({ products: productsWithParsedImages });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

