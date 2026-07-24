"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? (product.category as { name: string }).name
      : "";

  const images = product.images || [];
  const hasHoverImage = images.length > 1;
  const hoverImage = hasHoverImage ? images[1] : images[0];

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-cool-ivory">
        {images.length > 0 ? (
          <>
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
            />
            {hasHoverImage && (
              <img
                src={hoverImage}
                alt={`${product.name} - alternate view`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
            )}
            <div className="absolute inset-0 bg-deep-navy/0 group-hover:bg-deep-navy/10 transition-colors duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mid-gray">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 14H4a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1zM2 19h20" />
            </svg>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-0 left-0 right-0 p-3">
            <span className="text-[9px] text-white/70 font-medium uppercase tracking-[0.15em]">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="pt-2.5 space-y-0.5">
        {categoryName && (
          <div
            className="text-[9px] text-mid-gray uppercase tracking-[0.2em] font-medium"
          >
            {categoryName}
          </div>
        )}
        <h3 className="text-sm font-medium text-deep-navy leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-mid-gray">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
