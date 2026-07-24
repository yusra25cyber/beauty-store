"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter, { MobileCategoryFilter } from "@/components/products/CategoryFilter";
import { ProductGridSkeleton, PageLoader } from "@/components/ui/Loader";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { IProduct, ICategory, SortOption } from "@/types";

const sortOptions: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      if (selectedCategory) params.set("category", selectedCategory);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, sort, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug) {
      router.push(`/shop/${slug}`, { scroll: false });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Catalogue</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              Shop All Products
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-44 flex-shrink-0">
              <div className="hidden lg:block">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                />
              </div>
              <div className="lg:hidden mb-4">
                <MobileCategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={handleCategorySelect}
                />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/50 focus:outline-none"
                    aria-label="Search products"
                  />
                </div>
                <div className="sm:w-36">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy focus:outline-none"
                    aria-label="Sort products"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <ProductGridSkeleton />
              ) : (
                <ProductGrid products={products} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ShopContent />
    </Suspense>
  );
}
