"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import type { IProduct } from "@/types";

export default function BestSellers() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?bestseller=true");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || data || []);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
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

  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-2">
            Customer Favourites
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
            Best Sellers
          </h2>
          <p className="text-sm text-mid-gray mt-2 max-w-md">
            The pieces our customers reach for again and again.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium hover:text-deep-navy transition-colors border-b border-mid-gray/30 pb-0.5"
          >
            View All Products
            <span>&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
