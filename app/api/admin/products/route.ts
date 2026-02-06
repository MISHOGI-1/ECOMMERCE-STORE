import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const productsWithParsedImages = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
    }));

    return NextResponse.json({ products: productsWithParsedImages });
  } catch (error) {
    console.error("Admin products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

