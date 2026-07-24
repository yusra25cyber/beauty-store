import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import { logApiError, internalError } from "@/lib/error-utils";

const updateCategorySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().max(200).optional(),
  image: z.string().max(1000).optional(),
  description: z.string().max(2000).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const category = await Category.findById(params.id).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/categories/[id] GET", error, {
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
    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const category = await Category.findByIdAndUpdate(
      params.id,
      { $set: result.data },
      { new: true, runValidators: true }
    ).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/categories/[id] PUT", error, {
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

    const productsCount = await Product.countDocuments({
      category: params.id,
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${productsCount} product(s) are using it. Remove or reassign the products first.`,
        },
        { status: 409 }
      );
    }

    const category = await Category.findByIdAndDelete(params.id).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorId = logApiError("/api/categories/[id] DELETE", error, {
      id: params.id,
    });
    return internalError(errorId);
  }
}
