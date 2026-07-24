import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { logApiError, internalError } from "@/lib/error-utils";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({
      email: result.data.email.toLowerCase(),
    }).lean();

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await User.create({
      email: result.data.email.toLowerCase(),
      name: result.data.name.trim(),
      password: hashPassword(result.data.password),
    });

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorId = logApiError("/api/auth/register POST", error);
    return internalError(errorId);
  }
}
