import React from "react";
import ProductCard from "./ProductCard";
import type { IProduct } from "@/types";

interface ProductGridProps {
  products: IProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-playfair font-semibold text-deep-navy mb-2">
          No products found
        </h3>
        <p className="text-mid-gray text-sm">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
