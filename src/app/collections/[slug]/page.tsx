"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/ui/Loader";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";
import { collections } from "@/data/collections";
import type { IProduct } from "@/types";

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const collection = collections.find((c) => c.slug === slug);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collection) return;
    setLoading(true);
    fetch(`/api/products?tag=${collection.tag}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collection]);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div
          className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${collection.heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-5">
            <p className="text-[10px] text-white/70 uppercase tracking-[0.25em] font-medium mb-3">
              Collection
            </p>
            <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-3">
              {collection.name}
            </h1>
            <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 md:py-16">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mid-gray text-sm">No products found in this collection.</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
