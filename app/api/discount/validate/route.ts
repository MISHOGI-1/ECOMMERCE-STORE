import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: "Code is required" });
    }

    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode || !discountCode.isActive) {
      return NextResponse.json({ valid: false, error: "Invalid code" });
    }

    const now = new Date();
    if (now < discountCode.validFrom || now > discountCode.validUntil) {
      return NextResponse.json({ valid: false, error: "Code expired" });
    }

    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      return NextResponse.json({ valid: false, error: "Code usage limit reached" });
    }

    if (discountCode.minPurchase && subtotal < discountCode.minPurchase) {
      return NextResponse.json({
        valid: false,
        error: `Minimum purchase of £${discountCode.minPurchase} required`,
      });
    }

    let discount = 0;
    if (discountCode.type === "percentage") {
      discount = (subtotal * discountCode.value) / 100;
      if (discountCode.maxDiscount) {
        discount = Math.min(discount, discountCode.maxDiscount);
      }
    } else {
      discount = discountCode.value;
    }

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    console.error("Discount validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate code" },
      { status: 500 }
    );
  }
}

