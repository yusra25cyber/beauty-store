"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";

const pillars = [
  {
    title: "Heritage",
    description: "Rooted in Malaysian tradition, every design draws inspiration from the rich tapestry of Malay culture — from the intricate songket patterns of Terengganu to the batik craftsmanship of Kelantan.",
  },
  {
    title: "Craft",
    description: "We work directly with Malaysian artisans and small-batch ateliers who bring generations of expertise to every piece. Each garment is individually cut, assembled, and finished by hand.",
  },
  {
    title: "Modesty",
    description: "Elegance through coverage. Our designs celebrate the beauty of modest fashion, creating silhouettes that are both graceful and empowering for the contemporary Muslim woman.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80)" }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 8, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          
          <div className="relative z-10 text-center px-5">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-xs tracking-[0.3em] uppercase font-medium mb-4"
            >
              About Cloudnin3
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white"
            >
              Our Story
            </motion.h1>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 md:py-24 bg-soft-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-3">
                  A Kuala Lumpur-based Brand
                </p>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy mb-6">
                  Modern Modesty,<br />Malaysian Soul
                </h2>
                <div className="space-y-4 text-sm text-mid-gray leading-relaxed">
                  <p>
                    Cloudnin3 was born from a belief that contemporary modest fashion deserves design that is as refined as it is effortless. 
                    We set out to create pieces that honour the modern woman&rsquo;s needs — architectural, timeless, and versatile — 
                    pieces that feel as relevant in a KL boardroom as they do at a weekend brunch.
                  </p>
                  <p>
                    Cloudnin3 is designed for the woman who moves through the world with purpose and poise. 
                    Our collections are built around her life — from the boardroom to the weekend getaway, 
                    from intimate gatherings to grand celebrations.
                  </p>
                  <p>
                    Every piece begins with the best materials — European linen, Japanese cotton, Italian crepe — 
                    and is brought to life through meticulous craftsmanship. We believe in fewer, better things: 
                    pieces that last beyond a season and remain relevant year after year.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-[4/5] bg-cool-ivory overflow-hidden"
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80)" }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-16 md:py-20 bg-warm-ivory">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-3">
                What We Stand For
              </p>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
                Our Pillars
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center p-8 border border-light-gray/50 bg-soft-white"
                >
                  <div className="w-12 h-12 mx-auto mb-5 border border-deep-navy/20 flex items-center justify-center">
                    <span className="text-deep-navy font-playfair font-bold text-lg">
                      {index === 0 ? "H" : index === 1 ? "C" : "M"}
                    </span>
                  </div>
                  <h3 className="text-lg font-playfair font-semibold text-deep-navy mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-mid-gray leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Craft Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=1920&q=80)" }}
            initial={{ scale: 1 }}
            whileInView={{ scale: 1.05 }}
            viewport={{ once: true }}
            transition={{ duration: 6, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/80 via-deep-navy/60 to-transparent" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <p className="text-navy-light text-xs tracking-[0.3em] uppercase font-medium mb-4">
                Malaysian Craftsmanship
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight mb-6">
                Every Piece<br />Tells a Story
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                From hand-woven songket that takes weeks to complete, to hand-stamped batik where no two pieces are alike — our garments carry the mark of the hands that made them.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-soft-white text-deep-navy text-xs tracking-[0.2em] uppercase font-medium hover:bg-white transition-all duration-500"
              >
                Explore the Collection
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-soft-white text-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-3">
                Join Our Journey
              </p>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-deep-navy mb-6">
                Experience Cloudnin3
              </h2>
              <Link
                href="/shop"
                className="inline-flex px-8 py-3 bg-deep-navy text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-black transition-all duration-500"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
