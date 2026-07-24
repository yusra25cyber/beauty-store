import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { signToken } from "@/lib/auth";
import { logApiError, internalError } from "@/lib/error-utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await Admin.findOne({ email: result.data.email }).select(
      "+password"
    );

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const bcrypt = await import("bcryptjs");
    const { compare } = bcrypt.default || bcrypt;

    const isValid = await compare(result.data.password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    const response = NextResponse.json(
      {
        admin: {
          id: admin._id,
          email: admin.email,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    const errorId = logApiError("/api/auth/login POST", error);
    return internalError(errorId);
  }
}
