import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GLOBAL CITY - Premium Men's Fashion & Accessories",
    template: "%s | GLOBAL CITY",
  },
  description: "Shop premium men's clothing and accessories at GLOBAL CITY. Discover stylish bags, hoodies, t-shirts, trousers, jackets, sneakers, and more. Free shipping on orders over £50.",
  keywords: [
    "men's fashion",
    "men's clothing",
    "men's accessories",
    "men's bags",
    "men's hoodies",
    "men's t-shirts",
    "men's trousers",
    "men's jackets",
    "men's sneakers",
    "men's boots",
    "men's gym wear",
    "fashion store",
    "online shopping",
    "GLOBAL CITY",
  ],
  authors: [{ name: "GLOBAL CITY" }],
  creator: "GLOBAL CITY",
  publisher: "GLOBAL CITY",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    siteName: "GLOBAL CITY",
    title: "GLOBAL CITY - Premium Men's Fashion & Accessories",
    description: "Shop premium men's clothing and accessories. Free shipping on orders over £50.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GLOBAL CITY - Men's Fashion Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLOBAL CITY - Premium Men's Fashion",
    description: "Shop premium men's clothing and accessories",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here when you get it
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

