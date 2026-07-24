"use client";
import React from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Aisha M.",
    location: "Kuala Lumpur",
    product: "Linen Relaxed Kurung Set",
    rating: 5,
    text: "The linen is incredible — so soft right out of the box. I wore it to a family gathering and received so many compliments. It's the perfect balance of modest and modern.",
  },
  {
    name: "Sarah L.",
    location: "Singapore",
    product: "Black Structured Blazer",
    rating: 5,
    text: "Finally, a blazer that fits beautifully without tailoring. The shoulders are structured but not boxy, and the fabric has a lovely weight. My go-to for client meetings.",
  },
  {
    name: "Nadia R.",
    location: "Johor Bahru",
    product: "Kurung Moden Crepe Set",
    rating: 5,
    text: "This is my third kurung set from Cloudnin3. The crepe fabric is wrinkle-resistant — I packed it in a suitcase and it came out looking fresh. Perfect for travel.",
  },
  {
    name: "Farah D.",
    location: "Penang",
    product: "Neutral Silk Blouse",
    rating: 4,
    text: "The silk is absolutely beautiful. So soft and drapes perfectly. I paired it with the wide-leg trousers and felt so elegant. Will definitely be ordering more colours.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-16 md:py-24 bg-soft-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-2">
            Real Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
            Loved by Our Community
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 border border-light-gray/30"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400" : "text-light-gray"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-deep-navy leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-deep-navy">{review.name}</p>
                  <p className="text-[10px] text-mid-gray">{review.location}</p>
                </div>
                <span className="text-[9px] text-mid-gray uppercase tracking-[0.1em]">on {review.product}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
