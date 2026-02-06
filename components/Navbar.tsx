"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { FiSearch, FiUser, FiShoppingCart, FiHeart, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const categories = [
    "Bags",
    "Hoodies",
    "T-Shirts",
    "Trousers",
    "Jackets",
    "Boxers",
    "Singlets",
    "Boots",
    "Glasses",
    "Hats",
    "Socks",
    "Gym Wears",
    "Sneakers",
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-12 w-12 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-white border-2 border-primary-600 flex items-center justify-center">
                <img
                  src="/Neon-Green-and-Black-Graffiti-Urban-Grunge-Logo.png"
                  alt="GLOBAL CITY Logo"
                  className="h-full w-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="logo-fallback hidden w-full h-full bg-primary-600 rounded-full items-center justify-center absolute inset-0">
                  <span className="text-white font-bold text-xl">GC</span>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary-600">GLOBAL CITY</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2">
              <FiSearch className="w-6 h-6 text-gray-600" />
            </button>

            {session ? (
              <div className="relative group">
                <Link href="/account" className="p-2 relative">
                  <FiUser className="w-6 h-6 text-gray-600" />
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  {session.user?.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="p-2">
                <FiUser className="w-6 h-6 text-gray-600" />
              </Link>
            )}

            <Link href="/wishlist" className="p-2 relative">
              <FiHeart className="w-6 h-6 text-gray-600" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <Link href="/cart" className="p-2 relative">
              <FiShoppingCart className="w-6 h-6 text-gray-600" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-600" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 py-3 border-t border-gray-200">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

