"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Contact</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              Get in Touch
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-sm font-playfair font-bold text-deep-navy uppercase tracking-[0.2em] mb-8">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cool-ivory flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp className="text-deep-navy text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-mid-gray uppercase tracking-wider font-medium">WhatsApp</p>
                    <p className="text-xs text-deep-navy">{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+1234567890"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cool-ivory flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-deep-navy text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-mid-gray uppercase tracking-wider font-medium">Phone</p>
                    <p className="text-xs text-deep-navy">{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+1234567890"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cool-ivory flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-deep-navy text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-mid-gray uppercase tracking-wider font-medium">Email</p>
                    <p className="text-xs text-deep-navy">hello@cloudnin3.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cool-ivory flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-deep-navy text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-mid-gray uppercase tracking-wider font-medium">Location</p>
                    <p className="text-xs text-deep-navy">Local delivery in your area</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] text-deep-navy uppercase tracking-[0.2em] font-medium mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-cool-ivory flex items-center justify-center text-mid-gray hover:bg-deep-navy hover:text-white transition-all" aria-label="Instagram">
                    <FaInstagram className="text-sm" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-cool-ivory flex items-center justify-center text-mid-gray hover:bg-deep-navy hover:text-white transition-all" aria-label="Facebook">
                    <FaFacebook className="text-sm" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-playfair font-bold text-deep-navy uppercase tracking-[0.2em] mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-deep-navy mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/50 focus:outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-deep-navy mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/50 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-deep-navy mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/50 focus:outline-none resize-none"
                    placeholder="Write your message..."
                    required
                  />
                </div>
                <Button type="submit" variant="primary" fullWidth isLoading={submitting}>
                  Send Message
                </Button>
                <p className="text-[10px] text-mid-gray">
                  Prefer to reach us directly?{" "}
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890"}`} target="_blank" rel="noopener noreferrer" className="text-deep-navy hover:underline font-medium">WhatsApp</a>{" "}
                  or email us at hello@cloudnin3.com.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
