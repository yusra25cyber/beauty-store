"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Loader";
import { formatPrice } from "@/lib/utils";
import type { IProduct } from "@/types";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current }),
      });
      if (res.ok) {
        toast.success(current ? "Removed from featured" : "Added to featured");
        fetchProducts();
      }
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleToggleStock = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !current }),
      });
      if (res.ok) {
        toast.success(current ? "Marked as out of stock" : "Marked as in stock");
        fetchProducts();
      }
    } catch {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-text-primary">
            Products
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary">
            <HiOutlinePlus className="text-lg mr-1" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Search products"
                />
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button variant="primary">Add Your First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Variants</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Featured</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const categoryName =
                    typeof product.category === "object" && product.category !== null
                      ? (product.category as { name: string }).name
                      : "";
                  return (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0] && (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="font-medium text-text-primary truncate max-w-[200px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">{categoryName}</td>
                      <td className="py-3 px-4 font-medium">{formatPrice(product.price)}</td>
                      <td className="py-3 px-4">
                        <span className={product.stockQuantity < 5 ? "text-red-500" : "text-text-secondary"}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        {product.variants?.length || 1}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(product._id, product.featured)}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.featured
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-text-secondary"
                          }`}
                        >
                          {product.featured ? "Yes" : "No"}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(product._id, product.inStock)}
                        >
                          {product.inStock ? (
                            <Badge variant="success">In Stock</Badge>
                          ) : (
                            <Badge variant="danger">Out of Stock</Badge>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="p-1.5 text-text-secondary hover:text-primary transition-colors"
                          >
                            <HiOutlinePencil className="text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-1.5 text-text-secondary hover:text-red-500 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
