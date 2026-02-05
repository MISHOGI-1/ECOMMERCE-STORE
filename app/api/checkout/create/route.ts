import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingAddress, discountCode, discount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Check if Shopify is configured
    const useShopify = process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    if (useShopify) {
      // Use Shopify checkout
      const shopifyResponse = await fetch(new URL('/api/shopify/checkout', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, discountCode, discount }),
      });
      
      const shopifyData = await shopifyResponse.json();
      
      if (shopifyData.url) {
        // Save order reference to database (optional)
        const { prisma } = await import("@/lib/prisma");
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        
        if (user) {
          const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
          const shipping = subtotal >= 50 ? 0 : 4.99;
          const total = subtotal + shipping - (discount || 0);
          
          await prisma.order.create({
            data: {
              userId: user.id,
              orderNumber: `GC-${Date.now()}`,
              status: "pending",
              subtotal,
              shipping,
              tax: 0,
              discount: discount || 0,
              discountCode: discountCode || null,
              total,
              shippingAddress: JSON.stringify(shippingAddress),
              paymentMethod: "shopify",
              paymentStatus: "pending",
              paymentIntentId: shopifyData.checkoutId,
            },
          });
        }
        
        return NextResponse.json({ url: shopifyData.url });
      }
      
      return NextResponse.json(shopifyData, { status: shopifyResponse.status });
    }
    
    // Fallback to Stripe checkout (original implementation)
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-12-18.acacia",
    });
    
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal >= 50 ? 0 : 4.99;
    const total = subtotal + shipping - (discount || 0);

    const orderNumber = `GC-${Date.now()}`;
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        status: "pending",
        subtotal,
        shipping,
        tax: 0,
        discount: discount || 0,
        discountCode: discountCode || null,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: "stripe",
        paymentStatus: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

