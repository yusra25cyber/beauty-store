import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";
import { logApiError, internalError } from "@/lib/error-utils";

const updateOrderSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = request.nextUrl.searchParams.get("accessToken");

  if (!accessToken) {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;
  }

  try {
    await connectDB();

    const order = await Order.findById(params.id).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (
      !accessToken &&
      order.customer.email !== request.headers.get("x-customer-email")
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/orders/[id] GET", error, {
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
    const result = updateOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status: result.data.status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/orders/[id] PUT", error, {
      id: params.id,
    });
    return internalError(errorId);
  }
}
