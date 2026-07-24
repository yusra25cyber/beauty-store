import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { logApiError, internalError } from "@/lib/error-utils";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required").max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    await connectDB();

    const Contact = mongoose.models.Contact || mongoose.model("Contact", new mongoose.Schema({
      name: { type: String, required: true, maxlength: 200, trim: true },
      email: { type: String, required: true, maxlength: 200, trim: true },
      message: { type: String, required: true, maxlength: 5000, trim: true },
    }, { timestamps: true }));

    await Contact.create(result.data);

    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    const errorId = logApiError("/api/contact POST", error);
    return internalError(errorId);
  }
}
