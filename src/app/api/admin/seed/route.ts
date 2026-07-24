import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { logApiError, internalError } from "@/lib/error-utils";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seedSecret = searchParams.get("secret");

    const expectedSecret = process.env.SEED_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "SEED_SECRET environment variable is not configured" },
        { status: 500 }
      );
    }

    if (!seedSecret || seedSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid or missing seed secret" },
        { status: 401 }
      );
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_INITIAL_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD must be set in environment variables",
        },
        { status: 500 }
      );
    }

    await connectDB();

    const existing = await Admin.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { message: "Admin account already exists" },
        { status: 200 }
      );
    }

    const bcrypt = await import("bcryptjs");
    const { hash } = bcrypt.default || bcrypt;

    const hashedPassword = await hash(password, 12);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Admin account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    const errorId = logApiError("/api/admin/seed POST", error);
    return internalError(errorId);
  }
}
