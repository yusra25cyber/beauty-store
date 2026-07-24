"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import SizeGuide from "@/components/products/SizeGuide";
import ReviewSection from "@/components/products/ReviewSection";
import { PageLoader } from "@/components/ui/Loader";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { formatPrice, buildSingleProductMessage, buildWhatsAppUrl } from "@/lib/utils";
import type { IProduct, IProductVariant } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { openDrawer } = useCartDrawer();
  const productId = params.id as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related || []);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const variantId = urlParams.get("variant");
      const matched = variantId
        ? product.variants.find((v) => v._id === variantId)
        : null;
      const initial = matched || product.variants[0];
      setSelectedVariant(initial);
    }
  }, [product]);

  const handleVariantChange = useCallback((v: IProductVariant) => {
    setSelectedVariant(v);
    setQuantity(1);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", v._id);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const unselectedVariants = useCallback(() => {
    if (!product || !selectedVariant || product.variants.length < 2) return [];
    const parts = selectedVariant.name.split(" / ");
    if (parts.length < 2) return [];
    return product.variants.filter((v) => {
      const vParts = v.name.split(" / ");
      return vParts.length === parts.length && v._id !== selectedVariant._id;
    });
  }, [product, selectedVariant]);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-playfair font-bold text-xl text-deep-navy mb-4">
              Product Not Found
            </h2>
            <Link href="/shop" className="text-xs text-mid-gray hover:text-deep-navy uppercase tracking-wider">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? (product.category as { name: string }).name
      : "";

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stockQuantity;
  const currentInStock = currentStock > 0;
  const currentImages = selectedVariant && selectedVariant.images.length > 0
    ? selectedVariant.images.map((img) => img.url)
    : product.images;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart({
      productId: product._id,
      variantId: selectedVariant._id,
      variantName: selectedVariant.name,
      variantSku: selectedVariant.sku,
      name: product.name,
      price: currentPrice,
      quantity,
      image: currentImages[0] || "",
      stockQuantity: currentStock,
    });
    toast.success(`${product.name} added to cart`);
    openDrawer();
  };

  const whatsappMessage = buildSingleProductMessage(
    product.name,
    quantity,
    currentPrice
  );

  const outOfStockVariants = unselectedVariants().filter((v) => v.stock <= 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-[10px] text-mid-gray hover:text-deep-navy uppercase tracking-[0.2em] font-medium transition-colors mb-8"
          >
            <span className="text-xs">&larr;</span>
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <ProductGallery images={currentImages} productName={product.name} />
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-24">
                {categoryName && (
                  <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">
                    {categoryName}
                  </p>
                )}

                <h1 className="text-2xl md:text-3xl font-playfair font-bold text-deep-navy leading-tight mb-3">
                  {product.name}
                </h1>

                <p className="text-base text-mid-gray mb-1">
                  {formatPrice(currentPrice)}
                </p>

                {product.price > currentPrice && (
                  <p className="text-[10px] text-mid-gray/60 line-through mb-1">
                    {formatPrice(product.price)}
                  </p>
                )}

                <p className="text-xs text-mid-gray/60 leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.variants && product.variants.length > 1 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium">
                        Variant
                      </p>
                      {selectedVariant?.name.includes("/") && (
                        <button
                          onClick={() => setSizeGuideOpen(true)}
                          className="text-[10px] text-deep-navy hover:underline uppercase tracking-wider font-medium"
                        >
                          Size Guide
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?._id === v._id;
                        const isOutOfStock = v.stock <= 0;
                        return (
                          <button
                            key={v._id}
                            type="button"
                            onClick={() => handleVariantChange(v)}
                            disabled={isOutOfStock}
                            className={`px-4 py-1.5 text-xs border transition-all ${
                              isSelected
                                ? "border-deep-navy bg-deep-navy text-white"
                                : isOutOfStock
                                ? "border-light-gray/30 text-mid-gray/30 line-through cursor-not-allowed"
                                : "border-light-gray text-mid-gray hover:border-deep-navy"
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                    {outOfStockVariants.length > 0 && (
                      <p className="text-[9px] text-mid-gray/50 mt-2">
                        Crossed out = currently unavailable
                      </p>
                    )}
                    </div>
                  )}

                {/* Product Details Accordion */}
                <div className="mb-6 space-y-0 border-t border-light-gray/50">
                  {[
                    {
                      title: "Fabric & Composition",
                      content: "Premium quality fabrics sourced from Malaysia's finest textile artisans. Each piece is crafted from breathable natural fibers chosen for comfort in tropical climates."
                    },
                    {
                      title: "The Fit",
                      content: "Designed for a relaxed, elegant silhouette. Baju Kurung features a loose-fitting top and flowing skirt for ease of movement. Refer to our size guide for detailed measurements."
                    },
                    {
                      title: "Care Guide",
                      content: "Hand wash separately in cold water. Do not bleach. Hang to dry in shade. Iron on medium heat. Dry clean recommended for songket and silk pieces."
                    },
                    {
                      title: "Delivery & Returns",
                      content: "Free shipping on orders over RM200. Standard delivery 3-5 business days. Express delivery available. Easy returns within 14 days of receipt."
                    }
                  ].map((item, i) => {
                    const isOpen = openAccordion === i;
                    return (
                      <div key={i} className="border-b border-light-gray/50">
                        <button
                          onClick={() => setOpenAccordion(isOpen ? null : i)}
                          className="w-full flex items-center justify-between py-3 text-left"
                        >
                          <span className="text-[10px] text-deep-navy uppercase tracking-[0.2em] font-medium">{item.title}</span>
                          <svg
                            className={`w-3 h-3 text-mid-gray transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-4" : "max-h-0"}`}
                        >
                          <p className="text-xs text-mid-gray leading-relaxed">{item.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentInStock && (
                  <div className="flex items-center gap-4 mb-6">
                    <p className="text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium">
                      Qty
                    </p>
                    <div className="flex items-center border border-light-gray">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-mid-gray hover:text-deep-navy transition-colors text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-deep-navy text-xs font-medium min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                        className="px-3 py-1.5 text-mid-gray hover:text-deep-navy transition-colors text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  {currentInStock && (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-5 py-2.5 bg-deep-navy text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-black transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  )}
                  <button
                    onClick={() => window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer")}
                    className="flex-1 px-5 py-2.5 border border-deep-navy/20 text-deep-navy text-xs tracking-[0.15em] uppercase font-medium hover:bg-deep-navy hover:text-white transition-all duration-300"
                  >
                    {currentInStock ? "WhatsApp" : "Inquire"}
                  </button>
                </div>

                <p className="text-[9px] text-mid-gray/50 text-center mb-4">
                  Ships in 3-5 business days. Free shipping on orders over {formatPrice(200)}.
                </p>

                {!currentInStock && (
                  <p className="text-[10px] text-mid-gray uppercase tracking-[0.2em]">
                    Currently out of stock
                  </p>
                )}

              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-light-gray/50">
              <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-1">Related</p>
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-deep-navy mb-8">
                You May Also Like
              </h2>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {related.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <ProductCard product={item} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          <ReviewSection productId={product._id} />
        </div>
      </main>
      <Footer />
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}
