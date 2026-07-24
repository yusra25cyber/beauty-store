"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 200;

export default function CartDrawer() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { open, closeDrawer } = useCartDrawer();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/30"
          onClick={closeDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-[90] h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-light-gray/50">
            <div>
              <h2 className="text-sm font-playfair font-semibold text-deep-navy">
                Cart
              </h2>
              <p className="text-[10px] text-mid-gray">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-mid-gray hover:text-deep-navy transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {totalPrice > 0 && (
            <div className="px-5 py-3 border-b border-light-gray/50">
              <div className="flex justify-between text-[10px] text-mid-gray mb-1.5">
                <span>
                  {progress >= 100
                    ? "Free shipping unlocked"
                    : `You're ${formatPrice(remaining)} away from free shipping`}
                </span>
                <span>{formatPrice(totalPrice)} / {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
              </div>
              <div className="w-full h-1 bg-cool-ivory rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${progress >= 100 ? "bg-black" : "bg-deep-navy"}`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              {progress >= 100 && (
                <p className="text-[9px] text-black/60 mt-1">Your order qualifies for complimentary shipping.</p>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-5">
                <svg className="w-12 h-12 text-mid-gray/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 14H4a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1zM2 19h20" />
                </svg>
                <p className="text-sm text-mid-gray mb-1">Your cart is empty</p>
                <p className="text-[10px] text-mid-gray/60 mb-6">Looks like you haven&apos;t added anything yet.</p>
                <button
                  onClick={closeDrawer}
                  className="px-5 py-2 bg-deep-navy text-white text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-cool-ivory flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mid-gray">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 14H4a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1zM2 19h20" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-deep-navy truncate">{item.name}</h3>
                      {item.variantName && (
                        <p className="text-[10px] text-mid-gray mt-0.5">{item.variantName}</p>
                      )}
                      <p className="text-xs text-mid-gray mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-light-gray">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="px-2 py-0.5 text-mid-gray hover:text-deep-navy transition-colors text-[10px]"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-deep-navy text-[10px] font-medium min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="px-2 py-0.5 text-mid-gray hover:text-deep-navy transition-colors text-[10px]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-[10px] text-mid-gray hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-light-gray/50 px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm font-medium text-deep-navy">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-[10px] text-mid-gray">Shipping calculated at checkout</p>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full px-5 py-2.5 bg-deep-navy text-white text-[10px] tracking-[0.15em] uppercase font-medium text-center hover:bg-black transition-colors"
              >
                View Cart & Checkout
              </Link>
              <button
                onClick={closeDrawer}
                className="block w-full text-[10px] text-mid-gray hover:text-deep-navy text-center transition-colors uppercase tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
