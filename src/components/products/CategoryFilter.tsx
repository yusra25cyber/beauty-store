"use client";

import React from "react";
import Link from "next/link";

import { classNames } from "@/lib/utils";
import type { ICategory } from "@/types";

interface CategoryFilterProps {
  categories: ICategory[];
  selectedCategory?: string;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  if (!categories.length) return null;

  return (
    <div>
      <h3 className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-4">
        Categories
      </h3>
      <div className="space-y-1">
        <Link
          href="/shop"
          className={classNames(
            "block text-xs font-medium transition-colors py-1.5",
            !selectedCategory
              ? "text-deep-navy"
              : "text-mid-gray hover:text-deep-navy"
          )}
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/shop/${category.slug}`}
            className={classNames(
              "block text-xs font-medium transition-colors py-1.5",
              selectedCategory === category.slug || selectedCategory === category._id
                ? "text-deep-navy"
                : "text-mid-gray hover:text-deep-navy"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MobileCategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: ICategory[];
  selectedCategory?: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <select
      value={selectedCategory || ""}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy uppercase tracking-wider"
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category._id} value={category.slug}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
