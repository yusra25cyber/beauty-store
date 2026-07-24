"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/utils";

interface WhatsAppButtonProps {
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({ message, className, children }: WhatsAppButtonProps) {
  const handleClick = () => {
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-deep-navy text-white text-sm tracking-wide hover:bg-black transition-all duration-300 ${className || ""}`}
    >
      <FaWhatsapp className="text-sm" />
      {children || "Order via WhatsApp"}
    </button>
  );
}

export function FloatingWhatsAppButton() {
  const message = "Hi! I'd like to know more about your products.";
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 w-10 h-10 bg-deep-navy flex items-center justify-center hover:bg-black transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-white text-base" />
    </a>
  );
}
