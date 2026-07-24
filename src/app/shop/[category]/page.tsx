"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter, { MobileCategoryFilter } from "@/components/products/CategoryFilter";
import { ProductGridSkeleton } from "@/components/ui/Loader";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { IProduct, ICategory } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const cat = categories.find((c) => c.slug === categorySlug);
      const categoryId = cat?._id || categorySlug;
      const res = await fetch(`/api/products?category=${categoryId}`);
      const data = await res.json();
      setProducts(data.products || []);
      if (cat) setCurrentCategory(cat);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, categories]);

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

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories, fetchProducts]);

  const handleCategorySelect = (slug: string) => {
    if (slug) {
      window.location.href = `/shop/${slug}`;
    } else {
      window.location.href = "/shop";
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
              {currentCategory?.name || "Category"}
            </h1>
            {currentCategory?.description && (
              <p className="text-mid-gray text-sm mt-2 max-w-xl">{currentCategory.description}</p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-44 flex-shrink-0">
              <div className="hidden lg:block">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={categorySlug}
                />
              </div>
              <div className="lg:hidden mb-4">
                <MobileCategoryFilter
                  categories={categories}
                  selectedCategory={categorySlug}
                  onSelect={handleCategorySelect}
                />
              </div>
            </aside>
            <div className="flex-1 min-w-0">
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
