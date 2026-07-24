import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { logApiError, internalError } from "@/lib/error-utils";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    await connectDB();

    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }

    await Newsletter.create({ email: email.toLowerCase().trim() });

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
  } catch (error) {
    const errorId = logApiError("/api/newsletter POST", error);
    return internalError(errorId);
  }
}
