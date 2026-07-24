"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const fabrics = [
  {
    name: "European Linen",
    tagline: "Breathes with you. Softens with every wash.",
    description: "Premium Belgian linen sourced from the oldest linen mills in Europe. Naturally temperature-regulating, moisture-wicking, and gets softer the more you wear it.",
    image: "https://images.pexels.com/photos/31450892/pexels-photo-31450892.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    link: "/collections/linen-edit",
    label: "Explore The Linen Edit",
  },
  {
    name: "Italian Crepe",
    tagline: "Wrinkle-resistant. Polished. Effortless.",
    description: "High-twist Italian crepe that holds its shape and resists wrinkles. The fabric of choice for our Office Capsule — designed to go from desk to dinner without a second thought.",
    image: "https://images.pexels.com/photos/7163357/pexels-photo-7163357.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    link: "/collections/office-capsule",
    label: "Discover the Office Capsule",
  },
  {
    name: "Silk Charmeuse",
    tagline: "Liquid luxury. Ethereal drape.",
    description: "22-momme silk charmeuse with a subtle, luminous sheen. Each piece is cut on the bias for a fluid drape that skims the body. Reserved for our most special occasion pieces.",
    image: "https://images.pexels.com/photos/34701350/pexels-photo-34701350.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    link: "/collections/minimal-occasion-wear",
    label: "Shop Occasion Wear",
  },
];

export default function SignatureFabrics() {
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
            The Material Difference
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
            Signature Fabrics
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {fabrics.map((fabric, index) => (
            <motion.div
              key={fabric.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden aspect-[4/5] mb-5">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${fabric.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <p className="text-[10px] text-navy-light uppercase tracking-[0.2em] font-medium mb-1">
                {fabric.name}
              </p>
              <p className="text-sm font-medium text-deep-navy mb-2 leading-snug">
                {fabric.tagline}
              </p>
              <p className="text-xs text-mid-gray leading-relaxed mb-4">
                {fabric.description}
              </p>
              <Link
                href={fabric.link}
                className="text-[10px] text-deep-navy uppercase tracking-[0.2em] font-medium border-b border-deep-navy pb-0.5 hover:opacity-70 transition-opacity"
              >
                {fabric.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
