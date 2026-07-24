import React from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-warm-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-playfair font-bold text-white tracking-tight">
              Cloudnin3
            </Link>
            <p className="text-white/40 text-xs leading-relaxed mt-3 max-w-[200px]">
              Premium contemporary modest fashion — effortless elegance for the modern woman.
            </p>
            <div className="mt-6">
              <a
                href="https://wa.me/01116802146"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] uppercase tracking-[0.15em] transition-colors"
              >
                <FaWhatsapp className="text-xs" />
                Order via WhatsApp
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium mb-5">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-white/70 hover:text-white text-xs transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=new-arrivals" className="text-white/70 hover:text-white text-xs transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/linen-edit" className="text-white/70 hover:text-white text-xs transition-colors">The Linen Edit</Link></li>
              <li><Link href="/collections/everyday-kurung" className="text-white/70 hover:text-white text-xs transition-colors">Everyday Kurung</Link></li>
              <li><Link href="/collections/tailored-essentials" className="text-white/70 hover:text-white text-xs transition-colors">Tailored Essentials</Link></li>
              <li><Link href="/collections/black-collection" className="text-white/70 hover:text-white text-xs transition-colors">The Black Collection</Link></li>
              <li><Link href="/collections/monochrome-series" className="text-white/70 hover:text-white text-xs transition-colors">Monochrome Series</Link></li>
              <li><Link href="/collections/kebaya-collection" className="text-white/70 hover:text-white text-xs transition-colors">The Kebaya Collection</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium mb-5">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-white/70 hover:text-white text-xs transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white text-xs transition-colors">Contact</Link></li>
              <li><Link href="/cart" className="text-white/70 hover:text-white text-xs transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium mb-5">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-white/70 hover:text-white text-xs transition-colors">Size Guide</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white text-xs transition-colors">Shipping &amp; Returns</Link></li>
              <li className="text-white/40 text-xs">hello@cloudnin3.com</li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="max-w-md">
            <h4 className="text-xs text-white/60 font-medium mb-2">Join our mailing list</h4>
            <p className="text-[10px] text-white/30 mb-4">Be the first to know about new collections, Raya launches, and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button className="px-4 py-2 bg-soft-white text-deep-navy text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-white transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-[10px]">
            &copy; {new Date().getFullYear()} Cloudnin3. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/15 text-[10px]">Premium Contemporary Modest Fashion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
