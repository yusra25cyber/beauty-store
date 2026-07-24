"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { collections } from "@/data/collections";

const gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

export default function ShopByCollection() {
  return (
    <section className="py-16 md:py-24 bg-soft-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-2">
            Shop by Collection
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
            Discover Your Edit
          </h2>
          <p className="text-sm text-mid-gray mt-2 max-w-md">
            Curated collections for every mood, moment, and occasion.
          </p>
        </motion.div>

        <div className={`grid ${gridCols} gap-4 md:gap-5`}>
          {collections.map((col, index) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group relative overflow-hidden cursor-pointer aspect-[4/5]"
            >
              <Link href={`/collections/${col.slug}`} className="block w-full h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${col.heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-playfair font-bold text-white">
                    {col.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                    <span className="text-[9px] text-white/80 uppercase tracking-[0.2em] font-medium">
                      Explore
                    </span>
                    <span className="text-white/80 text-xs">&rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
