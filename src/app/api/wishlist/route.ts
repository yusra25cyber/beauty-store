import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { getCustomerSession } from "@/lib/customer-auth";
import { logApiError, internalError } from "@/lib/error-utils";

const addItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional().default(""),
});

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ email: session.user.email })
      .populate("items.productId")
      .lean();

    return NextResponse.json(
      { wishlist: wishlist || { email: session.user.email, items: [] } },
      { status: 200 }
    );
  } catch (error) {
    const errorId = logApiError("/api/wishlist GET", error);
    return internalError(errorId);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const result = addItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOneAndUpdate(
      { email: session.user.email },
      {
        $addToSet: {
          items: {
            productId: result.data.productId,
            variantId: result.data.variantId,
            addedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/wishlist POST", error);
    return internalError(errorId);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await connectDB();

    await Wishlist.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { items: { productId } } }
    );

    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/wishlist DELETE", error);
    return internalError(errorId);
  }
}
