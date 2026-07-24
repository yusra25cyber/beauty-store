import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/requireAdmin";
import { logApiError, internalError } from "@/lib/error-utils";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(200),
  slug: z.string().max(200).optional(),
  image: z.string().max(1000).optional().default(""),
  description: z.string().max(2000).optional().default(""),
});

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ name: 1 }).lean();

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/categories GET", error);
    return internalError(errorId);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const slug =
      result.data.slug ||
      result.data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name: result.data.name,
      slug,
      image: result.data.image,
      description: result.data.description,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const errorId = logApiError("/api/categories POST", error, {
      hasName: !!request.body,
    });
    return internalError(errorId);
  }
}
