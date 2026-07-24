import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";
import { requireAdmin } from "@/lib/requireAdmin";
import { logApiError, internalError } from "@/lib/error-utils";

const imageMetaSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  format: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  alt: z.string().max(500).optional(),
});

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required").max(200),
  sku: z.string().min(1, "SKU is required").max(200),
  price: z.number().positive("Price must be positive").max(999999),
  stock: z.number().int().min(0).default(0),
  images: z.array(imageMetaSchema).max(20).optional().default([]),
});

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  price: z.number().positive("Price must be positive").max(999999),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string().url()).max(20).optional().default([]),
  inStock: z.boolean().optional().default(true),
  stockQuantity: z.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string().max(100)).max(50).optional().default([]),
  variants: z.array(variantSchema).max(100).optional().default([]),
  brand: z.string().max(200).optional().default(""),
  ingredients: z.string().max(5000).optional().default(""),
  howToUse: z.string().max(5000).optional().default(""),
  bestseller: z.boolean().optional().default(false),
  newArrival: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const newArrival = searchParams.get("newArrival");
    const brand = searchParams.get("brand");
    const tag = searchParams.get("tag");

    const query: Record<string, unknown> = {};

    if (tag) {
      query.tags = tag;
    }

    if (category) {
      query.category = category;
    }

    if (search && search.trim()) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { tags: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (bestseller === "true") {
      query.bestseller = true;
    }

    if (newArrival === "true") {
      query.newArrival = true;
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .lean();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/products GET", error, {
      url: request.url,
    });
    return internalError(errorId);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    await connectDB();

    const data = result.data;
    let variants = data.variants;

    if (variants.length === 0) {
      const defaultSku = `PROD-${Date.now().toString(36).toUpperCase()}`;
      variants = [
        {
          name: "Default",
          sku: defaultSku,
          price: data.price,
          stock: data.stockQuantity,
          images: data.images.map((url: string) => ({
            url,
            publicId: "",
            format: "",
            width: 0,
            height: 0,
          })),
        },
      ];
    }

    const firstVariant = variants[0];
    const rootImages = variants.reduce(
      (acc: string[], v) => [...acc, ...v.images.map((img) => img.url)],
      [] as string[]
    );

    const product = await Product.create({
      ...data,
      price: firstVariant.price,
      stockQuantity: variants.reduce((sum, v) => sum + v.stock, 0),
      inStock: variants.some((v) => v.stock > 0),
      images: rootImages.length > 0 ? rootImages : data.images,
      variants,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const errorId = logApiError("/api/products POST", error);
    return internalError(errorId);
  }
}
