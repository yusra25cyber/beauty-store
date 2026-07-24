"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import type { ICategory } from "@/types";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", image: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (category: ICategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || "",
      description: category.description || "",
    });
    setShowModal(true);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory
        ? prev.slug
        : name
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save category");
        return;
      }

      toast.success(editingCategory ? "Category updated" : "Category created");
      setShowModal(false);
      fetchCategories();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: ICategory) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
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
            Categories
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <HiOutlinePlus className="text-lg mr-1" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-text-secondary mb-4">No categories yet</p>
          <Button variant="primary" onClick={openCreateModal}>
            Create First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-primary font-playfair font-bold">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair font-semibold text-text-primary">
                    {category.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    /{category.slug}
                  </p>
                  {category.description && (
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <Link
                  href={`/shop/${category.slug}`}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </Link>
                <button
                  onClick={() => openEditModal(category)}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <HiOutlinePencil />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-red-500 transition-colors"
                >
                  <HiOutlineTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter category name"
          />
          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
            placeholder="category-slug"
          />
          <Input
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Category description..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingCategory ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
