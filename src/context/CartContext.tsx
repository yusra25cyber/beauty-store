"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, CartContextType } from "@/types";

function cartKey(item: { productId: string; variantId: string }): string {
  return `${item.productId}::${item.variantId}`;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((item: Partial<CartItem>) => ({
            productId: item.productId || "",
            variantId: item.variantId || "",
            variantName: item.variantName || "Default",
            variantSku: item.variantSku || "",
            name: item.name || "",
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || "",
            stockQuantity: item.stockQuantity || 0,
          }));
          setItems(migrated);
        }
      }
    } catch {
      localStorage.removeItem("cart");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => cartKey(item) === cartKey(newItem)
      );
      if (existingIndex >= 0) {
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.stockQuantity) }
            : item
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setItems((prev) => prev.filter((item) => cartKey(item) !== `${productId}::${variantId}`));
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    const key = `${productId}::${variantId}`;
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => cartKey(item) !== key));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        cartKey(item) === key
          ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  if (!mounted) {
    return (
      <CartContext.Provider
        value={{
          items: [],
          totalItems: 0,
          totalPrice: 0,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
