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
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(200),
  price: z.number().positive().max(999999),
  stock: z.number().int().min(0).default(0),
  images: z.array(imageMetaSchema).max(20).optional().default([]),
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  price: z.number().positive().max(999999).optional(),
  category: z.string().min(1).optional(),
  images: z.array(z.string().url()).max(20).optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().max(100)).max(50).optional(),
  variants: z.array(variantSchema).max(100).optional(),
  brand: z.string().max(200).optional(),
  ingredients: z.string().max(5000).optional(),
  howToUse: z.string().max(5000).optional(),
  bestseller: z.boolean().optional(),
  newArrival: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .populate("category", "name slug")
      .limit(4)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ product, related }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/products/[id] GET", error, {
      id: params.id,
    });
    return internalError(errorId);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData = result.data as Record<string, unknown>;

    if (updateData.variants) {
      const variants = updateData.variants as Array<{
        price: number;
        stock: number;
        images: Array<{ url: string }>;
        name: string;
        sku: string;
      }>;
      const firstV = variants[0];
      updateData.price = firstV.price;
      updateData.stockQuantity = variants.reduce((s: number, v) => s + v.stock, 0);
      updateData.inStock = variants.some((v) => v.stock > 0);
      updateData.images = variants.reduce(
        (acc: string[], v) => [...acc, ...v.images.map((img) => img.url)],
        []
      );
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/products/[id] PUT", error, {
      id: params.id,
    });
    return internalError(errorId);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(params.id).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorId = logApiError("/api/products/[id] DELETE", error, {
      id: params.id,
    });
    return internalError(errorId);
  }
}
