"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import { Input, TextArea, Select } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Loader";
import type { ICategory } from "@/types";
import { HiOutlinePhotograph, HiOutlineX, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

interface VariantForm {
  _id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  images: Array<{
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
  }>;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    featured: false,
    tags: "",
    brand: "",
    ingredients: "",
    howToUse: "",
    bestseller: false,
    newArrival: false,
  });

  const [variants, setVariants] = useState<VariantForm[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch("/api/categories"),
        ]);

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        const prod = productData.product;

        setFormData({
          name: prod.name || "",
          description: prod.description || "",
          category: typeof prod.category === "object" && prod.category ? prod.category._id : prod.category || "",
          featured: prod.featured || false,
          tags: (prod.tags || []).join(", "),
          brand: prod.brand || "",
          ingredients: prod.ingredients || "",
          howToUse: prod.howToUse || "",
          bestseller: prod.bestseller || false,
          newArrival: prod.newArrival || false,
        });

        const prodVariants = (prod.variants || []).map((v: { _id: string; name: string; sku: string; price: number; stock: number; images: Array<{ url: string; publicId: string; format: string; width: number; height: number }> }) => ({
          _id: v._id,
          name: v.name,
          sku: v.sku,
          price: v.price?.toString() || "",
          stock: v.stock?.toString() || "0",
          images: v.images || [],
        }));

        if (prodVariants.length === 0) {
          prodVariants.push({
            name: "Default",
            sku: `PROD-${prod._id.toString().slice(-8).toUpperCase()}`,
            price: prod.price?.toString() || "",
            stock: prod.stockQuantity?.toString() || "0",
            images: [],
          });
        }

        setVariants(prodVariants);
        setCategories(categoriesData.categories || []);
      } catch {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: "", sku: `PROD-${Date.now().toString(36).toUpperCase()}`, price: "", stock: "0", images: [] }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string | Array<unknown>) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      setVariants((prev) =>
        prev.map((v, i) =>
          i === index
            ? {
                ...v,
                images: [
                  ...v.images,
                  {
                    url: data.url,
                    publicId: data.publicId || "",
                    format: data.format || "",
                    width: data.width || 0,
                    height: data.height || 0,
                  },
                ],
              }
            : v
        )
      );
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeVariantImage = (vIndex: number, imgIndex: number) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIndex
          ? { ...v, images: v.images.filter((_, j) => j !== imgIndex) }
          : v
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].name || !variants[i].sku || !variants[i].price) {
        toast.error(`Variant ${i + 1}: name, SKU, and price are required`);
        return;
      }
    }

    setSubmitting(true);

    const variantPayload = variants.map((v) => ({
      name: v.name,
      sku: v.sku,
      price: parseFloat(v.price),
      stock: parseInt(v.stock) || 0,
      images: v.images,
    }));

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          featured: formData.featured,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          variants: variantPayload,
          brand: formData.brand,
          ingredients: formData.ingredients,
          howToUse: formData.howToUse,
          bestseller: formData.bestseller,
          newArrival: formData.newArrival,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update product");
        return;
      }

      toast.success("Product updated!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
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
      <div className="mb-6">
        <h1 className="text-2xl font-playfair font-bold text-text-primary">
          Edit Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
            <h2 className="font-playfair font-semibold text-lg text-text-primary">Basic Information</h2>

            <Input
              label="Product Name"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Enter product name"
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <TextArea
                required
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your product..."
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                placeholder="e.g., L'Oreal, Maybelline"
              />
              <Select
                label="Category"
                required
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                options={[
                  { value: "", label: "Select a category..." },
                  ...categories.map((c) => ({ value: c._id, label: c.name })),
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                placeholder="e.g., vegan, organic, natural (comma separated)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <span className="text-sm font-medium text-text-primary">Featured</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.bestseller}
                  onChange={(e) => setFormData((p) => ({ ...p, bestseller: e.target.checked }))}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <span className="text-sm font-medium text-text-primary">Bestseller</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.newArrival}
                  onChange={(e) => setFormData((p) => ({ ...p, newArrival: e.target.checked }))}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <span className="text-sm font-medium text-text-primary">New Arrival</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-playfair font-semibold text-lg text-text-primary">Variants</h2>
            <p className="text-sm text-text-secondary">
              Manage variants for different sizes, shades, or options.
            </p>

            {variants.map((variant, vIndex) => (
              <div key={vIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">Variant {vIndex + 1}</h3>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(vIndex)}
                      className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                    >
                      <HiOutlineTrash /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Variant Name"
                    required
                    value={variant.name}
                    onChange={(e) => updateVariant(vIndex, "name", e.target.value)}
                    placeholder="e.g., 30ml, Rose Gold"
                  />
                  <Input
                    label="SKU"
                    required
                    value={variant.sku}
                    onChange={(e) => updateVariant(vIndex, "sku", e.target.value)}
                    placeholder="PROD-XXXX"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Price ($)"
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.price}
                    onChange={(e) => updateVariant(vIndex, "price", e.target.value)}
                    placeholder="0.00"
                  />
                  <Input
                    label="Stock"
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(vIndex, "stock", e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Variant Images
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {variant.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img.url} alt={`Variant ${vIndex + 1} image ${imgIndex + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeVariantImage(vIndex, imgIndex)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <HiOutlineX className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <HiOutlinePhotograph className="text-lg text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      {uploadingIndex === vIndex ? "Uploading..." : "Upload Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(vIndex, e)}
                      className="hidden"
                      disabled={uploadingIndex === vIndex}
                    />
                  </label>
                </div>
              </div>
            ))}

            <Button type="button" variant="ghost" onClick={addVariant}>
              <HiOutlinePlus className="text-lg mr-1" /> Add Variant
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-playfair font-semibold text-lg text-text-primary">Details</h2>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Ingredients</label>
              <TextArea
                value={formData.ingredients}
                onChange={(e) => setFormData((p) => ({ ...p, ingredients: e.target.value }))}
                placeholder="List ingredients..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">How to Use</label>
              <TextArea
                value={formData.howToUse}
                onChange={(e) => setFormData((p) => ({ ...p, howToUse: e.target.value }))}
                placeholder="Usage instructions..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" isLoading={submitting}>
              Update Product
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
