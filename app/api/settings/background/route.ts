import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.siteSettings.create({
        data: {
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      {
        backgroundType: "color",
        backgroundColor: "#ffffff",
        backgroundImage: null,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { backgroundType, backgroundColor, backgroundImage } = await request.json();

    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          backgroundType,
          backgroundColor: backgroundColor || settings.backgroundColor,
          backgroundImage: backgroundImage || settings.backgroundImage,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          backgroundType,
          backgroundColor: backgroundColor || "#ffffff",
          backgroundImage: backgroundImage || null,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

