"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const heroBg = "https://images.pexels.com/photos/31450892/pexels-photo-31450892.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-navy">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 8, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-px h-32 bg-white/10" />
        <div className="absolute top-20 left-14 w-20 h-px bg-white/10" />
        <div className="absolute bottom-20 right-10 w-px h-32 bg-white/10" />
        <div className="absolute bottom-20 right-14 w-20 h-px bg-white/10" />
      </div>

      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/60 text-xs tracking-[0.3em] uppercase font-medium mb-6"
        >
          Cloudnin3 — Premium Contemporary Modest Fashion
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white leading-none mb-6 tracking-tight"
        >
          Modern Modest.<br />Designed in KL.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/70 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Architectural silhouettes, premium fabrics, effortless elegance. Discover contemporary modest fashion crafted for the woman who moves through the world with purpose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/collections/linen-edit"
            className="px-8 py-3 bg-soft-white text-deep-navy text-xs tracking-[0.2em] uppercase font-medium hover:bg-white transition-all duration-500"
          >
            Discover The Linen Edit
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/10 transition-all duration-500"
          >
            Shop All Collections
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-white/30"
        />
      </motion.div>
    </section>
  );
}
