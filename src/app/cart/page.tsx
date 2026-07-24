"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Cart</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              Shopping Cart
            </h1>
            {totalItems > 0 && (
              <p className="text-mid-gray text-xs mt-2">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-playfair font-semibold text-xl text-deep-navy mb-3">
                Your Cart is Empty
              </h2>
              <p className="text-mid-gray text-xs mb-8">
                Looks like you haven&apos;t added anything yet.
              </p>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="p-5">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.productId}-${item.variantId}`}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
                <Link
                  href="/shop"
                  className="inline-block text-[10px] text-mid-gray hover:text-deep-navy transition-colors mt-2 uppercase tracking-wider"
                >
                  &larr; Continue Shopping
                </Link>
              </div>
              <div>
                <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
