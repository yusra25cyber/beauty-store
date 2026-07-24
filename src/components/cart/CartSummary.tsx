"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
}

export default function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
  return (
    <div className="border border-light-gray/50 p-6 sticky top-24">
      <h3 className="text-sm font-playfair font-semibold text-deep-navy mb-4">
        Order Summary
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-mid-gray">
          <span>Subtotal ({totalItems} items)</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-xs text-mid-gray">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="border-t border-light-gray/50 pt-3 flex justify-between font-medium text-deep-navy text-sm">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
      <Link href="/checkout">
        <Button variant="primary" fullWidth className="mt-6">
          Proceed to Checkout
        </Button>
      </Link>
      <Link
        href="/shop"
        className="block text-center text-[10px] text-mid-gray hover:text-deep-navy transition-colors mt-3 uppercase tracking-wider"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
