"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IProduct } from "@/types";

export default function FeaturedEditorial() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?tag=collection:tailored-essentials");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || data || []);
      } catch (err) {
        console.error("Error fetching editorial products:", err);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[4/5] bg-cool-ivory rounded" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-cool-ivory rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  const hero = products[0];
  const grid = products.slice(1, 5);

  if (grid.length < 4) return null;

  const heroImage = hero.images?.[0] || "";
  const heroCollectionSlug =
    hero.tags?.find((t: string) => t.startsWith("collection:"))?.replace("collection:", "") || "tailored-essentials";

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-2">
            Editor&rsquo;s Pick
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
            The Monochrome Study
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden aspect-[4/5] md:aspect-auto md:h-full min-h-[400px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-1">Tailored Essentials</p>
              <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white">Black + White in Dialogue</h3>
              <Link
                href={`/collections/${heroCollectionSlug}`}
                className="inline-flex items-center gap-1 mt-3 text-[10px] text-white uppercase tracking-[0.2em] font-medium border-b border-white/30 pb-0.5 hover:border-white transition-colors"
              >
                Explore the Look
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {grid.map((product, index) => {
              const img = product.images?.[0] || "";
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="relative overflow-hidden aspect-[3/4] group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Link
                      href={`/product/${product._id}`}
                      className="text-white text-xs font-medium hover:underline"
                    >
                      Shop the {product.name.replace(/^(Tailored |Structured |Cotton Poplin |Pencil )/, "").split(" ")[0]}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
