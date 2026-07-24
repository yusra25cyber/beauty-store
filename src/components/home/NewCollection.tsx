"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import type { IProduct } from "@/types";

interface NewCollectionProps {
  collectionSlug?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  viewAllLabel?: string;
}

export default function NewCollection({
  collectionSlug = "linen-edit",
  eyebrow = "Just Landed",
  title = "The Linen Edit",
  description = "Breathable European linen that softens with every wash — relaxed tailoring for the tropical climate.",
  viewAllLabel = "View All",
}: NewCollectionProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?tag=collection:${collectionSlug}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || data || []);
      } catch (err) {
        console.error("Error fetching collection products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [collectionSlug]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-soft-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-cool-ivory rounded w-24" />
            <div className="h-8 bg-cool-ivory rounded w-64" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-cool-ivory rounded" />
                  <div className="h-3 bg-cool-ivory rounded w-1/3" />
                  <div className="h-4 bg-cool-ivory rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-soft-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-2">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              {title}
            </h2>
            <p className="text-sm text-mid-gray mt-2 max-w-md">
              {description}
            </p>
          </div>
          <Link
            href={`/collections/${collectionSlug}`}
            className="hidden md:inline-flex items-center gap-1 text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium hover:text-deep-navy transition-colors"
          >
            {viewAllLabel}
            <span className="text-xs">&rarr;</span>
          </Link>
        </motion.div>

        <div className="hidden md:block">
          <div className="horizontal-scroll overflow-x-auto pb-4 -mx-5 sm:-mx-8 lg:-mx-10">
            <div className="flex gap-6 px-5 sm:px-8 lg:px-10" style={{ width: `${displayProducts.length * 320 + (displayProducts.length - 1) * 24}px` }}>
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[300px]"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/collections/${collectionSlug}`}
              className="inline-flex items-center gap-1 text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium hover:text-deep-navy transition-colors"
            >
              View All from {title}
              <span className="text-xs">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
