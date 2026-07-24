"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineTrash } from "react-icons/hi";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemove: (productId: string, variantId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-light-gray/50 last:border-b-0">
      <Link
        href={`/product/${item.productId}`}
        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-cool-ivory"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mid-gray">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.productId}`}
          className="text-sm font-medium text-deep-navy hover:text-mid-gray transition-colors"
        >
          {item.name}
        </Link>
        <p className="text-mid-gray text-[10px] mt-0.5 uppercase tracking-wider">
          {formatPrice(item.price)} each
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-light-gray">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="px-2.5 py-1 text-mid-gray hover:text-deep-navy transition-colors text-[10px]"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="px-2.5 py-1 text-xs font-medium text-deep-navy min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="px-2.5 py-1 text-mid-gray hover:text-deep-navy transition-colors text-[10px]"
              disabled={item.quantity >= item.stockQuantity}
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.productId, item.variantId)}
            className="p-1 text-mid-gray hover:text-red-500 transition-colors"
            aria-label={`Remove ${item.name} from cart`}
          >
            <HiOutlineTrash className="text-sm" />
          </button>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-deep-navy">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
