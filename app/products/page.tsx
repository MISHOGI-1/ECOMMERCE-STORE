"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  inventory: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: category || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    params.append("sortBy", filters.sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  {showFilters ? <FiX /> : <FiFilter />}
                </button>
              </div>

              <div className="md:block hidden">
                <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value=""
                            checked={filters.category === ""}
                            onChange={(e) =>
                              setFilters({ ...filters, category: e.target.value })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">All Categories</span>
                        </label>
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center">
                            <input
                              type="radio"
                              name="category"
                              value={cat.toLowerCase().replace(/\s+/g, "-")}
                              checked={
                                filters.category === cat.toLowerCase().replace(/\s+/g, "-")
                              }
                              onChange={(e) =>
                                setFilters({ ...filters, category: e.target.value })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-600">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Min Price"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max Price"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters({ ...filters, sortBy: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                      </select>
                    </div>
                </div>
              </div>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden space-y-6"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="category-mobile"
                            value=""
                            checked={filters.category === ""}
                            onChange={(e) =>
                              setFilters({ ...filters, category: e.target.value })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">All Categories</span>
                        </label>
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center">
                            <input
                              type="radio"
                              name="category-mobile"
                              value={cat.toLowerCase().replace(/\s+/g, "-")}
                              checked={
                                filters.category === cat.toLowerCase().replace(/\s+/g, "-")
                              }
                              onChange={(e) =>
                                setFilters({ ...filters, category: e.target.value })
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-600">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Min Price"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max Price"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters({ ...filters, sortBy: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {filters.category
                  ? categories.find(
                      (c) =>
                        c.toLowerCase().replace(/\s+/g, "-") === filters.category
                    ) || "Products"
                  : "All Products"}
              </h1>
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

