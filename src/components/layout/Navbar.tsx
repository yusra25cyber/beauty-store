"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { HiOutlineShoppingBag, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineSearch } from "react-icons/hi";
import { collectionNavGroups } from "@/data/collections";

export default function Navbar() {
  const { totalItems } = useCart();
  const { openDrawer } = useCartDrawer();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target as Node) &&
        megaTriggerRef.current &&
        !megaTriggerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHome = pathname === "/";
  const navBg = scrolled || !isHome
    ? "bg-white border-b border-light-gray/50"
    : "bg-transparent";

  const navLinks = [
    { href: "/shop?category=new-arrivals", label: "New Arrivals" },
    { href: "/shop", label: "Shop All" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="shrink-0">
            <span className={`text-lg md:text-xl font-playfair font-bold tracking-tight transition-colors ${
              scrolled || !isHome ? "text-deep-navy" : "text-white"
            }`}>
              Cloudnin3
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-[0.15em] uppercase font-medium transition-colors ${
                  isActive(link.href)
                    ? scrolled || !isHome ? "text-deep-navy" : "text-white"
                    : scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              ref={megaTriggerRef}
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(!megaOpen)}
              className={`text-xs tracking-[0.15em] uppercase font-medium transition-colors ${
                megaOpen
                  ? scrolled || !isHome ? "text-deep-navy" : "text-white"
                  : scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
              }`}
            >
              Collections
            </button>
          </div>

          {megaOpen && (
            <div
              ref={megaRef}
              onMouseLeave={() => setMegaOpen(false)}
              className="fixed left-0 right-0 top-14 bg-white border-b border-light-gray shadow-xl z-40 animate-fadeIn"
            >
              <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
                <div className="grid grid-cols-4 gap-8">
                  {collectionNavGroups.map((group) => (
                    <div key={group.title}>
                      <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-4">
                        {group.title}
                      </p>
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/collections/${item.slug}`}
                            onClick={() => setMegaOpen(false)}
                            className="group flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-light-gray flex-shrink-0">
                              <img
                                src={item.heroImage}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <span className="text-sm text-deep-navy group-hover:text-mid-gray transition-colors">
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-light-gray/50 text-center">
                  <Link
                    href="/shop"
                    onClick={() => setMegaOpen(false)}
                    className="text-xs tracking-[0.15em] uppercase text-mid-gray hover:text-deep-navy transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-0 md:gap-1">
            <Link
              href="/shop"
              className={`p-2 transition-colors ${
                scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
              }`}
              aria-label="Search"
            >
              <HiOutlineSearch className="text-lg" />
            </Link>

            {session ? (
              <Link
                href="/account"
                className={`p-2 transition-colors ${
                  scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
                }`}
                aria-label="Account"
              >
                <HiOutlineUser className="text-lg" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className={`p-2 transition-colors ${
                  scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
                }`}
                aria-label="Sign In"
              >
                <HiOutlineUser className="text-lg" />
              </Link>
            )}

            <button
              onClick={openDrawer}
              className={`relative p-2 transition-colors ${
                scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
              }`}
              aria-label="Cart"
            >
              <HiOutlineShoppingBag className="text-lg" />
              {totalItems > 0 && (
                <span key={totalItems} className={`absolute -top-0.5 -right-0.5 text-[9px] font-medium px-1 leading-none animate-cartPulse ${
                  scrolled || !isHome ? "bg-deep-navy text-white" : "bg-white text-deep-navy"
                }`}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <button
              className={`md:hidden p-2 transition-colors ${
                scrolled || !isHome ? "text-mid-gray hover:text-deep-navy" : "text-white/70 hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close" : "Menu"}
            >
              {mobileMenuOpen ? <HiOutlineX className="text-lg" /> : <HiOutlineMenu className="text-lg" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-white md:hidden animate-fadeIn overflow-y-auto">
          <div className="flex flex-col items-center px-8 py-12 space-y-8">
            {[...navLinks, { href: "/", label: "Home" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xl font-playfair text-deep-navy hover:text-mid-gray transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-8 h-px bg-light-gray" />
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium">Collections</p>
            {collectionNavGroups.flatMap((g) => g.items).map((item) => (
              <Link
                key={item.slug}
                href={`/collections/${item.slug}`}
                className="text-sm text-mid-gray hover:text-deep-navy transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="w-8 h-px bg-light-gray" />
            <Link
              href={session ? "/account" : "/auth/login"}
              className="text-sm font-medium text-mid-gray hover:text-deep-navy transition-colors tracking-wide uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              {session ? "My Account" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
