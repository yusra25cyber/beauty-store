"use client";
import React from "react";
import { motion } from "framer-motion";

const gallery = [
  "https://images.pexels.com/photos/31450892/pexels-photo-31450892.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/36215325/pexels-photo-36215325.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/32041692/pexels-photo-32041692.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/36742656/pexels-photo-36742656.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/33540663/pexels-photo-33540663.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/30332318/pexels-photo-30332318.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/7163357/pexels-photo-7163357.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  "https://images.pexels.com/photos/33453053/pexels-photo-33453053.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
];

export default function InstagramGallery() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-2">
            Style Inspiration
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
            As Seen On You
          </h2>
          <p className="text-sm text-mid-gray mt-2">
            Tag <span className="font-medium text-deep-navy">@cloudnin3</span> to be featured.
          </p>
        </motion.div>

        <div className="grid grid-cols-4 gap-1 md:gap-2">
          {gallery.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="aspect-square overflow-hidden relative group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${url})` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="https://instagram.com/cloudnin3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium hover:text-deep-navy transition-colors border-b border-mid-gray/30 pb-0.5"
          >
            Follow @cloudnin3
            <span>&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
