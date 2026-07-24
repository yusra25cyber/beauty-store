import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import type { JWTPayload } from "@/lib/auth";

export async function requireAdmin(
  request: Request
): Promise<{ admin: JWTPayload; response?: never } | { admin?: never; response: NextResponse }> {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return {
      response: NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      ),
    };
  }

  return { admin };
}
