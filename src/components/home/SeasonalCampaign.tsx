"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SeasonalCampaignProps {
  slug?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  ctaLabel?: string;
}

const defaultBg = "https://images.pexels.com/photos/7163357/pexels-photo-7163357.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

export default function SeasonalCampaign({
  slug = "office-capsule",
  eyebrow = "Seasonal Edit",
  title = "The Office<br />Capsule",
  description = "Polished professionalism without compromise. Sharp tailoring, refined fabrics, and versatile pieces that take you from desk to dinner.",
  backgroundImage = defaultBg,
  ctaLabel = "Shop the Collection",
}: SeasonalCampaignProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-warm-black">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 6, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <p className="text-navy-light text-xs tracking-[0.3em] uppercase font-medium mb-4">
            {eyebrow}
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8">
            {description}
          </p>
          <Link
            href={`/collections/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-soft-white text-deep-navy text-xs tracking-[0.2em] uppercase font-medium hover:bg-white transition-all duration-500 group"
          >
            {ctaLabel}
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
