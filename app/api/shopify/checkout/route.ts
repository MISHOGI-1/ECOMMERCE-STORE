import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getShopifyClient, CREATE_CHECKOUT_QUERY } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    // Check if Shopify is configured
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify not configured" },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopifyClient = getShopifyClient();

    const { items, discountCode, discount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Convert cart items to Shopify line items
    const lineItems = items
      .filter((item: any) => item.shopifyVariantId) // Only include items with Shopify variant IDs
      .map((item: any) => ({
        variantId: item.shopifyVariantId,
        quantity: item.quantity,
      }));
    
    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid Shopify products in cart. Please ensure products are from Shopify." },
        { status: 400 }
      );
    }

    // Create Shopify checkout
    const variables = {
      input: {
        lineItems: lineItems,
        ...(discountCode && { discountCodes: [discountCode] }),
      },
    };

    const data: any = await shopifyClient.request(CREATE_CHECKOUT_QUERY, variables);

    if (data.checkoutCreate?.checkoutUserErrors?.length > 0) {
      return NextResponse.json(
        { error: data.checkoutCreate.checkoutUserErrors[0].message },
        { status: 400 }
      );
    }

    const checkout = data.checkoutCreate?.checkout;

    if (!checkout) {
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 }
      );
    }

    // Save order to database (optional - for tracking)
    // You can save the checkout ID to track orders

    return NextResponse.json({
      url: checkout.webUrl,
      checkoutId: checkout.id,
    });
  } catch (error) {
    console.error("Shopify checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

