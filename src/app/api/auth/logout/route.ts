import { NextResponse } from "next/server";
import { logApiError, internalError } from "@/lib/error-utils";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    const errorId = logApiError("/api/auth/logout POST", error);
    return internalError(errorId);
  }
}
