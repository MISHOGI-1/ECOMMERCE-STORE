"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Product {
  id: string;
  shopifyId?: string;
  shopifyVariantId?: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  inventory: number;
  variants?: Array<{
    id: string;
    shopifyId: string;
    title: string;
    price: number;
    availableForSale: boolean;
  }>;
}

export function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inventory > 0) {
      // Get the first available variant for Shopify checkout
      const firstVariant = product.variants?.find(v => v.availableForSale) || product.variants?.[0];
      
      addItem({
        productId: product.id,
        shopifyVariantId: firstVariant?.shopifyId || product.shopifyVariantId,
        shopifyId: product.shopifyId,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.jpg",
      });
      toast.success("Added to cart!");
    } else {
      toast.error("Product out of stock");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.jpg",
      });
      toast.success("Added to wishlist!");
    }
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{discount}%
            </div>
          )}
          {product.inventory === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full bg-white shadow-md ${
                isInWishlist ? "text-red-500" : "text-gray-600"
              } hover:scale-110 transition-transform`}
            >
              <FiHeart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>{product.inventory > 0 ? "Add to Cart" : "Out of Stock"}</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

