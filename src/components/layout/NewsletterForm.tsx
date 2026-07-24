"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-soft-white text-deep-navy text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-white transition-all whitespace-nowrap disabled:opacity-50"
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
