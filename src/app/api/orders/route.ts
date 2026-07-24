import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import { logApiError, internalError } from "@/lib/error-utils";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
        image: z.string().optional().default(""),
      })
    )
    .min(1, "At least one item is required"),
  customer: z.object({
    name: z.string().min(1, "Customer name is required").max(200),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required").max(50),
    address: z.string().min(1, "Address is required").max(500),
  }),
  paymentMethod: z.enum(["COD", "whatsapp"]),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const accessToken = searchParams.get("accessToken");

    if (email && !accessToken) {
      const orders = await Order.find({ "customer.email": email })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ orders }, { status: 200 });
    }

    if (!email && accessToken) {
      const auth = await requireAdmin(request);
      if (auth.response) return auth.response;

      const query: Record<string, unknown> = {};
      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ orders }, { status: 200 });
    }

    if (email && accessToken) {
      const auth = await requireAdmin(request);
      if (auth.response) return auth.response;

      const query: Record<string, unknown> = {
        "customer.email": email,
      };
      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ orders }, { status: 200 });
    }

    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    const errorId = logApiError("/api/orders GET", error, {
      url: request.url,
    });
    return internalError(errorId);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    await connectDB();

    for (const item of result.data.items) {
      const product = await Product.findById(item.productId).lean();

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name}" not found` },
          { status: 404 }
        );
      }

      if (item.price !== product.price) {
        return NextResponse.json(
          {
            error: `Price mismatch for "${item.name}". Expected ${product.price}, received ${item.price}. Please refresh and try again.`,
          },
          { status: 400 }
        );
      }
    }

    const total = result.data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      items: result.data.items,
      customer: result.data.customer,
      totalAmount: total,
      paymentMethod: result.data.paymentMethod,
      status: "pending",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const errorId = logApiError("/api/orders POST", error);
    return internalError(errorId);
  }
}
