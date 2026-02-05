"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { FiUser, FiMail, FiPackage, FiHeart } from "react-icons/fi";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/account/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FiUser className="w-12 h-12 text-primary-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile</h2>
            <p className="text-gray-600">Manage your personal information</p>
          </Link>

          <Link
            href="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FiPackage className="w-12 h-12 text-primary-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Orders</h2>
            <p className="text-gray-600">View your order history</p>
          </Link>

          <Link
            href="/wishlist"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FiHeart className="w-12 h-12 text-primary-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Wishlist</h2>
            <p className="text-gray-600">Your saved items</p>
          </Link>

          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <FiMail className="w-12 h-12 text-primary-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Admin</h2>
              <p className="text-gray-600">Admin dashboard</p>
            </Link>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.name || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

