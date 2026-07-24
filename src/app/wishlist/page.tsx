"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Loader";
import type { IProduct } from "@/types";

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/wishlist")
        .then((res) => res.json())
        .then((data) => {
          const items = data.wishlist?.items || [];
          setProducts(items.map((i: Record<string, unknown>) => i.productId as IProduct).filter(Boolean));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Saved Items</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              My Wishlist
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          {loading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-mid-gray text-xs mb-4">Your wishlist is empty</p>
              <Link href="/shop">
                <Button variant="primary">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
