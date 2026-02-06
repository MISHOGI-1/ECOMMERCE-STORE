import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const defaultAddress = user.addresses[0] || null;

    return NextResponse.json({
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      location: user.location,
      preferences: user.preferences,
      favoriteStyles: user.favoriteStyles,
      address: defaultAddress
        ? {
            addressLine1: defaultAddress.addressLine1,
            addressLine2: defaultAddress.addressLine2,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipCode: defaultAddress.zipCode,
            country: defaultAddress.country,
          }
        : {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "UK",
          },
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      nickname,
      phone,
      location,
      preferences,
      favoriteStyles,
      address,
    } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
        nickname: nickname || null,
        phone: phone || null,
        location: location || null,
        preferences: preferences || null,
        favoriteStyles: favoriteStyles || null,
      },
    });

    if (address && address.addressLine1) {
      const existingAddress = user.addresses[0];
      if (existingAddress) {
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            fullName: name || user.name || "",
            phone: phone || user.phone || "",
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || null,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country || "UK",
          },
        });
      } else {
        await prisma.address.create({
          data: {
            userId: user.id,
            fullName: name || user.name || "",
            phone: phone || user.phone || "",
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || null,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country || "UK",
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

