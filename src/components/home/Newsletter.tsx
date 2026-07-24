"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-warm-ivory relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-px bg-light-gray" />
      <div className="absolute top-0 left-0 w-px h-32 bg-light-gray" />
      <div className="absolute bottom-0 right-0 w-32 h-px bg-light-gray" />
      <div className="absolute bottom-0 right-0 w-px h-32 bg-light-gray" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] text-navy-light uppercase tracking-[0.25em] font-medium mb-3">
            Stay Connected
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-deep-navy leading-tight mb-4">
            Join the Inner Circle
          </h2>
          <p className="text-mid-gray text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Be the first to know about new collections, early access to drops, and exclusive styling inspiration.
          </p>

          {status === "success" ? (
            <p className="text-sm text-deep-navy font-medium">
              Thank you. You&rsquo;re on the list.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 border border-light-gray bg-white text-deep-navy text-xs placeholder:text-mid-gray/50 focus:outline-none focus:border-deep-navy transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-2.5 bg-deep-navy text-white text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-black transition-all duration-500 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-[10px] text-red-400 mt-2">Something went wrong. Please try again.</p>
          )}

          <div className="mt-8 pt-8 border-t border-light-gray/30">
            <Link
              href="/shop"
              className="text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium hover:text-deep-navy transition-colors"
            >
              Browse the Full Collection &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
